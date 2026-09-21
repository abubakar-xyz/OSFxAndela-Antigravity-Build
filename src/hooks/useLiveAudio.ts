/* WAZI Civic — the live voice session, as one React hook.
 *
 * This is the whole conversational surface the app talks to: connect, speak,
 * listen, and receive the transcripts and interface commands that come back.
 * The Web Speech API appears nowhere in it, by design — `speechSynthesis` and
 * `webkitSpeechRecognition` are a different product wearing WAZI's clothes.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { MicCapture } from '../lib/audio/MicCapture';
import { PcmPlayer } from '../lib/audio/PcmPlayer';
import {
  OUTPUT_SAMPLE_RATE,
  isServerMessage,
  type ClientMessage,
  type MomentName,
  type ServerMessage,
  type ToolCall
} from '../lib/live-protocol';
import type { WaziState } from '../lib/types';

const MAX_RECONNECT_ATTEMPTS = 4;
const IDLE_FAREWELL_MS = 60_000;

/** Language WAZI has decided the user is speaking, reported by the model itself. */
export interface DetectedLanguage {
  bcp47: string;
  displayName: string;
  register?: string;
  confidence?: number;
}

export interface LiveTranscript {
  role: 'user' | 'wazi';
  text: string;
  /** False while the sentence is still being spoken. */
  final: boolean;
}

export interface UseLiveAudioOptions {
  /** Prebuilt voice / persona id. */
  voice?: string;
  /** What the interface last believed the language was. A hint, not a setting. */
  languageHint?: string;
  /** A completed utterance from either side. */
  onTranscript?: (t: LiveTranscript) => void;
  /** The model asking the interface to do something. Return a value to answer it. */
  onToolCall?: (call: ToolCall) => unknown | Promise<unknown>;
  /** WAZI reported which language she is now speaking. */
  onLanguageDetected?: (lang: DetectedLanguage) => void;
}

function resolveSocketUrl(): string {
  const configured = import.meta.env.VITE_WS_PROXY_URL;
  if (configured) return configured;
  // Same origin by default: in dev Vite proxies /live to the node server, and in
  // production both are served from one place. Hardcoding localhost here is why
  // the old build could never work on a phone on the same network.
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/live`;
}

export function useLiveAudio(options: UseLiveAudioOptions = {}) {
  const { voice = 'Kore', languageHint, onTranscript, onToolCall, onLanguageDetected } = options;

  const [waziState, setWaziState] = useState<WaziState>('resting');
  const [micLevel, setMicLevel] = useState(0);
  const [speakerLevel, setSpeakerLevel] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [modelLabel, setModelLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Callbacks live in refs so that a parent re-render never tears the socket
  // down. The previous hook listed `connect` in its own effect dependencies,
  // which meant a stale closure kept reconnecting with last render's voice.
  // They are written after commit, never during render.
  const handlers = useRef({ onTranscript, onToolCall, onLanguageDetected });
  const sessionConfig = useRef({ voice, languageHint });

  useEffect(() => {
    handlers.current = { onTranscript, onToolCall, onLanguageDetected };
    sessionConfig.current = { voice, languageHint };
  }, [onTranscript, onToolCall, onLanguageDetected, voice, languageHint]);

  const wsRef = useRef<WebSocket | null>(null);
  const micRef = useRef<MicCapture | null>(null);
  const playerRef = useRef<PcmPlayer | null>(null);

  const reconnectsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentionalCloseRef = useRef(false);
  const hasConnectedRef = useRef(false);
  const levelRafRef = useRef<number | null>(null);
  // Reconnection re-enters connect(), so it goes through a ref rather than the
  // callback capturing itself while it is still being initialised.
  const connectRef = useRef<() => Promise<void>>(async () => {});

  const send = useCallback((msg: ClientMessage) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      send({ type: 'moment', moment: 'idle_farewell' });
    }, IDLE_FAREWELL_MS);
  }, [send]);

  /** Mirrors the player's playback-time level into React state on rAF. */
  const startLevelPump = useCallback(() => {
    if (levelRafRef.current !== null) return;
    const tick = () => {
      levelRafRef.current = requestAnimationFrame(tick);
      const player = playerRef.current;
      if (player) setSpeakerLevel(player.level);
    };
    levelRafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLevelPump = useCallback(() => {
    if (levelRafRef.current !== null) {
      cancelAnimationFrame(levelRafRef.current);
      levelRafRef.current = null;
    }
    setSpeakerLevel(0);
  }, []);

  // ──────────────────────────────────────────────── server messages

  const handleServerMessage = useCallback(
    async (msg: ServerMessage) => {
      switch (msg.type) {
        case 'ready':
          setModelLabel(msg.modelLabel);
          setError(null);
          reconnectsRef.current = 0;
          setWaziState('listening');
          resetIdleTimer();
          break;

        case 'turn_start':
          setWaziState('speaking');
          break;

        case 'turn_complete':
          // Deliberately not flipping to 'listening' here: the server has
          // finished *sending*, but seconds of audio may still be queued. The
          // player's own speaking callback moves the state when the last sample
          // actually leaves the speakers.
          resetIdleTimer();
          break;

        case 'interrupted':
          // The user talked over WAZI. Everything queued is stale.
          playerRef.current?.interrupt();
          setWaziState('listening');
          resetIdleTimer();
          break;

        case 'transcript':
          handlers.current.onTranscript?.({ role: msg.role, text: msg.text, final: msg.final });
          if (msg.role === 'user') resetIdleTimer();
          break;

        case 'tool_call':
          for (const call of msg.calls) {
            if (call.name === 'note_detected_language') {
              const args = call.args as Record<string, string | number>;
              handlers.current.onLanguageDetected?.({
                bcp47: String(args.bcp47 ?? ''),
                displayName: String(args.display_name ?? ''),
                register: args.register ? String(args.register) : undefined,
                confidence: typeof args.confidence === 'number' ? args.confidence : undefined
              });
            }
            let response: unknown = { ok: true };
            try {
              response = (await handlers.current.onToolCall?.(call)) ?? { ok: true };
            } catch (err) {
              response = { ok: false, error: String(err) };
            }
            // The model is waiting on this before it continues the sentence, so
            // every call is answered, including ones the app chose to ignore.
            send({ type: 'tool_result', id: call.id, name: call.name, response });
          }
          break;

        case 'go_away':
          // Gemini is about to drop us. Close on our own terms so the reconnect
          // path runs cleanly rather than after a silent dead socket.
          intentionalCloseRef.current = false;
          wsRef.current?.close();
          break;

        case 'error':
          setError(msg.message);
          if (msg.fatal) {
            intentionalCloseRef.current = true;
            setWaziState('error');
            wsRef.current?.close();
          }
          break;
      }
    },
    [resetIdleTimer, send]
  );

  // ─────────────────────────────────────────────────────── connect

  const connect = useCallback(async () => {
    if (wsRef.current) return;

    setError(null);
    intentionalCloseRef.current = false;
    setWaziState('waiting_permission');

    const player = new PcmPlayer(OUTPUT_SAMPLE_RATE, {
      onSpeakingChange: (speaking) => {
        if (speaking) {
          setWaziState('speaking');
          startLevelPump();
        } else {
          stopLevelPump();
          setWaziState((current) => (current === 'speaking' ? 'listening' : current));
          resetIdleTimer();
        }
      }
    });
    playerRef.current = player;

    try {
      // Both of these must happen inside the user gesture that called connect().
      // An AudioContext created later starts suspended and WAZI is silently mute.
      await player.resume();

      const mic = new MicCapture({
        onFrame: (pcm) => {
          const ws = wsRef.current;
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(pcm.buffer as ArrayBuffer);
          }
        },
        onLevel: setMicLevel
      });
      micRef.current = mic;
      await mic.start();
    } catch (err) {
      console.error('[wazi] could not open the microphone:', err);
      setError('WAZI needs microphone access to talk with you. Check your browser permissions.');
      setWaziState('error');
      await micRef.current?.stop();
      await playerRef.current?.close();
      micRef.current = null;
      playerRef.current = null;
      return;
    }

    const ws = new WebSocket(resolveSocketUrl());
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setWaziState('listening');
      send({
        type: 'start',
        voice: sessionConfig.current.voice,
        languageHint: sessionConfig.current.languageHint,
        resumed: hasConnectedRef.current
      });
      hasConnectedRef.current = true;
      resetIdleTimer();
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Hot path: WAZI's voice. Straight into the playback queue.
        playerRef.current?.enqueue(new Int16Array(event.data));
        return;
      }
      try {
        const parsed: unknown = JSON.parse(String(event.data));
        if (isServerMessage(parsed)) void handleServerMessage(parsed);
      } catch {
        /* a frame we do not understand is not worth crashing over */
      }
    };

    ws.onerror = () => {
      // `onerror` carries no detail by spec; `onclose` decides what happens next.
      setError((current) => current ?? 'Lost contact with the voice server.');
    };

    ws.onclose = () => {
      wsRef.current = null;
      setIsConnected(false);
      stopLevelPump();
      void playerRef.current?.close();
      void micRef.current?.stop();
      playerRef.current = null;
      micRef.current = null;

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      if (intentionalCloseRef.current) {
        setWaziState('resting');
        return;
      }

      if (reconnectsRef.current < MAX_RECONNECT_ATTEMPTS) {
        const attempt = ++reconnectsRef.current;
        const delay = Math.min(8000, 2 ** (attempt - 1) * 1000);
        setWaziState('thinking');
        setError(`Reconnecting… (${attempt}/${MAX_RECONNECT_ATTEMPTS})`);
        reconnectTimerRef.current = setTimeout(() => void connectRef.current(), delay);
      } else {
        setWaziState('error');
        setError('Could not reach the voice server. Tap Talk to try again.');
      }
    };
  }, [handleServerMessage, resetIdleTimer, send, startLevelPump, stopLevelPump]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // ──────────────────────────────────────────────────── disconnect

  const disconnect = useCallback(() => {
    intentionalCloseRef.current = true;
    reconnectsRef.current = 0;

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    send({ type: 'mic_end' });
    wsRef.current?.close();
    wsRef.current = null;

    stopLevelPump();
    void micRef.current?.stop();
    void playerRef.current?.close();
    micRef.current = null;
    playerRef.current = null;

    setIsConnected(false);
    setIsMuted(false);
    setMicLevel(0);
    setWaziState('resting');
    setError(null);
  }, [send, stopLevelPump]);

  // ────────────────────────────────────────────────────── controls

  /** Send a typed turn — for noisy places, or for anyone who prefers to write. */
  const sendText = useCallback(
    (text: string) => {
      if (!text.trim()) return false;
      if (wsRef.current?.readyState !== WebSocket.OPEN) return false;
      send({ type: 'text', text });
      setWaziState('thinking');
      resetIdleTimer();
      return true;
    },
    [resetIdleTimer, send]
  );

  /** Nudge WAZI at a UX moment (e.g. the evidence board finished loading). */
  const sendMoment = useCallback(
    (moment: MomentName) => {
      send({ type: 'moment', moment });
      resetIdleTimer();
    },
    [resetIdleTimer, send]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((current) => {
      const next = !current;
      micRef.current?.setMuted(next);
      if (next) send({ type: 'mic_end' });
      return next;
    });
  }, [send]);

  useEffect(() => {
    return () => {
      intentionalCloseRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (levelRafRef.current !== null) cancelAnimationFrame(levelRafRef.current);
      wsRef.current?.close();
      void micRef.current?.stop();
      void playerRef.current?.close();
    };
  }, []);

  return {
    waziState,
    micLevel,
    speakerLevel,
    isConnected,
    isMuted,
    modelLabel,
    error,
    connect,
    disconnect,
    sendText,
    sendMoment,
    toggleMute
  };
}
