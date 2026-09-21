/* WAZI Civic — per-socket bridge between a browser and one Gemini Live session.
 *
 * Wire contract (see also src/lib/live-protocol.ts, which must stay in step):
 *
 *   browser -> server
 *     binary frame            raw PCM16LE mono @16kHz microphone audio
 *     {type:'start', ...}     open the Gemini session
 *     {type:'text', text}     a typed turn
 *     {type:'moment', moment} a UX moment prompt (wake / idle_farewell / ...)
 *     {type:'tool_result',...}the browser's answer to a tool call
 *     {type:'mic_end'}        microphone closed; flush VAD
 *
 *   server -> browser
 *     binary frame            raw PCM16LE mono @24kHz WAZI audio
 *     {type:'ready', ...}     session is live; carries the model actually used
 *     {type:'turn_start'}     WAZI has begun a spoken turn
 *     {type:'turn_complete'}  WAZI finished the turn
 *     {type:'interrupted'}    the user barged in; drop any queued audio
 *     {type:'transcript',...} incremental speech-to-text, either direction
 *     {type:'tool_call',...}  the model wants the interface to do something
 *     {type:'error', ...}     something went wrong; `fatal` says whether to retry
 *
 * Binary frames carry no header. They do not need one: direction determines the
 * sample rate, both are mono PCM16LE, and keeping them header-free means the
 * browser can hand the buffer straight to the decoder with zero copying.
 */

import { WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';

import {
  buildSystemInstruction,
  MOMENT_PROMPTS,
  resolvePersona,
  timeOfDayContext
} from './wazi-identity.js';
import { buildModelChain, buildLiveConfig, INPUT_MIME, OUTPUT_SAMPLE_RATE } from './live-models.js';
import { CIVIC_TOOLS } from './civic-tools.js';
import { park, claim, discard } from './session-vault.js';

const MAX_AUDIO_FRAME_BYTES = 64 * 1024; // a well-behaved client sends ~2KB frames
const START_TIMEOUT_MS = 15_000;

/** Classifies a Gemini close reason so the browser knows whether retrying helps. */
function classifyFailure(reason = '') {
  const r = String(reason).toLowerCase();
  if (r.includes('quota') || r.includes('exceeded') || r.includes('resource_exhausted')) {
    return { code: 'quota_exhausted', fatal: true, message: 'Voice quota reached for this API key. Try again shortly.' };
  }
  if (r.includes('api key') || r.includes('permission') || r.includes('unauthenticated') || r.includes('403')) {
    return { code: 'auth', fatal: true, message: 'The server could not authenticate with Gemini. Check GEMINI_API_KEY.' };
  }
  if (r.includes('invalid argument') || r.includes('cannot find field')) {
    return { code: 'unsupported_config', fatal: false, message: 'This model rejected the session configuration.' };
  }
  if (r.includes('not found') || r.includes('404')) {
    return { code: 'model_unavailable', fatal: false, message: 'That Live model is not available to this key.' };
  }
  return { code: 'live_failed', fatal: false, message: reason || 'The live voice session ended unexpectedly.' };
}

export class LiveBridge {
  /**
   * @param {import('ws').WebSocket} ws     socket to the browser
   * @param {object} opts
   * @param {string} opts.apiKey            Gemini key — stays on this side of the wire
   * @param {string} [opts.preferredModel]  GEMINI_LIVE_MODEL pin, if any
   * @param {string} [opts.jurisdiction]    country pack loaded in this deployment
   * @param {(...a:any[])=>void} [opts.log]
   */
  constructor(ws, { apiKey, preferredModel, jurisdiction, log = () => {} }) {
    this.ws = ws;
    this.apiKey = apiKey;
    this.preferredModel = preferredModel;
    this.jurisdiction = jurisdiction;
    this.log = log;

    this.ai = new GoogleGenAI({ apiKey });
    this.session = null;
    this.holder = null;      // { session, sink, backlog } — shared with the vault
    this.clientId = null;    // the browser's id, for parking across a drop
    this.saidGoodbye = false;// an intentional end, vs. a connection that dropped
    this.model = null;
    this.starting = null;      // in-flight start promise — serialises concurrent starts
    this.closed = false;
    this.speaking = false;     // is WAZI mid-turn right now
    this.framesIn = 0;
    this.framesOut = 0;

    ws.on('message', (data, isBinary) => this._onClientMessage(data, isBinary));
    ws.on('close', () => this.dispose('client closed'));
    ws.on('error', (err) => {
      this.log('browser socket error:', err?.message);
      this.dispose('socket error');
    });
  }

  // ─────────────────────────────────────────────────────────── outbound

  _send(obj) {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(obj));
  }

  _sendAudio(buf) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.framesOut++;
      this.ws.send(buf, { binary: true });
    }
  }

  _fail(code, message, fatal) {
    this._send({ type: 'error', code, message, fatal: Boolean(fatal) });
  }

  // ─────────────────────────────────────────────────────── client input

  async _onClientMessage(data, isBinary) {
    if (this.closed) return;

    if (isBinary) {
      // Hot path: microphone audio. Nothing is parsed, nothing is buffered.
      if (!this.session) return; // audio before `start` is simply dropped
      if (data.length > MAX_AUDIO_FRAME_BYTES) {
        this.log(`dropping oversized audio frame (${data.length} bytes)`);
        return;
      }
      try {
        this.framesIn++;
        this.session.sendRealtimeInput({
          audio: { data: data.toString('base64'), mimeType: INPUT_MIME }
        });
      } catch (err) {
        this.log('sendRealtimeInput failed:', err?.message);
      }
      return;
    }

    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      this.log('ignoring non-JSON control frame');
      return;
    }

    switch (msg.type) {
      case 'start':
        await this._start(msg);
        break;

      case 'text':
        if (!this.session || !msg.text?.trim()) return;
        this.session.sendClientContent({
          turns: [{ role: 'user', parts: [{ text: msg.text }] }],
          turnComplete: true
        });
        break;

      case 'moment': {
        const prompt = MOMENT_PROMPTS[msg.moment];
        if (!this.session || !prompt) return;
        this.session.sendClientContent({
          turns: [{ role: 'user', parts: [{ text: prompt }] }],
          turnComplete: true
        });
        break;
      }

      case 'tool_result':
        if (!this.session || !msg.id) return;
        this.session.sendToolResponse({
          functionResponses: [{ id: msg.id, name: msg.name, response: msg.response ?? { ok: true } }]
        });
        break;

      case 'bye':
        // The user chose to end this, so nothing is parked.
        this.saidGoodbye = true;
        if (this.clientId) discard(this.clientId);
        break;

      case 'mic_end':
        // Tell VAD the stream stopped, rather than leaving it waiting on silence
        // that will never arrive.
        if (this.session) {
          try {
            this.session.sendRealtimeInput({ audioStreamEnd: true });
          } catch (err) {
            this.log('audioStreamEnd failed:', err?.message);
          }
        }
        break;

      default:
        this.log('unknown control frame:', msg.type);
    }
  }

  // ───────────────────────────────────────────────────── session opening

  async _start(msg) {
    if (this.session) return;            // already live
    if (this.starting) return this.starting; // a concurrent frame beat us here

    this.starting = this._openWithFallback(msg).finally(() => {
      this.starting = null;
    });
    return this.starting;
  }

  async _openWithFallback(msg) {
    const persona = resolvePersona(msg.voice);
    this.clientId = typeof msg.sessionId === 'string' ? msg.sessionId : null;

    // Did this browser drop out a moment ago? If its session is still parked,
    // pick the conversation back up rather than starting a new one — the user
    // should not have to re-explain their case because a bus went past a mast.
    const resumed = claim(this.clientId);
    if (resumed) {
      this.log(`resumed parked session on ${resumed.model.id}`);
      this._adopt(resumed);
      this._send({
        type: 'ready',
        model: resumed.model.id,
        modelLabel: resumed.model.label,
        voice: persona.id,
        personaName: persona.displayName,
        outputSampleRate: resumed.model.outputSampleRate || OUTPUT_SAMPLE_RATE,
        capabilities: resumed.model.capabilities,
        resumed: true
      });
      return;
    }

    const { text: systemInstruction } = buildSystemInstruction({
      voiceId: persona.id,
      languageHint: msg.languageHint,
      jurisdiction: this.jurisdiction
    });

    const chain = buildModelChain(this.preferredModel);
    const attempts = [];

    for (const model of chain) {
      if (this.closed) return;
      try {
        const holder = await this._openOne(model, systemInstruction, persona);
        const session = holder.session;

        this._send({
          type: 'ready',
          model: model.id,
          modelLabel: model.label,
          voice: persona.id,
          personaName: persona.displayName,
          outputSampleRate: model.outputSampleRate || OUTPUT_SAMPLE_RATE,
          capabilities: model.capabilities
        });
        this.log(`live session open on ${model.id} (voice ${persona.id})`);
        this._adopt(holder);

        // The wake prompt goes out only after the browser knows we are ready,
        // so the very first syllable is never dropped on the floor.
        const moment = msg.resumed ? 'rewake' : 'wake';
        session.sendClientContent({
          turns: [
            {
              role: 'user',
              parts: [{ text: MOMENT_PROMPTS[moment] + timeOfDayContext(msg.localHour) }]
            }
          ],
          turnComplete: true
        });
        return;
      } catch (err) {
        const info = classifyFailure(err?.message || err);
        attempts.push(`${model.id}: ${info.code}`);
        this.log(`model ${model.id} unusable (${info.code}): ${err?.message || err}`);
        if (info.fatal) {
          this._fail(info.code, info.message, true);
          return;
        }
      }
    }

    this._fail(
      'no_model',
      'No Gemini Live model accepted this session. Tried: ' + attempts.join('; '),
      true
    );
  }

  /** Opens one model, resolving only once the server has acknowledged `setup`. */
  async _openOne(model, systemInstruction, persona) {
    const config = buildLiveConfig(model, {
      systemInstruction,
      voiceName: persona.id,
      tools: CIVIC_TOOLS
    });

    // `setupComplete` is the only proof the model accepted our config, and it
    // can land before connect() resolves — so it is latched here rather than
    // waited on, and the post-connect await below reads the latch.
    let setupSeen = false;
    let failure = null;
    let session = null;
    let notify = () => {};

    // The holder is what actually survives a dropped connection: it owns the
    // Gemini session and points at whichever bridge is currently listening.
    // While `sink` is null — between setup and adoption, or while the session
    // is parked waiting for a browser to come back — frames are held here
    // rather than thrown away.
    const holder = { session: null, sink: null, backlog: [], model };
    const settledOrChanged = () => new Promise((r) => { notify = r; });

    const mark = (err) => {
      if (err && !failure) failure = err;
      notify();
    };

    session = await this.ai.live.connect({
      model: model.id,
      config,
      callbacks: {
        onmessage: (m) => {
          if (m.setupComplete && !setupSeen) {
            setupSeen = true;
            mark(null);
          }
          // The model may start speaking the moment setup completes, which can
          // be before the caller has adopted this session. Those frames are
          // real audio, so they are held and replayed rather than dropped.
          if (!setupSeen || m.setupComplete) return;
          if (holder.sink) holder.sink._onGeminiMessage(m);
          else if (holder.backlog.length < 400) holder.backlog.push(m);
        },
        onerror: (e) => {
          const err = new Error(e?.message || 'live socket error');
          if (!setupSeen) return mark(err);
          holder.sink?._onGeminiDown(err.message);
        },
        onclose: (e) => {
          const reason = e?.reason || '';
          if (!setupSeen) return mark(new Error(reason || 'closed before setup'));
          holder.sink?._onGeminiDown(reason);
        }
      }
    });

    if (!setupSeen && !failure) {
      const timeout = new Promise((r) =>
        setTimeout(() => {
          if (!setupSeen && !failure) failure = new Error(`setup timed out after ${START_TIMEOUT_MS}ms`);
          r();
        }, START_TIMEOUT_MS).unref?.()
      );
      await Promise.race([settledOrChanged(), timeout]);
    }

    if (failure || !setupSeen) {
      try { session.close(); } catch { /* already gone */ }
      throw failure || new Error('setup never completed');
    }

    holder.session = session;
    return holder;
  }

  /** Points a holder at this bridge and replays anything it held. */
  _adopt(holder) {
    this.holder = holder;
    this.session = holder.session;
    this.model = holder.model;
    holder.sink = this;
    while (holder.backlog.length) this._onGeminiMessage(holder.backlog.shift());
  }

  // ────────────────────────────────────────────────────── gemini inbound

  _onGeminiMessage(m) {
    const sc = m.serverContent;

    if (m.toolCall?.functionCalls?.length) {
      this._send({
        type: 'tool_call',
        calls: m.toolCall.functionCalls.map((fc) => ({
          id: fc.id,
          name: fc.name,
          args: fc.args || {}
        }))
      });
    }

    if (m.goAway) {
      // The service is about to drop us. Tell the browser now so it can
      // reconnect on its own terms instead of hitting a silent dead socket.
      this._send({ type: 'go_away', timeLeft: m.goAway.timeLeft || null });
    }

    if (!sc) return;

    if (sc.interrupted) {
      this.speaking = false;
      this._send({ type: 'interrupted' });
    }

    if (sc.inputTranscription?.text) {
      this._send({ type: 'transcript', role: 'user', text: sc.inputTranscription.text, final: false });
    }
    if (sc.outputTranscription?.text) {
      this._send({ type: 'transcript', role: 'wazi', text: sc.outputTranscription.text, final: false });
    }

    for (const part of sc.modelTurn?.parts || []) {
      const inline = part.inlineData;
      if (!inline?.data) continue;
      if (!this.speaking) {
        this.speaking = true;
        this._send({ type: 'turn_start' });
      }
      this._sendAudio(Buffer.from(inline.data, 'base64'));
    }

    if (sc.turnComplete) {
      this.speaking = false;
      this._send({ type: 'turn_complete' });
    }
  }

  _onGeminiDown(reason) {
    if (this.closed) return;
    const info = classifyFailure(reason);
    this.log(`gemini session down (${info.code}): ${reason}`);
    this.session = null;
    this._fail(info.code, info.message, info.fatal);
  }

  // ──────────────────────────────────────────────────────────── teardown

  dispose(why = '') {
    if (this.closed) return;
    this.closed = true;
    this.log(
      `bridge closed (${why}) — ${this.framesIn} mic frames in, ${this.framesOut} audio frames out`
    );

    if (this.holder) {
      if (!this.saidGoodbye && this.clientId) {
        // The connection dropped rather than ended. Hold the conversation open
        // briefly in case the browser comes straight back.
        park(this.clientId, this.holder, this.log);
      } else {
        if (this.holder.sink === this) this.holder.sink = null;
        try { this.holder.session.close(); } catch { /* already gone */ }
      }
      this.holder = null;
    }
    this.session = null;
    if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
      try { this.ws.close(); } catch { /* already gone */ }
    }
  }
}
