#!/usr/bin/env node
/* WAZI Civic — end-to-end live voice verification.
 *
 * Drives the running proxy over its real wire protocol, exactly as the browser
 * does, with real speech audio. A browser cannot be scripted in CI, but the
 * proxy's contract can — and that contract is where the pipeline broke before.
 *
 *   npm run dev:server        # in one terminal
 *   npm run verify:live       # in another
 *
 * Checks, in one session:
 *   1. /api/health reports a configured key and a model chain
 *   2. the socket reaches `ready` on a real Live model
 *   3. WAZI opens the conversation unprompted (wake moment -> audio out)
 *   4. 16kHz PCM speech in produces a user transcript (the microphone path)
 *   5. 24kHz PCM audio comes back (the speaker path)
 *   6. the reply is in the language that was spoken, not a default
 *   7. the model drives the UI through tool calls
 *   8. a dropped connection resumes the same conversation, not a new one
 *
 * Test speech is synthesised once via the TTS model and cached under .cache/.
 */

import WebSocket from 'ws';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const BASE = process.env.WAZI_VERIFY_URL || 'http://localhost:3000';
const WS_URL = BASE.replace(/^http/, 'ws') + '/live';
const KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const CACHE = path.resolve('.cache');

const UTTERANCE =
  'Say this warmly in a Nigerian accent: Abeg, the borehole for my street never work since January, ' +
  'and dem talk say the project don complete. Wetin I fit do?';

// ─────────────────────────────────────────────────────────── assertions

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? '  \x1b[32m✓\x1b[0m' : '  \x1b[31m✗\x1b[0m'} ${name}${detail ? `\n      ${detail}` : ''}`);
};

// ───────────────────────────────────────────────────────── test speech

/** Synthesise the test utterance once, resample 24k -> 16k, cache the PCM. */
async function getTestSpeech16k() {
  const cached = path.join(CACHE, 'verify-utterance-16k.pcm');
  if (fs.existsSync(cached)) return fs.readFileSync(cached);
  if (!KEY) throw new Error('GEMINI_API_KEY is required to synthesise the test utterance');

  console.log('  synthesising test speech (cached after the first run)…');
  const ai = new GoogleGenAI({ apiKey: KEY });
  const r = await ai.models.generateContent({
    model: process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts',
    contents: [{ role: 'user', parts: [{ text: UTTERANCE }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
    }
  });
  const inline = r.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData;
  if (!inline) throw new Error('TTS returned no audio');

  const raw = Buffer.from(inline.data, 'base64');
  const src = new Int16Array(raw.buffer, raw.byteOffset, raw.length / 2);
  const ratio = 24000 / 16000;
  const out = new Int16Array(Math.floor(src.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const p = i * ratio;
    const i0 = Math.floor(p);
    const i1 = Math.min(i0 + 1, src.length - 1);
    const f = p - i0;
    out[i] = Math.round(src[i0] * (1 - f) + src[i1] * f);
  }
  const buf = Buffer.from(out.buffer, out.byteOffset, out.byteLength);
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(cached, buf);
  return buf;
}

// ───────────────────────────────────────────────────────────── session

const waiters = [];
/** Resolves when a server frame satisfies `pred`, or rejects on timeout. */
function waitFor(label, pred, ms = 30000) {
  return new Promise((resolve, reject) => {
    const w = { pred, resolve, timer: null };
    w.timer = setTimeout(() => {
      waiters.splice(waiters.indexOf(w), 1);
      reject(new Error(`timed out waiting for ${label}`));
    }, ms);
    waiters.push(w);
  });
}
function deliver(msg) {
  for (let i = waiters.length - 1; i >= 0; i--) {
    if (waiters[i].pred(msg)) {
      clearTimeout(waiters[i].timer);
      waiters[i].resolve(msg);
      waiters.splice(i, 1);
    }
  }
}

async function main() {
  console.log('\n\x1b[1mWAZI live pipeline verification\x1b[0m');
  console.log(`  proxy: ${BASE}\n`);

  // ── 1. health
  const health = await fetch(`${BASE}/api/health`).then((r) => r.json());
  check('proxy is up with a configured Gemini key', health.ok && health.liveConfigured);
  check('a Live model chain is published', (health.models?.length || 0) > 0,
    health.models?.map((m) => m.id).join(' → '));
  check('audio contract is 16kHz in / 24kHz out',
    health.audio?.inputSampleRate === 16000 && health.audio?.outputSampleRate === 24000);

  const speech = await getTestSpeech16k();
  console.log(`  test utterance: ${(speech.length / 2 / 16000).toFixed(2)}s of 16kHz PCM\n`);

  // ── 2. connect
  const ws = new WebSocket(WS_URL);
  const state = {
    ready: null, audioFrames: 0, audioBytes: 0,
    waziText: '', userText: '', toolCalls: [], errors: []
  };

  ws.on('message', (data, isBinary) => {
    if (isBinary) {
      state.audioFrames++;
      state.audioBytes += data.length;
      deliver({ type: '__audio', bytes: data.length });
      return;
    }
    const msg = JSON.parse(data.toString());
    if (msg.type === 'ready') state.ready = msg;
    if (msg.type === 'transcript') {
      if (msg.role === 'wazi') state.waziText += msg.text;
      else state.userText += msg.text;
    }
    if (msg.type === 'tool_call') {
      state.toolCalls.push(...msg.calls);
      // Answer like the browser would, so the model can keep going.
      for (const c of msg.calls) {
        ws.send(JSON.stringify({ type: 'tool_result', id: c.id, name: c.name, response: { ok: true } }));
      }
    }
    if (msg.type === 'error') state.errors.push(msg);
    deliver(msg);
  });

  await new Promise((res, rej) => {
    ws.once('open', res);
    ws.once('error', rej);
  });

  const TAB_ID = `verify_${Date.now().toString(36)}`;
  ws.send(JSON.stringify({ type: 'start', voice: 'Kore', languageHint: 'en-NG', sessionId: TAB_ID, localHour: 10 }));

  const ready = await waitFor('ready', (m) => m.type === 'ready');
  check('live session opened', true, `${ready.modelLabel} (${ready.model}), voice ${ready.voice} → "${ready.personaName}"`);

  // ── 3. WAZI speaks first, unprompted
  await waitFor('wake audio', (m) => m.type === '__audio');
  await waitFor('wake turn to finish', (m) => m.type === 'turn_complete', 40000);
  const greeting = state.waziText.trim();
  check('WAZI opens the conversation unprompted', state.audioFrames > 0 && greeting.length > 0,
    `${state.audioFrames} frames / ${(state.audioBytes / 2 / 24000).toFixed(2)}s — "${greeting.slice(0, 90)}"`);

  // ── 4/5/6. speak to it and listen back
  state.waziText = '';
  const framesBefore = state.audioFrames;
  const FRAME = 640; // 20ms of 16kHz PCM16 — what the browser worklet emits
  const t0 = Date.now();
  for (let off = 0; off < speech.length; off += FRAME) {
    ws.send(speech.subarray(off, Math.min(off + FRAME, speech.length)));
    await new Promise((r) => setTimeout(r, 4)); // faster than realtime, still paced
  }
  ws.send(JSON.stringify({ type: 'mic_end' }));

  await waitFor('reply audio', (m) => m.type === '__audio', 45000);
  const firstAudioMs = Date.now() - t0;
  await waitFor('reply turn to finish', (m) => m.type === 'turn_complete', 45000);

  check('microphone path: 16kHz PCM in was transcribed', state.userText.trim().length > 0,
    `heard: "${state.userText.trim()}"`);
  check('speaker path: 24kHz PCM came back', state.audioFrames > framesBefore,
    `${state.audioFrames - framesBefore} frames, first audio ${firstAudioMs}ms after speech started`);

  const reply = state.waziText.trim();
  // The utterance is Nigerian Pidgin. A reply that mirrors it carries Pidgin
  // markers; a reply that ignored the speaker reads as flat standard English.
  const pidginMarkers = /\b(abeg|wetin|dey|una|na |no be|don |sabi|o\b|oo\b|make we|shey|wahala|fit)\b/i;
  check('language mirroring: replied in the dialect that was spoken',
    pidginMarkers.test(reply), `said: "${reply.slice(0, 140)}"`);

  const langCall = state.toolCalls.find((c) => c.name === 'note_detected_language');
  check('language reported to the interface automatically', Boolean(langCall),
    langCall ? `${langCall.args.display_name} (${langCall.args.bcp47})` : 'note_detected_language was never called');

  // ── 7. voice drives the UI
  //
  // The assertion is over the WHOLE session, not over one nominated turn. WAZI
  // opens the board as soon as the spoken description gives her a claim and a
  // place, which is usually the first utterance — an earlier version of this
  // check only counted calls made after a later follow-up and so reported a
  // failure while the app was behaving correctly. If she has already opened it,
  // declining to open it a second time is right, not a miss.
  let uiCall = state.toolCalls.find((c) => c.name !== 'note_detected_language');

  if (!uiCall) {
    // She did not act on the description alone. A direct instruction must work.
    ws.send(JSON.stringify({
      type: 'text',
      text: 'Please open the evidence board for it. The signboard says the borehole project was completed in 2024.'
    }));
    try {
      await waitFor('an interface tool call', (m) => m.type === 'tool_call', 40000);
    } catch { /* asserted below */ }
    uiCall = state.toolCalls.find((c) => c.name !== 'note_detected_language');
  }

  check('voice drives the interface through tool calls', Boolean(uiCall),
    uiCall ? `${uiCall.name}(${JSON.stringify(uiCall.args).slice(0, 120)})` : 'no interface tool call arrived');

  check('no errors were reported on the socket', state.errors.length === 0,
    state.errors.map((e) => `${e.code}: ${e.message}`).join('; '));

  // ── 8. survive a dropped connection
  // Terminate without saying goodbye, exactly as a phone losing signal does.
  ws.terminate();
  await new Promise((r) => setTimeout(r, 1500));

  const ws2 = new WebSocket(WS_URL);
  const resumeState = { ready: null };
  ws2.on('message', (data, isBinary) => {
    if (isBinary) return;
    const msg = JSON.parse(data.toString());
    if (msg.type === 'ready') resumeState.ready = msg;
    deliver(msg);
  });
  await new Promise((res, rej) => {
    ws2.once('open', res);
    ws2.once('error', rej);
  });
  ws2.send(JSON.stringify({ type: 'start', voice: 'Kore', sessionId: TAB_ID, resumed: true, localHour: 10 }));

  try {
    await waitFor('ready on the reconnected socket', (m) => m.type === 'ready', 20000);
  } catch { /* asserted below */ }

  check('a dropped connection resumes the same conversation',
    Boolean(resumeState.ready?.resumed),
    resumeState.ready
      ? (resumeState.ready.resumed
          ? 'reclaimed the parked Gemini session, context intact'
          : 'a NEW session was opened — the user would have to start over')
      : 'no ready frame came back');

  ws2.send(JSON.stringify({ type: 'bye' }));
  ws2.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed\n`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(`\n\x1b[31mverification aborted:\x1b[0m ${err.message}\n`);
  process.exit(1);
});
