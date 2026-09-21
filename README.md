<div align="center">

# WAZI

### Talk to it in your own language. It checks what the record says. It writes the letter.

**A voice-first civic companion for people who were never meant to read the paperwork.**

*WAZI is Swahili for "open" — as in open, clear, out in the daylight.*

Built for the **OSF × Andela 2026 hackathon**, *Information you can trust*.
Cross-track: **Transparency & Accountability** (primary) · **Safety, Reporting & Protection** (secondary)

</div>

---

## The problem, in one scene

A woman walks past the health centre her ward has been waiting three years for. The signboard
says **COMPLETED AND COMMISSIONED**. The building has no roof.

Everything she would need to do something about that exists in public. The contract is on the
procurement portal. The payment is on the treasury portal. The law giving her the right to ask
is the Freedom of Information Act 2011, and it gives the agency seven working days to answer.

None of it is reachable from where she is standing. It is in English, in PDFs, behind acronyms,
addressed to an "Accounting Officer" nobody has named for her. So the roof stays off.

**WAZI is the distance between those two facts.** She talks to it. In Pidgin, in Swahili, in
Yoruba, in whatever she actually speaks. It listens, checks the record against what she is
looking at, shows her the contradiction, and hands her a legally-grounded letter addressed to
the officer who has to answer it.

---

## What it actually does

### Most of the time, it just explains things

The everyday use is not a scandal. It is someone who wants to understand something and
has nobody to ask.

> **"Abeg, wetin be dis FOI ting I dey hear people talk about?"**
>
> *"Ah, FOI! Omo, na like your power to ask government question about wetin dem dey do
> with your money, and dem must answer you. You get anything specific you want know
> about am?"*

That exchange is real, captured from a live session. WAZI **teaches first** — what a
right is, how a process works, what a word on a form means, who is responsible, how long
they have to reply. She answers in the dialect she was asked in, and she does not open
an investigation just because someone asked a question. Most civic tools skip this
entirely and start at the dashboard.

### When there is something specific, it investigates

```
  she speaks  ──►  WAZI answers in the same language, accent and register
                   (no menu, no language setting, no tapping a flag)
       │
       ▼
  she shows it the signboard  ──►  EXIF stripped on her phone before anything leaves it
       │                           structured clues extracted from the image
       ▼
  the evidence board opens  ──►  official record beside physical reality, claim by claim
       │                          every claim carries a state and a dated source
       ▼
  "check again"  ──►  an adversarial second pass that tries to break its own finding
       │
       ▼
  the draft studio  ──►  an FOI request citing Section 4 of the FOI Act, addressed to the
                          named officer, with the 7-working-day clock and the escalation
                          route to ICPC if it lapses
       │
       ▼
  she decides what to send.  Nothing leaves the device without her saying so.
```

The evidence board and the draft studio are **opened by the conversation itself** — WAZI
calls them as tools when what she said warrants it, in any language. There is no "now
press the button" step, and no English keyword matching standing between a Pidgin
speaker and the rest of the app.

### See it

A recorded walkthrough lives at `.cache/demo/` after running `npm run demo` — or watch
the submitted demo video. Every frame is the real app against a real Gemini Live
session; the captions on screen are genuine transcripts of what WAZI said.

## Getting it running

Three steps, about two minutes. WAZI runs as **one process on one port** — the
interface, the API routes and the live voice socket are served together, so there is no
second terminal to forget and no proxy to configure.

### 1. Install

```bash
git clone https://github.com/abubakar-xyz/OSFxAndela-Antigravity-Build
cd OSFxAndela-Antigravity-Build
npm install
```

*Node 20+. Nothing else to install — no database, no Docker, no build step to run first.*

### 2. Add a Gemini API key

```bash
cp .env.example .env
```

Open `.env` and set one line:

```bash
GEMINI_API_KEY=your-key-here
```

> **Use `GEMINI_API_KEY`, not `VITE_GEMINI_API_KEY`.** Vite inlines every
> `VITE_`-prefixed variable into the shipped browser bundle. For an app whose users are
> reporting on powerful institutions, a leaked key is not a billing problem — it is an
> account someone else can speak through. This key stays in the Node process and never
> reaches a browser.

*Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). The free
tier is enough to try it; sustained use needs a paid key, and WAZI will tell you plainly
when the quota is reached rather than failing silently.*

### 3. Run

```bash
npm run dev
```

Open **http://localhost:8080** and press **Talk**. WAZI greets you first — then speak to
her in any language you like and she will answer in it.

<details>
<summary><b>Want it on your phone?</b> It already works.</summary>

<br>

Because everything is served from one origin, the browser derives the voice socket from
the page it was loaded from. Find your machine's LAN address and open it on a phone on
the same Wi-Fi:

```bash
npm run dev
# then on the phone:  http://<your-laptop-ip>:8080
```

This is the device WAZI is actually designed for — a small, cheap Android screen on
mobile data. Every view is verified at 360 px wide.

</details>

<details>
<summary><b>No API key?</b> Most of it still works.</summary>

<br>

Everything except the voice runs on the offline country pack: the evidence board, the
record-versus-reality comparison, the adversarial re-check, the draft studio and the
dispatch routes. The voice session says plainly that it cannot connect rather than
quietly substituting something worse — there is deliberately no text-to-speech fallback,
because a browser's default voice cannot match a speaker's accent, which is the whole
point of the product.

</details>

<details>
<summary><b>Production run</b></summary>

<br>

```bash
npm run build
npm start          # serves the built UI and the voice socket from :8080
```

Useful environment variables, all optional:

| Variable | Default | What it does |
|---|---|---|
| `PORT` | `8080` | Port for everything |
| `GEMINI_LIVE_MODEL` | *(chain)* | Pins a Live model to the front of the fallback chain |
| `WAZI_JURISDICTION` | `Nigeria` | Which country pack loads |
| `WAZI_LOG` | *(verbose)* | Set to `quiet` to silence per-session logging |

</details>

### Try these first

Press Talk, then say — or type — any of these:

| Say this | What it shows |
|---|---|
| *"Abeg, wetin be dis FOI ting I dey hear people talk about?"* | WAZI teaches, in the dialect you asked in. The language pill switches itself. |
| *"How long dem get to reply person wey write dem?"* | She cites the seven-working-day clock from the FOI Act — from verified data, not invention. |
| *"The health centre for my area — dem say e don complete, but e no get roof."* | The evidence board opens **on its own.** Nobody pressed a button. |
| *Switch language mid-sentence* | She switches with you and never mentions it. |

---

## Prove it works

Three harnesses, all driving the real thing. None of them mock the API.

```bash
npm run dev               # in one terminal

npm run verify:live       # the voice pipeline, over the real wire protocol
npm run verify:journey    # the whole judged journey, in a real browser at 360px
npm run verify:browser    # the audio stack inside the browser
```

| | what it proves |
|---|---|
| **`verify:live`** | Synthesises a Nigerian-Pidgin utterance, streams it as real 16 kHz PCM over the socket, and asserts the transcription that comes back, the 24 kHz audio going out, **that the reply is in the dialect that was spoken**, that the model reports the language it detected, that it drives the interface, and that a dropped connection resumes the same conversation instead of restarting it. |
| **`verify:journey`** | Drives a 360 px phone screen through signboard → clues → evidence board → re-check → FOI draft → dispatch, asserting the statutory citation, the named authority, the escalation route, and that no view scrolls sideways. Needs **no API key**. |
| **`verify:browser`** | Asserts the 16 kHz capture context, the 24 kHz playback context, that audio is actually scheduled, and that the avatar's mouth is driven by an analyser on the live playback graph. |

```bash
npm run demo              # records the walkthrough as video + a still per beat
```

Every one of these found real defects rather than confirming a happy path — see
[`AI_CODING_LOG.md`](AI_CODING_LOG.md).

---

## How the voice works

```
  microphone
      │  AudioWorklet in an AudioContext opened at 16 kHz
      │  20 ms frames, Float32 → PCM16, transferred not copied
      ▼
  WebSocket /live      binary frames = raw PCM16LE mono
      │                text frames  = JSON control messages
      ▼
  node (server.js)     holds the API key · one Gemini session per socket
      │  ai.live.connect() → BidiGenerateContent
      ▼
  Gemini Live          system instruction injected at `setup`:
      │                  core identity + language mirroring + persona + tools
      │  24 kHz PCM · transcripts both ways · tool calls
      ▼
  PcmPlayer @ 24 kHz   gapless scheduled queue
      ├─► speakers
      └─► AnalyserNode → rAF → RMS + vocal formant energy → the avatar's mouth
```

**Three things worth knowing:**

**1. The language control is a readout, not a setting.** Every session opens with an
unconditional instruction to mirror the speaker's language, dialect, register and accent —
including switches mid-sentence. When WAZI is confident, she calls `note_detected_language` and
the pill in the header follows her. Verified: a Pidgin utterance produces a Pidgin reply and
`pcm-NG` on the pill, with nothing tapped.

**2. The mouth is driven by audio leaving the speakers,** not by chunks arriving off the socket.
An arriving chunk is queued behind everything before it, so measuring it on arrival desyncs the
avatar by the whole queue depth. The level combines broadband amplitude with energy in the vocal
formant band (150 Hz–3.8 kHz), because a fricative carries energy but barely moves a jaw while a
vowel at the same amplitude opens it wide.

**3. Conversations survive a dropped connection.** When a socket closes without a goodbye, the
Gemini session is parked for 20 seconds under a per-tab key. A browser that comes back inside
that window reclaims it with full context. People on mobile data lose signal in lifts and
tunnels; without this, every one of those moments makes them start their case over.

### Model selection

Measured against the live API, not taken from documentation. The Live API rejects an entire
`setup` frame containing one unsupported field, so capabilities are gated per model:

| Model | First audio | Tools | Affective dialog |
|---|---|---|---|
| `gemini-3.1-flash-live-preview` *(default)* | ~1.9 s | ✅ | ❌ rejected |
| `gemini-2.5-flash-native-audio-latest` | ~7.5 s | ✅ | ✅ |
| `gemini-3.8-live` | — | ❌ times out | ❌ rejected |

Measured on a 5.1 s Nigerian-Pidgin utterance. The chain falls through on failure.
`GEMINI_LIVE_MODEL` moves a model to the front rather than replacing the chain, so a bad pin
degrades instead of breaking voice.

---

## How it decides what is true

This is a tool for accusing institutions of not doing what they were paid to do. It has to be
careful, and it has to be honest about its own limits.

**Claims carry states, not confidence scores.** `VERIFIED` · `CORROBORATED` · `REPORTED` ·
`CONFLICTING` · `UNKNOWN`. A percentage implies a precision nobody has, and it invites a
non-technical reader to round 87 % up to "true".

**The record and the reality are never merged.** They sit in two columns. WAZI never says the
contractor stole anything; it says the record claims one thing, the photograph shows another,
and here is the lawful way to make someone account for the difference.

**Every claim carries its source and both dates** — when it was published and when it was
retrieved — because a procurement record that was accurate in March may not be in September.

**"Check again" is adversarial on purpose.** A second pass that actively looks for the
innocent explanation: a later variation order, a boundary reassignment, a phase-two contract, a
debarred contractor. A finding that survives it is worth sending; one that does not should never
have left the phone.

**Emergency numbers are hardcoded, never generated.** WAZI raises the safety banner from the
meaning of what was said, in any language — but the numbers on it come from the country pack. A
hallucinated emergency line is the one failure this app must not have.

### Where the facts come from

The Nigeria country pack (`src/data/jurisdictions/ng/`) is hand-verified against:

| Source | Authority | Tier |
|---|---|---|
| Nigeria Open Contracting Portal (NOCOPO) | Bureau of Public Procurement | Primary |
| FGN Open Treasury Portal | Office of the Accountant-General | Primary |
| NPHCDA Health Facility Baseline Register | National Primary Health Care Development Agency | Primary |
| Budget Office of the Federation | Federal Ministry of Budget & Economic Planning | Primary |
| Ogun State PHC Development Board | Ogun State Ministry of Health | Secondary |

**Stated plainly:** retrieval in this proof of concept is *deterministic*, not live-scraped. The
flagship case is real, hand-verified, and carries its references; the retrieval sequence
replays that verification rather than querying the portals at demo time. That is a deliberate
choice — it is what makes the app work offline, on a bad connection, and in front of judges
whose Wi-Fi we do not control. Swapping the pack for live connectors is an adapter change behind
the same evidence-state contract, not a redesign.

---

## Designed for the conditions, not the demo

| Constraint | What it meant here |
|---|---|
| **Multilingual access** | Language is detected from speech and mirrored, including code-mixing and mid-conversation switches. Literacy in a dominant national language is not a precondition for using this. |
| **Low bandwidth, basic devices** | Raw PCM, not video. Sessions survive a 20 s dropout with context intact. Low-data mode strips animation and glow. Verified at 360 px with no sideways scroll. |
| **Accessibility & inclusion** | Every voice interaction has a text equivalent on the *same* session — not a lesser fallback engine. Live captions are real transcripts of both sides. A refused microphone degrades the session instead of ending it. |
| **Privacy & security** | EXIF stripped on-device before an image is sent anywhere. A disclosure sheet lets a user withhold their name, contact and precise location and sign as a concerned resident. The API key never reaches the browser. Nothing is dispatched without explicit human confirmation. |
| **Trust & verification** | Evidence states over confidence scores; sources and both dates on every claim; an adversarial re-check; emergency numbers never model-generated. |
| **Local relevance** | Statutes, response clocks, named officers and escalation routes come from a per-jurisdiction pack, not from the model. |
| **Clear next steps** | The journey does not end at "here is what the record says". It ends at a letter, addressed to a named officer, with a legal basis, a deadline, and somewhere to escalate when the deadline passes. |

---

## Scaling past Nigeria

Everything jurisdiction-specific lives in one directory:

```
src/data/jurisdictions/ng/
  institutions.json     who is responsible, and who is the accounting officer
  procedures.json       statutes, response clocks, mandatory fields
  contacts.json         verified desks and portals
  projects.json         the verified case record
  source_registry.json  where each fact came from, and how often it changes
```

A new country is a new directory plus `WAZI_JURISDICTION`. Nothing in the voice pipeline, the
evidence-state model, the drafting engine or the UI knows what country it is in. The parts that
*should* differ between Lagos and Nairobi are data; the parts that should not, are code.

---

## Repository map

```
server.js                    one process: UI + /api + /live
server/
  wazi-identity.js           core identity, language mirroring, personas, moments
  live-models.js             measured model capabilities & fallback chain
  civic-tools.js             the tools the voice can call on the interface
  live-bridge.js             one browser socket ↔ one Gemini session
  session-vault.js           parks sessions across a dropped connection
src/
  hooks/useLiveAudio.ts      the live session, as one hook
  lib/audio/MicCapture.ts    16 kHz capture → PCM16 frames
  lib/audio/PcmPlayer.ts     24 kHz gapless playback + viseme analyser
  lib/live-protocol.ts       browser half of the /live wire contract
  lib/evidence-engine.ts     verification, adversarial re-check, drafting
  lib/privacy.ts             EXIF stripping & disclosure filters
  data/jurisdictions/ng/     the Nigeria country pack
  components/                UI
scripts/
  verify-live.mjs            voice pipeline, over the real socket
  verify-journey.mjs         the whole journey, in a real browser
  verify-browser.mjs         the browser audio stack
```

---

## Documentation

| | |
|---|---|
| [`SUBMISSION.md`](SUBMISSION.md) | The written summary: track, sources, trust, and how AI tools were used |
| [`DECISIONS.md`](DECISIONS.md) | Every architectural decision and why, including the ones reversed |
| [`AI_CODING_LOG.md`](AI_CODING_LOG.md) | How this was built with AI tooling, and what the harnesses caught |
| [`THREAT_MODEL.md`](THREAT_MODEL.md) | Threats, mitigations, and the human approval gate |
| [`ACCESSIBILITY.md`](ACCESSIBILITY.md) | WCAG posture, multimodal parity, language access |

---

## Licence

Apache 2.0 / MIT. Built for the Open Society Foundations × Andela hackathon, 2026.
