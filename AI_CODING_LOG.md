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


## 4. Learning From Our Own Prior Work (Claude Code)

A second repository of ours — `abubakar-xyz/my-sabi`, a single-purpose Gemini
Live companion — was studied as a reference implementation and deliberately not
modified. It had independently converged on the same Live model, which was
useful confirmation, and its client audio was ahead of ours in specific,
measurable ways.

**Taken from it:**
- Dual time-domain/frequency-domain viseme extraction. Mouth openings per
  session rose from 78 to 129 and peak opening from 0.74 to 0.95 on the same
  harness.
- Jitter cushion only at the start of a turn (35ms), not on every chunk (80ms).
- The shape of a barge-in-permitting echo gate, which reversed part of an
  earlier decision of ours. Recorded openly as DEC-014.
- Running Vite as middleware so the whole app is one command on one port.
- A time-of-day greeting driven by the browser's local hour.

**Deliberately not taken:** its session storage parks the live session in a
module-level global, which works for one user and hands one person's
conversation to the next visitor the moment two people connect. Ours is keyed
per browser tab, bounded, and evicts oldest-first.

## 5. What The Third Harness Found

`scripts/verify-journey.mjs` drives the whole judged journey in a real browser
at 360px — a cheap phone screen — and needs no API key. It found:

- Four CSS custom properties referenced by components but never defined, so the
  browser discarded those declarations. The language modal and the email
  dispatch sheet — both on the demo path — rendered with no background.
- An A4 document preview carrying a fixed aspect ratio while its content height
  was content-driven, so the attachments list spilled out of the paper and
  swallowed clicks on the dispatch button.
- A format-pill row without `min-width: 0`, which pushed the whole page sideways
  on a narrow screen instead of scrolling within itself.

None of these are visible in a desktop browser at a comfortable width, and none
would have been caught by a typecheck or a lint pass.
