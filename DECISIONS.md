# WAZI Civic — Architectural Decisions Log (DECISIONS.md)

## DEC-001: 2D Stylized SVG Luminous Character over Photoreal Avatar
- **Decision**: Implemented WAZI as a non-human, organic luminous character (warm river-stone / flame shape) rendered entirely in lightweight 2D SVG with CSS keyframe state animations.
- **Rationale**:
  - Eliminates uncanny-valley dissonance and false human authority.
  - Neutral across gender, culture, and ethnic backgrounds.
  - Zero heavy 3D assets or GPU dependencies — runs at 60fps even on entry-level Android devices.

## DEC-002: Synthetic Crystal Audio via Web Audio API
- **Decision**: Replaced external MP3 audio assets with real-time synthetic harmonic chimes generated via the browser's Web Audio API.
- **Rationale**:
  - Eliminates network fetch failures for audio assets on mobile networks.
  - Works 100% offline with zero latency.
  - Instant response and zero battery drain.

## DEC-003: Dual-Mode AI Reasoning (Gemini Flash Grounding + Deterministic Offline Pack)
- **Decision**: Built a hybrid engine: when a Gemini API key is present, it uses Gemini 3.8 Flash for dynamic multimodal extraction; otherwise, it executes against a hand-verified, gazetted Country Pack.
- **Rationale**:
  - Ensures 100% reliability during live hackathon judging or low-connectivity mobile scenarios.
  - Protects against quota limits, network drops, and hallucinations.

## DEC-004: Client-Side HTML5 Canvas EXIF Sanitization
- **Decision**: Implemented automatic image re-encoding via offscreen HTML5 Canvas before evidence analysis.
- **Rationale**:
  - Strips GPS metadata, device serials, and timestamps directly on the user's phone.
  - Fulfills the Secondary Track (Safety, Reporting & Protection) requirement for reporting safety.

## DEC-005: Deterministic Evidence States over Percentage Confidence Scores
- **Decision**: Rejected percentage-based confidence scores (e.g., "87% confident") in favor of deterministic categorical states: `VERIFIED`, `CORROBORATED`, `REPORTED`, `CONFLICTING`, `UNKNOWN`.
- **Rationale**:
  - Percentage confidence scores mislead non-technical users and mask data limitations.
  - Categorical states reflect the actual legal and evidentiary standard.

## DEC-006: Gemini Live over WebSockets, with the Web Speech API removed entirely
- **Decision**: WAZI's voice is a duplex Gemini Live session — 16kHz PCM from the microphone to a node proxy to Gemini, 24kHz PCM back — with `window.speechSynthesis` and `webkitSpeechRecognition` deleted rather than kept as a fallback.
- **Rationale**:
  - A browser's default TTS voice cannot match a speaker's language, dialect or accent, which is the entire premise of the product. A "fallback" that silently substitutes a robot for a collaborator is not a degraded WAZI; it is a different product.
  - Keeping it available is *why* the real pipeline stayed broken: the app appeared to work, so nothing forced the Live session to be fixed.
- **Consequence**: no proxy, no voice. That is the honest failure mode, and the UI says so plainly instead of pretending.

## DEC-007: The brief's documented endpoint and model do not exist; the chain is empirical
- **Decision**: Connect to `BidiGenerateContent` over the SDK's `ai.live.connect`, against a capability-gated chain of models verified against the live API.
- **Rationale**:
  - `gemini-2.0-flash-exp` is not available on this key, and `:streamGenerateContent` is an HTTP/SSE endpoint, not a WebSocket one. Building toward either produces a socket that never carries audio.
  - The previous `server.js` called `session.send({realtimeInput})` and `session.receive()` — neither exists in `@google/genai` v2. Every audio send threw. This was the root cause of the dead pipeline, not a tuning problem.
  - The Live API rejects an entire `setup` frame if it contains one unsupported field, so capabilities are gated per model rather than sent hopefully. Measured: `gemini-3.1-flash-live-preview` ~1.9s to first audio (no affective dialog); `gemini-2.5-flash-native-audio-latest` ~7.5s (affective dialog supported); `gemini-3.8-live` times out with tools or audio.
- **Consequence**: 3.1-flash leads the chain. For a companion, responsiveness beats an expressiveness flag — seven seconds of silence does not feel alive however good the eventual delivery.

## DEC-008: Language adaptation is a model behaviour and a UI *readout*, never a setting
- **Decision**: An unconditional language-mirroring directive is injected into every session's system instruction, and the model reports what it heard through a `note_detected_language` tool call that drives the language pill. The selector now sets a weak starting hint, explicitly overridable by the model.
- **Rationale**:
  - Asking a user to declare their language before speaking is the exact friction WAZI exists to remove, and it is unanswerable for code-mixed speech.
  - The old prompt made Pidgin conditional ("if requested to speak in Nigerian/Pidgin style") and the selected language never reached the model at all.
- **Verified**: a Nigerian Pidgin utterance produces a Pidgin reply and `note_detected_language(pcm-NG, "Nigerian Pidgin")`, with no UI interaction.

## DEC-009: Visemes are measured at playback time, not at arrival time
- **Decision**: An `AnalyserNode` on the playback graph is sampled on animation frames to drive the avatar's mouth.
- **Rationale**:
  - The previous build took the RMS of each chunk as it *arrived* off the socket. An arriving chunk is scheduled behind everything already queued, so the mouth moved for audio that would not be heard for another second, then went still while WAZI was still talking. That desync is most of what made the character read as a puppet.
  - Measuring the output makes the level correct by construction, whatever the queue depth.
- **Also**: a turn is only over once the queue has drained *and* stayed drained. Treating each gap between chunks as the end of a turn stopped the meter mid-sentence — caught by the browser harness as six seconds of speech producing sixteen animation-frame reads instead of several hundred.
- **Refined in DEC-012** to weight vocal formant energy alongside raw amplitude.

## DEC-010: The voice drives the interface through tool calls
- **Decision**: Gemini function calls (`open_evidence_board`, `request_photo_evidence`, `open_draft_studio`, `raise_safety_alert`, `note_detected_language`) navigate the app.
- **Rationale**:
  - The transition from conversation to structured evidence used to be `if (text.includes('health centre'))` — which only worked in English, and only for phrasings someone had anticipated. The model already understood the sentence in whatever language it arrived; the decision belongs to it.
  - Safety triage becomes language-independent for the same reason: no English keyword list stands between a person in danger and the emergency numbers.
- **Note**: the numbers themselves are hardcoded in `SafetyBanner`, never model output. An emergency line is the one thing in this app that must not be hallucinated.

## DEC-011: The API key lives only on the server
- **Decision**: `GEMINI_API_KEY` replaces `VITE_GEMINI_API_KEY`; photo clue extraction goes through `POST /api/vision/clues` on the proxy; the browser holds no credential.
- **Rationale**:
  - Vite inlines every `VITE_`-prefixed variable into the shipped bundle, so the old key was readable by anyone who opened the network tab. For an app whose users report on powerful institutions, a leaked key is not only a billing problem — it is an account someone else can speak through.
  - `.env` was also committed to git. It is now untracked and ignored; **the key in commit `5a9c281` should be treated as compromised and rotated.**


---

# Round two — lessons from the My-Sabi reference implementation

A working single-purpose Gemini Live companion (`abubakar-xyz/my-sabi`) was
studied after the rebuild above. It had independently converged on the same Live
model, which was useful confirmation, and its client audio was ahead of ours in
several specific ways. The decisions below are what came of that, including one
reversal.

## DEC-012: Visemes weight vocal formant energy, not amplitude alone
- **Decision**: the mouth level is `max(rms × 3.4, formantEnergy × 1.9)` over the 150 Hz–3.8 kHz band, with a fast attack, a slower release, and a noise gate that snaps the mouth fully shut below 0.02.
- **Rationale**:
  - Amplitude is a crude proxy for an open mouth. A fricative like "sss" carries real energy but barely moves a jaw; a vowel at the same amplitude opens it wide. Formant-band energy tracks vowel articulation, which is what a mouth is actually doing.
  - Without the gate the mouth hangs fractionally open between syllables, which reads as animation rather than speech.
- **Measured**: on the same browser harness, distinct mouth openings per session rose from 78 to 129 and peak opening from 0.74 to 0.95.
- **Credit**: the dual time-domain/frequency-domain approach is taken from My-Sabi's `updateAudioSync`. The band here is derived from `frequencyBinCount` rather than hardcoded to fixed bin indices, so it stays correct if the playback rate changes.

## DEC-013: Jitter cushion only when a turn starts, not on every chunk
- **Decision**: 35 ms of lead when beginning a turn or recovering from an underrun, ~5 ms between chunks inside a turn, replacing a flat 80 ms on every chunk.
- **Rationale**: a cushion paid per chunk is latency the listener experiences as WAZI being slow to answer. The cushion is only needed where a gap is actually likely — at the start, and after the queue has run dry.

## DEC-014: Reversal — a narrow echo gate is restored, and it permits barge-in
- **Decision**: while WAZI is speaking, quiet microphone frames are held back; two consecutive frames above RMS 0.08 open the gate immediately. It fails open.
- **This reverses part of DEC-006**, which removed echo gating entirely. That was right about the gate it removed — the old one hard-muted the microphone for the whole time WAZI spoke, which made interruption impossible and left the downstream barge-in handling as dead code — but wrong to conclude that no gate belongs there.
- **What changed the decision**: on the cheap Android hardware this app is actually for, browser echo cancellation often does not fully suppress speaker bleed. Gemini's voice-activity detector hears WAZI's own voice, and WAZI interrupts herself mid-sentence. It reads as an assistant that cannot finish a thought. Suppressing a narrow, quiet band while leaving genuine interruption intact is a different trade from muting outright, and the right one for the hardware. My-Sabi's `shouldForward` logic is the shape of it.

## DEC-015: Sessions survive a dropped connection for 20 seconds
- **Decision**: when a browser socket closes without a `bye`, its Gemini session is parked under a per-tab id for 20 s. A browser that reconnects inside that window reclaims the same session with its context intact.
- **Rationale**:
  - The users this is built for are on mobile data in lifts, tunnels, buses and places where the mast loses power. Without this, every one of those moments ends the conversation and the user has to re-explain their case from the beginning — precisely the friction the product exists to remove.
  - "Unreliable internet, limited mobile data" is an explicit constraint of the brief, not an edge case.
- **Keyed, not global**: My-Sabi parks its session in a module-level variable. That works for one user and silently hands one person's conversation to the next visitor the moment two people use the deployment at once. Ours is keyed per browser tab, bounded at 50 parked sessions, and evicts oldest-first.

## DEC-016: One process, one port, one command
- **Decision**: Vite runs as middleware inside `server.js`. `npm run dev` serves the UI, the `/api` routes and the `/live` socket together.
- **Rationale**:
  - A separate dev server plus a proxy means two terminals, a CORS story, a second port, and a demo that dies if one of them is not running. For a judged live demo that is an unnecessary way to lose.
  - One origin also means the browser derives the WebSocket URL from the page it was served from, so opening the app on a phone on the same network works with no configuration.

## DEC-017: A missing microphone degrades the session instead of ending it
- **Decision**: if `getUserMedia` fails or is refused, the session still opens. WAZI can speak, the user can type, and the UI says why.
- **Rationale**: shared devices, hardware without a working microphone, and people who are simply not ready to be recorded are all real. Refusing to connect at all turns a partial capability into no capability, which is the opposite of accessible.
