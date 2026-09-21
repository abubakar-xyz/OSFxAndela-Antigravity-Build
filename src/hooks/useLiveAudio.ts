import { useEffect, useRef, useState, useCallback } from 'react';
import { resampleAudio, float32ToInt16, int16ToFloat32, getRmsLevel, isEchoCancellable } from '../utils/audio';
import type { WaziState } from '../lib/types';

// ═══════════════════════════════════════════════════════════
// WAZI Live Audio Hook — Hardened Duplex Pipeline
// Jitter buffering, echo gating, barge-in, auto-reconnect
// ═══════════════════════════════════════════════════════════

const JITTER_BUFFER_MS = 50; // Lookahead buffer for smooth playback
const ECHO_GATE_COOLDOWN_MS = 200; // Mic mute period after speaker stops
const MAX_RECONNECT_ATTEMPTS = 3;
const IDLE_FAREWELL_TIMEOUT_MS = 60_000; // 60 seconds

export function useLiveAudio(
  onStateChange?: (state: WaziState) => void,
  voiceName: string = "Kore",
  language: string = "en-NG"
) {
  const [waziState, setWaziState] = useState<WaziState>('resting');
  const [micLevel, setMicLevel] = useState(0);
  const [speakerLevel, setSpeakerLevel] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateState = useCallback((newState: WaziState) => {
    setWaziState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Playback context for 24kHz Gemini output
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextPlaybackTimeRef = useRef<number>(0);

  // Echo gating refs
  const isSpeakingRef = useRef(false);
  const speakerStoppedAtRef = useRef(0);
  const currentSpeakerRmsRef = useRef(0);

  // Auto-reconnect refs
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentionalDisconnectRef = useRef(false);

  // Idle farewell timer
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef(Date.now());

  // Reset idle timer on any activity
  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      // Send idle farewell signal to server
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'idle_farewell' }));
      }
    }, IDLE_FAREWELL_TIMEOUT_MS);
  }, []);

  const connect = useCallback(async () => {
    try {
      setError(null);
      intentionalDisconnectRef.current = false;

      // 1. Initialize WebSocket to local proxy server
      const ws = new WebSocket(import.meta.env.VITE_WS_PROXY_URL || 'ws://localhost:8080');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        updateState('listening');
        ws.send(JSON.stringify({ type: 'config', voiceName, language }));
        reconnectAttemptsRef.current = 0; // Reset on successful connect
        resetIdleTimer();
      };

      ws.onerror = () => {
        setError('Audio server unreachable. Falling back to text mode.');
        setIsConnected(false);
        setWaziState('error');
      };

      ws.onclose = () => {
        setIsConnected(false);

        // Auto-reconnect with exponential backoff (unless intentional)
        if (!intentionalDisconnectRef.current && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000; // 1s, 2s, 4s
          reconnectAttemptsRef.current++;
          setWaziState('thinking'); // Visual: "reconnecting"
          setError(`Reconnecting... (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);

          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (!intentionalDisconnectRef.current) {
          setWaziState('error');
          setError('Connection lost. Tap Talk to reconnect.');
        } else {
          setWaziState('resting');
        }
      };

      // 2. Initialize Microphone AudioContext
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      micStreamRef.current = stream;

      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      await audioCtx.audioWorklet.addModule('/audio-processor.js');

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = new AudioWorkletNode(audioCtx, 'mic-processor');

      // Process chunks from microphone with echo gating
      processor.port.onmessage = (event) => {
        const float32Audio = event.data as Float32Array;
        const micRms = getRmsLevel(float32Audio);
        setMicLevel(micRms);

        // ─── Echo Gate: suppress mic when WAZI is speaking ───
        const now = Date.now();
        const speakerCooldownActive = (now - speakerStoppedAtRef.current) < ECHO_GATE_COOLDOWN_MS;
        const shouldSuppressMic = isSpeakingRef.current ||
          speakerCooldownActive ||
          isEchoCancellable(micRms, currentSpeakerRmsRef.current);

        if (shouldSuppressMic) {
          return; // Don't send mic audio while WAZI is speaking + cooldown
        }

        // Only send audio if connected and ready
        if (ws.readyState === WebSocket.OPEN) {
          const downsampled = resampleAudio(float32Audio, audioCtx.sampleRate, 16000);
          const pcm16 = float32ToInt16(downsampled);
          ws.send(pcm16.buffer as ArrayBuffer);
          resetIdleTimer(); // User is actively speaking
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      // 3. Initialize Playback Context (Gemini responds with 24kHz PCM)
      const playbackCtx = new AudioContext({ sampleRate: 24000 });
      playbackContextRef.current = playbackCtx;
      nextPlaybackTimeRef.current = playbackCtx.currentTime;

      // Handle receiving messages from the server (audio + control signals)
      ws.binaryType = 'arraybuffer';
      ws.onmessage = async (event) => {
        if (event.data instanceof ArrayBuffer) {
          // ─── Binary: Audio chunk from Gemini ───
          isSpeakingRef.current = true;
          setWaziState('speaking');

          const int16Data = new Int16Array(event.data);
          const float32Data = int16ToFloat32(int16Data);
          const rms = getRmsLevel(float32Data);
          setSpeakerLevel(rms);
          currentSpeakerRmsRef.current = rms;

          const audioBuffer = playbackCtx.createBuffer(1, float32Data.length, 24000);
          audioBuffer.getChannelData(0).set(float32Data);

          const sourceNode = playbackCtx.createBufferSource();
          sourceNode.buffer = audioBuffer;
          sourceNode.connect(playbackCtx.destination);

          // Jitter buffer: schedule slightly ahead for smooth playback
          const jitterOffset = JITTER_BUFFER_MS / 1000;
          const startTime = Math.max(
            playbackCtx.currentTime + jitterOffset,
            nextPlaybackTimeRef.current
          );
          sourceNode.start(startTime);
          nextPlaybackTimeRef.current = startTime + audioBuffer.duration;

          sourceNode.onended = () => {
            // Revert state if playback queue is drained
            if (playbackCtx.currentTime >= nextPlaybackTimeRef.current - 0.05) {
              isSpeakingRef.current = false;
              speakerStoppedAtRef.current = Date.now();
              currentSpeakerRmsRef.current = 0;
              setWaziState('listening');
              setSpeakerLevel(0);
              resetIdleTimer();
            }
          };
        } else if (typeof event.data === 'string') {
          // ─── Text: JSON control message from server ───
          try {
            const msg = JSON.parse(event.data);

            if (msg.type === 'turnComplete') {
              // Model finished its full turn
              isSpeakingRef.current = false;
              speakerStoppedAtRef.current = Date.now();
              currentSpeakerRmsRef.current = 0;
              // Don't immediately set to 'listening' — let the last audio chunk's onended handle it
            } else if (msg.type === 'interrupted') {
              // User barged in — model stopped mid-sentence
              isSpeakingRef.current = false;
              speakerStoppedAtRef.current = Date.now();
              currentSpeakerRmsRef.current = 0;
              setWaziState('listening');
              setSpeakerLevel(0);
            } else if (msg.type === 'error') {
              setError(msg.message || 'An error occurred with the voice connection.');
              setWaziState('error');
            }
          } catch {
            // Non-JSON text message, ignore
          }
        }
      };

    } catch (err) {
      console.error('Error connecting to live audio:', err);
      setWaziState('error');
      setError('Could not access microphone. Check browser permissions.');
    }
  }, [resetIdleTimer]);

  const disconnect = useCallback(() => {
    intentionalDisconnectRef.current = true;

    // Clear reconnect timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    // Clear idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (playbackContextRef.current) {
      playbackContextRef.current.close();
      playbackContextRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }

    // Reset echo gate state
    isSpeakingRef.current = false;
    speakerStoppedAtRef.current = 0;
    currentSpeakerRmsRef.current = 0;
    reconnectAttemptsRef.current = 0;

    setIsConnected(false);
    setWaziState('resting');
    setError(null);
  }, []);

  const sendTextPrompt = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
      setWaziState('thinking');
      resetIdleTimer();
    }
  }, [resetIdleTimer]);

  useEffect(() => {
    return () => {
      intentionalDisconnectRef.current = true;
      disconnect();
    };
  }, [disconnect]);

  return {
    waziState,
    micLevel,
    speakerLevel,
    isConnected,
    error,
    connect,
    disconnect,
    sendTextPrompt
  };
}

