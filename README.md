# WAZI Civic — Information You Can Trust 🏛️✨

> **Talk to WAZI, show what is happening, discover what the public record says, and turn the evidence into the right message for the right institution.**

Built for the **Andela x Open Society Foundations (OSF) 2026 Civic-Tech Hackathon**.

---

## 🎯 Challenge Tracks Addressed

### Primary Track: Transparency & Accountability
- **Grounded Civic Explanations**: Explains public infrastructure allocations, tenders, procurement terms, and citizen rights in accessible, plain language.
- **Record vs. Reality Verification Board**: Compares official claims (e.g. 100% completion & payout) directly against dated, verifiable community observations and signboard evidence.
- **Grounded Provenance**: Strict claim-level evidence states (`VERIFIED`, `CORROBORATED`, `REPORTED`, `CONFLICTING`, `UNKNOWN`) with publication and retrieval dates.
- **Adversarial Re-verification ("Check Again")**: Rigorous secondary audit checking for subsequent phase tenders, boundary relocations, or contractor debarment.
- **Institutional Redress**: Matches issues to the responsible public body and verified public desk.

### Secondary Track: Safety, Reporting & Protection
- **Client-Side EXIF Stripping**: Purges camera serials, device fingerprints, and GPS coordinates before any image processing.
- **Active Disclosure Review**: Granular user toggles for anonymity, contact disclosure, approximate location, and redaction before saving or exporting.
- **Protection First**: Non-emergency guidance with escalation routes to institutional oversight bodies (e.g. ICPC project tracking group).

---

## 🌟 The Core User Journey

```
  [ Home Companion ]
   WAZI speaks & listens
        │
        ▼
  [ Show WAZI ]
   Camera / Signboard Intake ──► EXIF Stripped & Clues Extracted
        │
        ▼
  [ Evidence Workspace ]
   Query NOCOPO & Open Treasury ──► Record vs Reality Board (CONFLICTING)
        │
        ▼
  [ Check Again ]
   Adversarial Challenge Pass ──► Confirms Finding Holds
        │
        ▼
  [ Draft Studio ]
   FOI Request / Incident Complaint / WhatsApp Brief ──► Disclosure Review
        │
        ▼
  [ Action & Persistence ]
   PDF Export / Verified Email Handoff ──► Saved in Offline Case Workspace
```

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Vanilla CSS Design Tokens, warm paper / midnight ink palette, WCAG AA contrast
- **Voice**: **Gemini Live API** over WebSockets — a genuine duplex audio session (see below)
- **AI & Multimodal**:
  - Gemini for signboard/photo clue extraction, proxied server-side
  - **Deterministic Civic Engine** for 100% offline, zero-latency reliability
- **Audio**:
  - Web Audio API crystal harmonic chimes (100% offline synthetic audio)
  - PCM capture and streaming playback via `AudioWorklet` — **no Web Speech API**
- **Data Sovereignty**:
  - HTML5 Canvas EXIF & hardware metadata stripping
  - Private client-side persistence (`localStorage` / `IndexedDB`)
  - The Gemini API key lives only in the node proxy, never in the browser bundle

---

## 🎙️ The Voice Pipeline

WAZI's voice is a real-time, two-way Gemini Live session. There is no
text-to-speech fallback: `window.speechSynthesis` cannot match a speaker's
language or accent, which is the whole point of the product.

```
  microphone
      │  AudioWorklet, AudioContext @ 16 kHz
      │  → 20 ms frames, Float32 → PCM16, transferred not copied
      ▼
  WebSocket  /live          binary frames = raw PCM16LE mono @16 kHz
      │                      text frames  = JSON control messages
      ▼
  node proxy (server.js)    holds the API key; one Gemini session per socket
      │  ai.live.connect() → BidiGenerateContent
      ▼
  Gemini Live               system instruction injected at `setup`:
      │                       core identity + language mirroring + persona
      │  24 kHz PCM, transcripts (both directions), tool calls
      ▼
  node proxy  ──────────►  WebSocket  ──────────►  browser
      │
      ▼
  PcmPlayer @ 24 kHz        gapless scheduled queue
      ├─► speakers
      └─► AnalyserNode → requestAnimationFrame → RMS → avatar visemes
```

**Three properties worth knowing about:**

1. **The language selector is a readout, not a setting.** Every session is
   opened with an unconditional directive to mirror the speaker's language,
   dialect, register and accent — including mid-conversation switches. When the
   model is confident, it calls `note_detected_language` and the pill in the
   header follows it. Speak Pidgin and WAZI answers in Pidgin, with no taps.

2. **The mouth is driven by audio leaving the speakers,** not by chunks arriving
   off the socket. An arriving chunk is queued behind everything before it, so
   measuring it on arrival desyncs the avatar by the whole queue depth. An
   `AnalyserNode` on the playback graph makes the level correct by construction.

3. **The voice operates the interface.** Gemini function calls open the evidence
   board, the camera, the draft studio and the safety banner — so the jump from
   conversation to structured evidence works in any language, rather than from
   an English keyword match.

### Model selection

Verified against the live API rather than taken from documentation. The Live API
rejects an entire `setup` frame containing one unsupported field, so
capabilities are gated per model in `server/live-models.js`:

| Model | First audio | Tools | Affective dialog |
|---|---|---|---|
| `gemini-3.1-flash-live-preview` *(default)* | ~1.9s | ✅ | ❌ rejected |
| `gemini-2.5-flash-native-audio-latest` | ~7.5s | ✅ | ✅ |
| `gemini-3.8-live` | — | ❌ times out | ❌ rejected |

Measured on a 5.1s Nigerian-Pidgin utterance. The chain falls through on
failure; `GEMINI_LIVE_MODEL` moves a model to the front rather than replacing
the chain, so a bad pin degrades instead of breaking voice.

---

## 📂 Project Structure

```
├── public/
│   ├── favicon.svg             # WAZI avatar icon
│   └── manifest.json           # PWA standalone manifest
├── src/
│   ├── components/
│   │   ├── wazi/               # WaziCharacter (SVG 2D) & WaziCompanion
│   │   ├── conversation/       # Transcript, TalkButton, TextInput, VoiceRings
│   │   ├── workspace/          # EvidenceWorkspace, RecordVsReality, SearchProgress, CameraModal
│   │   ├── draft/              # DraftStudio, FormatSelector, ToneControl, DisclosureSheet
│   │   ├── cases/              # CaseList, CaseCard
│   │   └── ui/                 # ActionDock, PrivacyShield, LanguagePill, SettingsModal
│   ├── styles/
│   │   ├── design-tokens.css   # Color palette, spacing, typography tokens
│   │   ├── typography.css      # Inter, DM Serif Display, JetBrains Mono
│   │   ├── animations.css      # WAZI breathing, glow pulses, waveforms
│   │   └── components.css      # Responsive cards, buttons, badges
│   ├── lib/
│   │   ├── audio/
│   │   │   ├── MicCapture.ts   # 16kHz capture graph → PCM16 frames
│   │   │   └── PcmPlayer.ts    # 24kHz gapless playback + viseme analyser
│   │   ├── live-protocol.ts    # Browser half of the /live wire contract
│   │   ├── types.ts            # Core TypeScript schemas
│   │   ├── demo-fixtures.ts    # Hand-verified Akute PHC flagship case
│   │   ├── evidence-engine.ts  # Verification & drafting logic
│   │   ├── gemini-client.ts    # Proxied Gemini calls (holds no key)
│   │   ├── audio-speech.ts     # Web Audio synthetic chimes (no speech synthesis)
│   │   ├── privacy.ts          # EXIF stripping & disclosure filters
│   │   └── storage.ts          # Case persistence & settings
│   ├── data/jurisdictions/ng/  # Nigeria Country Pack (NOCOPO, Treasury, NPHCDA)
│   ├── prompts/                # Prompt guidelines & state prompts
│   ├── hooks/useLiveAudio.ts   # The live voice session, as one hook
│   ├── App.tsx                 # Master state machine controller
│   └── index.css               # Design system cascade entry
├── server.js                   # Voice proxy, static host & API key custodian
├── server/
│   ├── wazi-identity.js        # Core identity, language mirroring, personas
│   ├── live-models.js          # Verified model capability table & fallback
│   ├── civic-tools.js          # Function declarations the voice can call
│   └── live-bridge.js          # One browser socket ↔ one Gemini session
└── scripts/
    ├── verify-live.mjs         # Socket-level end-to-end voice verification
    └── verify-browser.mjs      # Headless-browser pipeline verification
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Tested on Node v24 LTS)
- npm / pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd "OSFxAndela Antigravity Build"

# Install dependencies
npm install

# Add your Gemini API key
cp .env.example .env
#   → set GEMINI_API_KEY=...   (NOT VITE_GEMINI_API_KEY — see below)

# Run the UI and the voice proxy together
npm run dev:all
```

The UI is at `http://localhost:5173/` and the voice proxy at `:8080`. Vite
forwards `/live` and `/api` to the proxy, so the browser only ever talks to one
origin — which is also what lets you open the dev server from a phone on the
same network and have voice work.

For a production-style run, `npm run build && npm start` serves the built UI and
the voice socket together from `:8080`.

> **Why `GEMINI_API_KEY` and not `VITE_GEMINI_API_KEY`:** Vite inlines every
> `VITE_`-prefixed variable into the shipped client bundle, publishing it to
> anyone who opens devtools. The key belongs to the node process only. The
> server still accepts the old name so existing `.env` files keep working, but
> it warns when it has to.

### Verifying the voice pipeline

Two harnesses drive the real API, because a voice pipeline that compiles is not
a voice pipeline that works:

```bash
npm run dev:server        # terminal 1

npm run verify:live       # terminal 2 — drives /live with real 16kHz speech
npm run build && npm run verify:browser   # drives the real app in Chromium
```

`verify:live` synthesises a Nigerian-Pidgin utterance, streams it as 16kHz PCM
over the wire protocol, and asserts the transcription, the 24kHz audio coming
back, that the reply mirrors the dialect, and that the model drives the
interface. `verify:browser` launches the app in Chromium and asserts the capture
and playback contexts, the scheduled audio, and that the avatar's mouth actually
moves with the analyser level.

> A headless container has no audio backend, so Chromium will not feed a file
> into the fake microphone — `verify:browser` therefore proves the capture graph
> runs and the playback half works end-to-end, while microphone audio carrying
> real speech is covered by `verify:live`.

---

## 🧪 Verified Flagship Scenario: Akute Model PHC

The demo features a real, hand-verified civic case:
- **Project**: Turnkey Rehabilitation & Equipping of Akute Model Primary Health Care Centre
- **Reference**: Contract Ref: `NPHCDA/2023/LOT-14`
- **Agency**: National Primary Health Care Development Agency (NPHCDA)
- **Disbursement Record**: ₦38,250,000 paid via Voucher `OTP-20240228-44102` (certified 100% completed)
- **Field Evidence**: Dated inspection photograph documenting an unroofed masonry shell with zero medical equipment
- **Finding**: `CONFLICTING`
- **Adversarial Check**: Verifies no subsequent Phase 2 variation exists and plot cadastral coordinates match
- **Civic Deliverable**: Freedom of Information request citing Section 2(3) of FOI Act 2011 with verified delivery to NPHCDA and ICPC escalation routing.

---

## 🛡️ License

Built for Open Society Foundations & Andela Hackathon 2026. Distributed under the Apache 2.0 / MIT License.
