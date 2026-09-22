<div align="center">

# WAZI

### Talk to it in the language you actually speak.<br>It checks what the public record says. It writes the letter.

**A voice-first civic companion for people who were never meant to read the paperwork.**

*Wazi* — Swahili: open, clear, out in the daylight.

Built for the **OSF × Andela 2026 hackathon**, *Information you can trust*.
Cross-track: **Transparency & Accountability** · **Safety, Reporting & Protection**

</div>

---

## The problem, in one scene

A woman walks past the health centre her ward has waited three years for. The signboard
says **COMPLETED AND COMMISSIONED**. The building has no roof.

Everything she needs to act on that is already public. The contract is on the procurement
portal. The payment is on the treasury portal. The law giving her the right to ask is the
Freedom of Information Act 2011, and it gives the agency seven working days to answer.

None of it is reachable from where she is standing. It is in English, in PDFs, behind
acronyms, addressed to an "Accounting Officer" nobody has named for her.

So the roof stays off.

> **Civic information is not inaccessible because it is secret. It is inaccessible because
> it is in the wrong language, the wrong format, and addressed to nobody in particular.**

WAZI is the distance between those two facts.

---

## Quickstart

```bash
git clone https://github.com/abubakar-xyz/OSFxAndela-Antigravity-Build
cd OSFxAndela-Antigravity-Build
npm install

cp .env.example .env     # then set GEMINI_API_KEY=... (see below)
npm run dev
```

**→ http://localhost:3000**

Press **TALK** and speak. That is the whole setup: one command, one port, one process —
the interface, the API routes and the live voice socket are served together.

<table>
<tr><td width="50%">

**You will see this on startup**

```
WAZI is live on http://localhost:3000
  voice         ws://localhost:3000/live
  model chain   gemini-3.8-live → …
  audio         16000Hz PCM in / 24000Hz out
  jurisdiction  Nigeria
```

</td><td width="50%">

**Requirements**

- Node 20 or newer (built on 22)
- A Gemini API key for the voice
- A browser with microphone access

Nothing else. No database, no Docker, no build step before `dev`.

</td></tr>
</table>

### Getting a key

Create one at **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)**, then put
it in `.env`:

```bash
GEMINI_API_KEY=your-key-here
```

> **Use `GEMINI_API_KEY`, not `VITE_GEMINI_API_KEY`.** Vite inlines every `VITE_`-prefixed
> variable into the shipped browser bundle. For an app whose users report on powerful
> institutions, a leaked key is not a billing problem — it is an account someone else can
> speak through. This key stays in the Node process and never reaches a browser. The server
> still accepts the old name, but warns loudly when it has to.

### Running without a key

**Everything except the voice still works** — the evidence board, the record-versus-reality
comparison, the adversarial re-check, the draft studio, the dispatch routes and the offline
case store all run on the deterministic country pack. The server says so on startup, and
the voice session reports that it cannot connect rather than quietly substituting something
worse.

### Try these first

Press TALK, then say — or type — any of these:

| Say this | What to watch |
|---|---|
| *"Abeg, wetin be dis FOI ting I dey hear people talk about?"* | She answers **in Pidgin**, and the language pill in the header switches itself. |
| *"How long dem get to reply person wey write dem?"* | She cites the seven-working-day clock — from verified data, not invention. |
| *"The health centre for my area — dem say e don complete, but e no get roof."* | **The evidence board opens on its own.** Nobody pressed a button. |
| *Switch language mid-sentence* | She switches with you, and never mentions it. |

<details>
<summary><b>On a phone</b> — it already works</summary>

<br>

Everything is served from one origin, so the browser derives the voice socket from the page
it was loaded from. Find your machine's LAN address and open it on a phone on the same
Wi-Fi:

```bash
npm run dev
# on the phone:  http://<your-laptop-ip>:3000
```

This is the device WAZI is designed for — a small, cheap Android screen on mobile data.
Every view is verified at 360 px wide.

</details>

<details>
<summary><b>Production build</b></summary>

<br>

```bash
npm run build
npm start          # serves the built UI and the voice socket together
```

| Variable | Default | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | — | **Required for voice.** Server-side only. |
| `PORT` | `3000` | Port for everything |
| `GEMINI_LIVE_MODEL` | *(chain)* | Pin a Live model to the front of the fallback chain |
| `GEMINI_VISION_MODEL` | *(chain)* | Pin the vision model used for photo analysis |
| `WAZI_JURISDICTION` | `Nigeria` | Which country pack loads |
| `WAZI_LOG` | *(verbose)* | Set to `quiet` to silence per-session logging |

</details>

---

## What it actually does

### Most of the time, it just explains things

The everyday use is not a scandal. It is someone who wants to understand something and has
nobody to ask.

> **"Abeg, wetin be dis FOI ting I dey hear people talk about?"**
>
> *"Ah, FOI! Omo, na like your power to ask government question about wetin dem dey do with
> your money, and dem must answer you. You get anything specific you want know about am?"*

That exchange is real, captured from a live session. Most civic tools skip this entirely and
open at a dashboard, assuming the reader already knows what they are looking for.

### When there is something specific, it investigates

```
  she speaks  ─────►  WAZI answers in the same language, accent and register
                      no menu, no language setting, no flag to tap
       │
       ▼
  she shows it a photo  ─────►  EXIF read and stripped on her phone, and she is
       │                        told which tags were removed
       │                        clues extracted by Gemini vision
       ▼
  the evidence board  ─────►  five named retrieval steps, each with its source
       │                      official record beside observed reality, claim by claim
       │                      every claim carries a state and two dates
       ▼
  "check again"  ─────►  an adversarial pass that hunts the innocent explanation
       │
       ▼
  the draft studio  ─────►  an FOI request citing Section 4, addressed to the named
                            officer, with the 7-working-day clock and the ICPC
                            escalation route pre-loaded
       │
       ▼
  she decides what to send.  Nothing leaves the device without her.
```

**The board and the studio are opened by the conversation itself.** WAZI calls them as
tools when what was said warrants it — so they work in Yoruba or Swahili without
translating a single interface string. There is no "now press the button" step.

---

## What makes it different

### 1. Language is detected, never configured

There is no language setting in this app. Every session opens with an unconditional
instruction to mirror the speaker's language, dialect, register and accent — including a
switch mid-sentence. When WAZI is confident, she calls `note_detected_language`, and the
pill in the header follows *her*.

A language menu assumes you can read the menu. For a market trader who speaks Pidgin and
reads little English, that menu is a locked door with the key on the other side.

*Verified end to end: Pidgin speech in → Pidgin reply out → `pcm-NG` on the pill, nothing
tapped.*

### 2. The conversation operates the interface

Five tools the model can call:

| Tool | What happens on screen |
|---|---|
| `note_detected_language` | The language pill updates to what she heard |
| `open_evidence_board` | The record-versus-reality investigation opens |
| `request_photo_evidence` | The camera opens, with what she asked to see |
| `open_draft_studio` | The letter is drafted in the chosen format |
| `raise_safety_alert` | Verified emergency numbers surface immediately |

The codebase this grew from decided when to open the board by matching English keywords in
the transcript. That worked in one language, for phrasings someone had anticipated. Moving
the decision to the model that already understood the sentence is what makes the rest of
the app reachable in any language — safety triage included.

### 3. The mouth is driven by audio leaving the speakers

An arriving audio chunk is queued behind everything before it, so measuring it on arrival
desyncs the character by the whole queue depth. An `AnalyserNode` on the playback graph
fixes that by construction. The level combines broadband amplitude with energy in the vocal
formant band (150 Hz – 3.8 kHz), because a hard "s" carries energy but barely moves a jaw
while a vowel at the same amplitude opens it wide.

### 4. Conversations survive a dropped connection

When a socket closes without a goodbye, the Gemini session is parked for 20 seconds under a
per-tab key. A browser that returns inside that window reclaims it with full context. People
on mobile data lose signal in lifts and tunnels; without this, every one of those moments
makes them start their case over.

---

## How the voice pipeline works

```
  microphone
      │  AudioWorklet in an AudioContext opened at 16 kHz
      │  20 ms frames · Float32 → PCM16 · transferred, not copied
      ▼
  WebSocket /live      binary frames = raw PCM16LE mono
      │                text frames  = JSON control messages
      ▼
  node (server.js)     holds the API key · one Gemini session per socket
      │  ai.live.connect() → BidiGenerateContent
      ▼
  Gemini Live          system instruction injected at `setup`:
      │                  core identity + language mirroring + persona + tools
      │  24 kHz PCM · transcripts both directions · tool calls
      ▼
  PcmPlayer @ 24 kHz   gapless scheduled queue
      ├─► speakers
      └─► AnalyserNode → rAF → RMS + formant energy → the character's mouth
```

### Model selection

Measured against the live API, not taken from documentation. The Live API rejects an entire
`setup` frame containing one unsupported field, so capabilities are gated per model in
`server/live-models.js` and the chain falls through on failure:

```
gemini-3.8-live  →  gemini-2.5-flash-native-audio-preview-12-2025  →  …-latest
```

`GEMINI_LIVE_MODEL` moves a model to the front rather than replacing the chain, so a bad
pin degrades instead of breaking voice.

### Three personas

Each is a lens over the same identity, not a different assistant — selectable in settings:

| Voice | Persona | Register |
|---|---|---|
| Kore | **WAZI** | Civic Guide — warm, street-smart, practical |
| Aoede | **Nuru** | Legal Analyst — precise, statutes and timelines |
| Puck | **Chidi** | Community Organiser — mobilising, concrete |

---

## How it decides what is true

This is a tool for telling institutions they did not do what they were paid to do. It has
to be careful, and honest about its limits.

**Evidence states, not confidence scores.** `VERIFIED` · `CORROBORATED` · `REPORTED` ·
`CONFLICTING` · `UNKNOWN`. "87% confident" implies a precision nobody has, and invites a
non-technical reader to round it up to "true".

**The record and the reality never merge.** Two columns, five dimensions, tested one at a
time. WAZI never says money was stolen — she shows the gap, dated and sourced, then the
lawful route to make someone account for it. That is a hard constraint in her instructions,
not a question of tone.

**Every claim carries its source and two dates** — published and retrieved. A record
accurate in March may not be in September.

**"Check again" is adversarial on purpose.** A second pass hunting the innocent
explanation: a variation order, a boundary reassignment, a phase-two contract, a debarred
contractor. The failure we feared most was never a tool that misses corruption — it was one
that sends a citizen to confront an institution over a discrepancy with a boring
explanation.

**Privacy is demonstrated, not asserted.** The app reads the raw bytes of an uploaded image
for JPEG EXIF markers and PNG metadata chunks, strips them, and reports *which tags were
purged* — GPS, camera hardware, timestamp. A privacy receipt, not a privacy promise.

**Emergency numbers are hardcoded.** WAZI decides *when* to raise a safety alert, from
meaning, in any language. The numbers come from the verified pack. A hallucinated emergency
line is the one failure this app may not have.

### Where the facts come from

**The model handles language. The country pack handles fact.** Statutes, deadlines, named
officers, escalation routes and emergency numbers are all verified data, never model output.

| Source | Authority | Tier |
|---|---|---|
| Nigeria Open Contracting Portal (NOCOPO) | Bureau of Public Procurement | Primary |
| FGN Open Treasury Portal | Office of the Accountant-General | Primary |
| NPHCDA Health Facility Baseline Register | NPHCDA | Primary |
| Budget Office of the Federation | Fed. Ministry of Budget & Economic Planning | Primary |
| Ogun State PHC Development Board | Ogun State Ministry of Health | Secondary |

**Stated plainly:** record retrieval in this proof of concept is *deterministic*, not
live-scraped. The flagship case is real and hand-verified, and carries its references; the
retrieval sequence replays that verification rather than querying portals at demo time. That
is deliberate — it works offline, on a collapsing connection, and it means the app cannot
hallucinate a procurement record under demo pressure. Live connectors slot in behind the
same evidence-state contract.

**Image analysis, by contrast, is live.** Photographs go to Gemini vision under an
instruction that forbids inventing reference codes, contractors or agencies not visible in
the frame. Shown an ordinary photo with no signboard, it says so rather than fabricating a
project.

---

## Verify it yourself

Three harnesses. **None of them mock the API.**

```bash
npm run dev               # terminal 1

npm run verify:journey    # terminal 2 — no API key required
npm run verify:live       # needs GEMINI_API_KEY
npm run verify:browser    # needs a Chromium build
```

| | What it proves |
|---|---|
| **`verify:journey`** | Drives a **360 px phone screen** through signboard → clues → evidence board → re-check → FOI draft → dispatch, asserting the statutory citation, the named authority, the escalation route, and that no view scrolls sideways. **Runs without a key.** |
| **`verify:live`** | Synthesises a Nigerian-Pidgin utterance, streams it as real 16 kHz PCM over the production protocol, and asserts the transcription, the 24 kHz audio returning, **that the reply is in the dialect that was spoken**, that the language was reported to the interface, that the model drove the UI, and that a dropped connection resumes rather than restarts. |
| **`verify:browser`** | Asserts the 16 kHz capture context, the 24 kHz playback context, that audio is actually scheduled, and that the character's mouth is driven by an analyser on the live playback graph. |

The browser harnesses need Playwright's Chromium:

```bash
npx playwright install chromium
```

Every one of these found real defects rather than confirming a happy path — a setup race
that resolved a session as null, a lip-sync meter that stopped between syllables, a capture
device flooding the API at six times realtime, four CSS variables referenced but never
defined that left two screens with no background, and a document preview whose fixed aspect
ratio swallowed clicks on the send button.

---

## Built for the conditions, not the demo

| Constraint | What it meant here |
|---|---|
| **Multilingual access** | Language detected from speech and mirrored, including code-mixing and mid-conversation switches. Literacy in a dominant national language is not a precondition for using this. |
| **Low bandwidth, basic devices** | Raw PCM, not video. Sessions survive a 20 s dropout with context intact. Low-data mode strips animation and glow. Verified at 360 px with no sideways scroll. |
| **Accessibility** | Every voice interaction has a text equivalent on the *same* session — not a lesser fallback engine. Captions are real transcripts of both sides. A refused microphone degrades the session instead of ending it. |
| **Privacy & security** | EXIF read and stripped on-device with a report of what was removed. A disclosure sheet withholds name, contact and precise location. The API key never reaches the browser. Nothing dispatches without confirmation. |
| **Trust & verification** | Evidence states over confidence scores; sources and both dates on every claim; an adversarial re-check; emergency numbers never model-generated. |
| **Local relevance** | Statutes, response clocks, named officers and escalation routes come from a per-jurisdiction pack, not the model. |
| **Clear next steps** | The journey ends at a letter — named officer, legal basis, deadline, and somewhere to escalate when it lapses. |

---

## Scaling past Nigeria

Everything jurisdiction-specific lives in one directory:

```
src/data/jurisdictions/ng/
  institutions.json     who is responsible, and who the accounting officer is
  procedures.json       statutes, response clocks, mandatory fields
  contacts.json         verified desks and portals
  projects.json         the verified case record
  source_registry.json  where each fact came from, and how often it changes
```

A new country is a new directory plus `WAZI_JURISDICTION`. Nothing in the voice pipeline,
the evidence-state model, the drafting engine or the interface knows what country it is in.
The parts that *should* differ between Lagos and Nairobi are data; the parts that should
not, are code.

And language was never a per-country setting, because it was never a setting at all.

---

## Repository map

```
server.js                    one process: UI + /api + /live
server/
  wazi-identity.js           core identity, language mirroring, personas, moments
  live-models.js             measured model capabilities & fallback chain
  civic-tools.js             the five tools the voice can call on the interface
  live-bridge.js             one browser socket ↔ one Gemini session
  session-vault.js           parks sessions across a dropped connection
src/
  hooks/useLiveAudio.ts      the live session, as one hook
  lib/audio/MicCapture.ts    16 kHz capture → PCM16 frames
  lib/audio/PcmPlayer.ts     24 kHz gapless playback + viseme analyser
  lib/live-protocol.ts       browser half of the /live wire contract
  lib/evidence-engine.ts     verification, adversarial re-check, drafting
  lib/privacy.ts             EXIF inspection, stripping and reporting
  data/jurisdictions/ng/     the Nigeria country pack
  components/                the interface
scripts/
  verify-journey.mjs         the whole journey, in a real browser, no key needed
  verify-live.mjs            the voice pipeline, over the real socket
  verify-browser.mjs         the browser audio stack
```

---

## Licence

Apache 2.0 / MIT. Built for the Open Society Foundations × Andela hackathon, 2026.
