# AI Coding Tools Log (AI_CODING_LOG.md)

## 1. Tooling & Environment
- **Lead Assistant**: Google DeepMind Antigravity IDE (Gemini 3.8 / Claude Opus pairing)
- **Runtime Environment**: Vite 8, React 19, TypeScript 6
- **Autonomous Testing**: Antigravity Browser Subagent with automated recording & visual DOM feedback

## 2. Iterations & Workflow Summary

1. **Renaming & Scope Realignment**:
   - Transformed initial specification from NURU to WAZI.
   - Audited solution fit against Hackathon Challenge Tracks: *Transparency & Accountability* (Primary) and *Safety, Reporting & Protection* (Secondary).

2. **Scaffolding & Architecture**:
   - Initialized React 19 + TypeScript + Vite project shell.
   - Built a bespoke Vanilla CSS design token system (`design-tokens.css`, `typography.css`, `animations.css`, `components.css`) adhering to the specified African dawn color palette.

3. **Core Engineering**:
   - Implemented 2D SVG WAZI character with 6 animated states (`resting`, `listening`, `thinking`, `speaking`, `waiting_permission`, `attention`).
   - Implemented Web Audio API synthetic crystal tones for 100% offline audio chimes.
   - Implemented HTML5 Canvas EXIF stripping and client-side privacy sanitization.
   - Implemented the deterministic Record vs. Reality comparison board with claim-level evidence states.
   - Built the adversarial "Check Again" audit engine.
   - Built Draft Studio supporting FOI requests, service complaints, inquiry letters, and WhatsApp action briefs.

4. **Verification**:
   - `npm run build` executed and verified with zero TypeScript compiler errors (`tsc -b`).
   - Browser Subagent ran full 10-step end-to-end user journey, recording visual proof and verifying every UI interaction.

## 3. Voice Pipeline Rebuild (Claude Code)

### Method: verify against the live API before writing anything
The handoff brief named an endpoint and a model to build against. Both were
probed first, and neither existed on the project key:

- `gemini-2.0-flash-exp` is absent from the key's model list entirely.
- `:streamGenerateContent` is an HTTP/SSE endpoint. The Live API's WebSocket
  endpoint is `BidiGenerateContent`.

A third defect was larger than either: `server.js` called
`session.send({ realtimeInput })` and `session.receive()`, neither of which
exists in `@google/genai` v2. Every audio send threw. That — not tuning, not
latency — is why the pipeline never carried a single frame.

The live models, their latencies, and which `setup` fields each one accepts were
then measured directly and encoded in `server/live-models.js`, because the Live
API rejects an entire session config containing one unsupported field.

### What was removed
- `window.speechSynthesis` / `speakWazi` — a browser's default voice cannot
  match a speaker's accent, and its presence is why the broken pipeline went
  unnoticed for so long.
- The client-side "echo gate", which muted the microphone whenever WAZI spoke.
  It made barge-in impossible and left the `interrupted` handling downstream as
  permanently dead code. Browser AEC plus server-side VAD do this properly.
- A JS box-average resampler that divided by zero and wrote NaN into the audio
  stream, replaced by opening the `AudioContext` at 16kHz directly.
- `VITE_GEMINI_API_KEY` from the client bundle.

### What the verification caught
Both harnesses found real defects rather than confirming a happy path:

- `verify:live` caught a `setupComplete`-before-`connect()` race that resolved
  the session as `null`, and caught WAZI interrogating the user instead of
  opening the evidence board.
- `verify:browser` caught the viseme meter stopping on every gap between audio
  chunks — six seconds of speech produced sixteen animation-frame reads instead
  of several hundred — and surfaced a runaway capture device flooding the Live
  API at six times realtime, which is now guarded against.

### Final state
`verify:live` 11/11 and `verify:browser` 12/12 against the real Gemini Live API,
on repeated fresh runs. `tsc -b` clean, `vite build` clean, `oxlint` clean apart
from two pre-existing `DraftStudio` warnings untouched by this work.
