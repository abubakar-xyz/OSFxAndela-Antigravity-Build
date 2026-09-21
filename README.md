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
- **AI & Multimodal**:
  - **Gemini 3.8 Flash** with Google Search Grounding for structured evidence verification
  - **Deterministic Civic Engine** for 100% offline, zero-latency reliability
- **Audio & Speech**:
  - Web Audio API crystal harmonic chimes (100% offline synthetic audio)
  - Web Speech API (SpeechRecognition + SpeechSynthesis) with graceful text fallbacks
- **Data Sovereignty**:
  - HTML5 Canvas EXIF & hardware metadata stripping
  - Private client-side persistence (`localStorage` / `IndexedDB`)

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
│   │   ├── types.ts            # Core TypeScript schemas
│   │   ├── demo-fixtures.ts    # Hand-verified Akute PHC flagship case
│   │   ├── evidence-engine.ts  # Verification & drafting logic
│   │   ├── gemini-client.ts    # Gemini multimodal client
│   │   ├── audio-speech.ts     # Web Audio synthetic chimes & speech
│   │   ├── privacy.ts          # EXIF stripping & disclosure filters
│   │   └── storage.ts          # Case persistence & settings
│   ├── data/jurisdictions/ng/  # Nigeria Country Pack (NOCOPO, Treasury, NPHCDA)
│   ├── prompts/                # Prompt guidelines & state prompts
│   ├── App.tsx                 # Master state machine controller
│   └── index.css               # Design system cascade entry
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

# (Optional) Add your Gemini API key in .env
cp .env.example .env

# Run development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

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
