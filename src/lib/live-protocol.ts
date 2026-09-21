/* WAZI Civic — the wire contract between the browser and the voice proxy.
 *
 * This file is the client half of the contract implemented in
 * server/live-bridge.js. Keep the two in step.
 *
 * Binary frames carry audio and nothing else:
 *   browser → server   PCM16LE mono @ INPUT_SAMPLE_RATE  (microphone)
 *   server → browser   PCM16LE mono @ OUTPUT_SAMPLE_RATE (WAZI's voice)
 *
 * Text frames carry JSON control messages, typed below.
 */

export const INPUT_SAMPLE_RATE = 16000;
export const OUTPUT_SAMPLE_RATE = 24000;

// ─────────────────────────────────────────────── browser → server

export type ClientMessage =
  /** Opens the Gemini session. `languageHint` is a hint, never a constraint. */
  | {
      type: 'start';
      voice: string;
      languageHint?: string;
      resumed?: boolean;
      /** The user's local hour (0-23), so the greeting can fit the time of day. */
      localHour?: number;
      /**
       * Stable per-tab id. If the connection drops, the server parks the Gemini
       * session under this id for a short grace period so a reconnecting browser
       * resumes the same conversation instead of starting over.
       */
      sessionId?: string;
    }
  /** A typed turn, for when someone cannot or does not want to speak. */
  | { type: 'text'; text: string }
  /** A UX moment prompt, resolved to a full prompt server-side. */
  | { type: 'moment'; moment: MomentName }
  /** The browser's answer to a tool call. */
  | { type: 'tool_result'; id: string; name: string; response: unknown }
  /** Microphone closed — flush voice activity detection. */
  | { type: 'mic_end' }
  /** The user ended the session deliberately; do not park it for resumption. */
  | { type: 'bye' };

export type MomentName = 'wake' | 'rewake' | 'idle_farewell' | 'evidence_ready';

// ─────────────────────────────────────────────── server → browser

export interface ToolCall {
  id: string;
  name: ToolName;
  args: Record<string, unknown>;
}

export type ToolName =
  | 'note_detected_language'
  | 'open_evidence_board'
  | 'request_photo_evidence'
  | 'open_draft_studio'
  | 'raise_safety_alert';

export interface ModelCapabilities {
  tools: boolean;
  affectiveDialog: boolean;
  contextWindowCompression: boolean;
  sessionResumption: boolean;
  transcription: boolean;
}

export type ServerMessage =
  | {
      type: 'ready';
      model: string;
      modelLabel: string;
      voice: string;
      personaName: string;
      outputSampleRate: number;
      capabilities: ModelCapabilities;
      /** True when this picked up a conversation that survived a dropped connection. */
      resumed?: boolean;
    }
  /** WAZI has started speaking. */
  | { type: 'turn_start' }
  /** WAZI finished the turn cleanly. */
  | { type: 'turn_complete' }
  /** The user barged in. Drop every queued audio frame immediately. */
  | { type: 'interrupted' }
  /** Incremental speech-to-text, in either direction. */
  | { type: 'transcript'; role: 'user' | 'wazi'; text: string; final: boolean }
  /** The model wants the interface to do something. */
  | { type: 'tool_call'; calls: ToolCall[] }
  /** Gemini is about to drop the session. */
  | { type: 'go_away'; timeLeft: string | null }
  /** `fatal` means reconnecting will not help. */
  | { type: 'error'; code: string; message: string; fatal: boolean };

/** Narrowing helper — server frames are JSON.parse'd, so they arrive as `any`. */
export function isServerMessage(value: unknown): value is ServerMessage {
  return typeof value === 'object' && value !== null && typeof (value as { type?: unknown }).type === 'string';
}
