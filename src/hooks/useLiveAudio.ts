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
// If no greeting audio arrives this soon after connecting, stop showing
// "connecting" and let the user talk. A UI stuck mid-handshake is worse than
// one that quietly moves on.
const WAKE_FALLBACK_MS = 5_000;

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

/**
 * A stable id for this tab, so a session that survives a dropped connection can
 * be reclaimed. Kept in sessionStorage rather than localStorage: it should die
 * with the tab, and two tabs are two conversations.
 */
function tabSessionId(): string {
  const KEY = 'wazi_live_session_id';
  try {
    const existing = sessionStorage.getItem(KEY);
    if (existing) return existing;
    const fresh = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(KEY, fresh);
    return fresh;
  } catch {
    // Private mode, or storage blocked. A per-load id still works for the
    // common case of a drop-and-retry inside one page view.
    return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
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
  const [micAvailable, setMicAvailable] = useState(true);
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
  const tabIdRef = useRef<string>('');
  const levelRafRef = useRef<number | null>(null);
  const wakeFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTextRef = useRef<string | null>(null);
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
          if (msg.resumed) setError(null);
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
        // The microphone needs to know, so it can hold back speaker bleed
        // without blocking a real interruption. See MicCapture.
        micRef.current?.setWaziSpeaking(speaking);

        if (speaking) {
          if (wakeFallbackRef.current) {
            clearTimeout(wakeFallbackRef.current);
            wakeFallbackRef.current = null;
          }
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

    // The playback context must be created inside the user gesture that called
    // connect(). An AudioContext created later starts suspended and WAZI is
    // silently mute.
    try {
      await player.resume();
    } catch (err) {
      console.error('[wazi] could not open the audio output:', err);
      setError('This browser would not let WAZI play audio. Try tapping Talk again.');
      setWaziState('error');
      await playerRef.current?.close();
      playerRef.current = null;
      return;
    }

    // A refused or missing microphone is a degraded session, not a failed one.
    // The user can still hear WAZI and type to her — which matters on shared
    // devices, on hardware without a working mic, and for anyone who simply is
    // not ready to be recorded yet.
    try {
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
      setMicAvailable(true);
    } catch (err) {
      console.warn('[wazi] continuing without a microphone:', err);
      await micRef.current?.stop();
      micRef.current = null;
      setMicAvailable(false);
      setMicLevel(0);
      setError('No microphone, so WAZI cannot hear you — but she can still talk, and you can type.');
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
        resumed: hasConnectedRef.current,
        sessionId: (tabIdRef.current ||= tabSessionId()),
        // So WAZI can greet someone at 6am differently from someone at 11pm.
        // The server holds no clock that is meaningful to the user.
        localHour: new Date().getHours()
      });
      hasConnectedRef.current = true;
      resetIdleTimer();

      if (pendingTextRef.current) {
        const queued = pendingTextRef.current;
        pendingTextRef.current = null;
        send({ type: 'text', text: queued });
        setWaziState('thinking');
      }

      // Don't leave the UI mid-handshake if the greeting never arrives.
      if (wakeFallbackRef.current) clearTimeout(wakeFallbackRef.current);
      wakeFallbackRef.current = setTimeout(() => {
        wakeFallbackRef.current = null;
        setWaziState((current) => (current === 'waiting_permission' ? 'listening' : current));
      }, WAKE_FALLBACK_MS);
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Hot path: WAZI's voice. Straight into the playback queue.
        playerRef.current?.enqueue(new Int16Array(event.data));
        return;
      }
      if (typeof Blob !== 'undefined' && event.data instanceof Blob) {
        event.data.arrayBuffer().then((buf) => {
          playerRef.current?.enqueue(new Int16Array(buf));
        }).catch(() => {});
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
      if (wakeFallbackRef.current) {
        clearTimeout(wakeFallbackRef.current);
        wakeFallbackRef.current = null;
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
    if (wakeFallbackRef.current) {
      clearTimeout(wakeFallbackRef.current);
      wakeFallbackRef.current = null;
    }

    // `bye` tells the server this was deliberate, so it does not hold the
    // Gemini session open waiting for a reconnection that is not coming.
    send({ type: 'bye' });
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
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        send({ type: 'text', text });
        setWaziState('thinking');
        resetIdleTimer();
        return true;
      }
      if (wsRef.current?.readyState === WebSocket.CONNECTING) {
        pendingTextRef.current = text;
        setWaziState('thinking');
        return true;
      }
      return false;
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
      if (wakeFallbackRef.current) clearTimeout(wakeFallbackRef.current);
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
    micAvailable,
    modelLabel,
    error,
    connect,
    disconnect,
    sendText,
    sendMoment,
    toggleMute
  };
}
