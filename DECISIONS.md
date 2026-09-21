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
