# WAZI — Written Summary

**OSF × Andela 2026 · *Information you can trust***
**Repository:** https://github.com/abubakar-xyz/OSFxAndela-Antigravity-Build

---

## 1. The track, and why we crossed two

**Primary: Transparency & Accountability. Secondary: Safety, Reporting & Protection.**

We crossed them because the people we built for do not experience them separately.

The moment a citizen can prove that a health centre certified as *completed and commissioned*
has no roof, they have done something that carries risk. Naming a contractor, a ward, a
reference number — while standing in front of the building — is an act of exposure. A
transparency tool that hands someone evidence and no protection has handed them a liability.

So the two tracks are one product decision: **the same flow that builds the case also controls
what the case reveals about the person who built it.** Before anything is dispatched, a
disclosure sheet lets the user withhold their name, their contact and their precise location,
and sign as a concerned community resident. Photographs have their EXIF — GPS, device serial,
timestamp — stripped in the browser, on their phone, before any image reaches a server. And
because the evidence is prepared as a *statutory instrument* rather than an accusation, the user
is exercising a legal right rather than making a public allegation.

---

## 2. What it is

WAZI is a voice-first civic companion. A person talks to it in whatever language they actually
speak. It answers in that same language, dialect and register. It compares what the public
record claims against what they are looking at, shows the two side by side, and produces a
legally grounded letter addressed to the officer who is obliged to answer it.

The single design conviction underneath all of it:

> **Civic information is not inaccessible because it is secret. It is inaccessible because it is
> in the wrong language, the wrong format, and addressed to nobody in particular.**

Everything a Nigerian citizen needs to challenge a non-delivered health centre is already
public — the contract on NOCOPO, the payment on the Open Treasury Portal, the right to ask under
the Freedom of Information Act 2011, the seven-working-day clock in Section 4. None of it is
reachable from where they are standing. WAZI closes that distance.

### What makes it different

**Language is detected, never configured.** There is no language menu to find, no flag to tap.
Every session opens with an unconditional instruction to mirror the speaker's language, dialect,
register and accent — including code-mixing and switches mid-sentence — and the model reports
what it heard so the interface follows it. The control in the header is a *readout*, not a
setting. For someone who is not literate in English, the difference between "detected" and
"configured" is the difference between a usable tool and a locked door.

**The conversation operates the interface.** The evidence board, the camera, the draft studio and
the safety banner are opened by the model calling them as tools when what the person said
warrants it. The alternative — which is what this codebase did before — was an English keyword
match deciding when to leave voice mode. That worked for phrasings someone had anticipated, in
one language. Making it a tool call moves the decision to the thing that already understood the
sentence, whatever language it arrived in. Safety triage inherits this: nobody's emergency has to
pass an English keyword list first.

**It survives the connection people actually have.** When the socket drops, the session is parked
for twenty seconds and a returning browser reclaims it with full context. Users on mobile data
lose signal in lifts, in tunnels, when a mast loses power. Without this, each of those moments
makes someone re-explain their case from the beginning — which is precisely the friction the
product exists to remove.

---

## 3. Information sources, and how we treat them

### The sources

The Nigeria country pack is hand-verified against primary public records:

| Source | Authority | Tier | Refresh |
|---|---|---|---|
| Nigeria Open Contracting Portal (NOCOPO) | Bureau of Public Procurement | Primary | Daily |
| FGN Open Treasury Portal | Office of the Accountant-General | Primary | Daily |
| NPHCDA Health Facility Baseline Register | National Primary Health Care Development Agency | Primary | Quarterly |
| Budget Office of the Federation | Federal Ministry of Budget & Economic Planning | Primary | Annual |
| Ogun State PHC Development Board | Ogun State Ministry of Health | Secondary | Biannual |

Statutes, response deadlines, named accounting officers and escalation routes come from the same
pack — **never from the model.** The Freedom of Information Act's seven-working-day clock is a
fact about Nigerian law, not something a language model should be improvising in front of
someone about to rely on it.

### What is real and what is deterministic — stated plainly

The flagship case is real and hand-verified, and carries its references: Akute Model Primary
Health Care Centre, contract `NPHCDA/2023/LOT-14`, ₦38.25m released on voucher
`OTP-20240228-44102`, certified 100% complete and handed over in March 2024, against a dated
field photograph of an unroofed masonry shell.

**Retrieval at demo time is deterministic, not live-scraped.** The verification sequence replays
that hand-verification rather than querying the portals live. We made that choice on purpose:
it is what lets the app work offline, on a bad connection, and in front of judges whose network
we do not control. It also means the app cannot hallucinate a procurement record under demo
pressure. Swapping the pack for live connectors is an adapter change behind the same
evidence-state contract — the UI, the drafting engine and the trust model do not move.

We would rather be marked down for saying this than be believed for implying otherwise.

### How accuracy is enforced

**Evidence states, not confidence scores.** Every claim is `VERIFIED`, `CORROBORATED`,
`REPORTED`, `CONFLICTING` or `UNKNOWN`. We rejected percentages deliberately: "87% confident"
implies a precision nobody has, and invites a non-technical reader to round it up to "true". A
categorical state maps to how evidence is actually weighed.

**The record and the reality never merge.** They sit in two columns, and the user sees the gap
themselves. WAZI never says money was stolen. It says the record claims one thing, the
photograph shows another, and here is the lawful route to make someone account for the
difference. This is a hard constraint in the system instruction, not a tone preference.

**Every claim carries its source and two dates** — published and retrieved. A procurement record
that was accurate in March may not be in September, and a user about to send a legal instrument
needs to know which.

**"Check again" is adversarial by design.** A second pass that actively hunts for the innocent
explanation: a later variation order, a boundary reassignment, a phase-two contract, a debarred
contractor. A finding that survives it is worth sending. One that does not should never have
left the phone.

**Emergency numbers are hardcoded.** WAZI decides *when* to raise a safety alert — from meaning,
in any language — but the numbers on it come from the country pack. A hallucinated emergency
line is the one failure this app is not allowed to have.

**Nothing is dispatched without a human.** No email is sent, no document is exported, no
disclosure is made without explicit confirmation on a review screen.

---

## 4. How we used AI coding tools

Two assistants, at different stages, doing different jobs.

**Google DeepMind Antigravity IDE (Gemini)** built the product surface: the React shell, the
design-token system, the 2D character, the evidence board, the draft studio, the privacy
pipeline and the country pack. That work is the reason there was a real application to fix.

**Claude Code (Opus)** was then given the codebase and the brief that its voice pipeline —
its central premise — did not work. That session is the substance of this section.

### The method that mattered: verify before building

The handoff brief named an endpoint and a model to build against. Both were probed against the
live API before any code was written, and **neither existed**:

- `gemini-2.0-flash-exp` was not on the project key's model list at all.
- `:streamGenerateContent` is an HTTP/SSE endpoint. The Live API's WebSocket endpoint is
  `BidiGenerateContent`.

A third defect was larger than either: the server called `session.send({realtimeInput})` and
`session.receive()` — **neither of which exists** in `@google/genai` v2. Every audio send threw.
The pipeline had never carried a single frame. It was not mistuned; it was written against an
API that was not there.

An hour of probing the real API replaced a day of debugging against a plausible-sounding
specification. The live models' latencies, and which configuration fields each one actually
accepts, were then measured and encoded in a capability table — because the Live API rejects an
entire session config if it contains one unsupported field, which kills the session before a
single audio frame moves.

### Learning from our own prior work

A second repository of ours (`my-sabi`, a single-purpose Gemini Live companion) was studied as a
reference. It had independently converged on the same Live model, which was useful confirmation,
and its client audio was ahead of ours in specific, measurable ways. We took the dual
time-domain/frequency-domain viseme extraction from it, its tighter jitter scheduling, and the
shape of its barge-in-permitting echo gate — and we did **not** take its session storage, which
parks the live session in a module-level global that would hand one person's conversation to the
next visitor the moment two people connected. Ours is keyed per browser tab.

That reversal is recorded in the open: `DECISIONS.md` entry **DEC-014** documents us removing
echo gating on principle and then partially restoring it once we understood the hardware it had
to run on.

### Tests that drive the real thing

Three verification harnesses were built, and **none of them mock the API**:

- **`verify:live`** synthesises a Nigerian-Pidgin utterance with a TTS model, streams it as real
  16 kHz PCM over the production wire protocol, and asserts the transcription, the audio coming
  back, that the reply is *in the dialect that was spoken*, that the language was reported to the
  interface, that the model drove the UI, and that a dropped connection resumes rather than
  restarts.
- **`verify:journey`** drives the whole judged journey in a real browser at 360 px — a cheap
  phone screen — and needs no API key.
- **`verify:browser`** instruments the browser's own audio graph to prove the mouth is driven by
  an analyser on the live playback path.

**Every one of them found real defects rather than confirming a happy path:** a
`setupComplete`-before-`connect()` race that resolved a session as null; a viseme meter that
stopped on every gap between audio chunks (six seconds of speech produced sixteen animation-frame
reads instead of several hundred); a runaway capture device flooding the API at six times
realtime; four CSS variables referenced but never defined, which rendered the language modal and
the dispatch sheet with no background; and an A4 preview whose fixed aspect ratio let the
attachments list spill out of the page and swallow clicks on the dispatch button.

One harness also reported a failure that **was not one** — it asserted a tool call after a
nominated follow-up turn, while WAZI correctly opens the evidence board on the *first* utterance
that gives her a claim and a place. The test was wrong and was corrected. We think that
distinction is the interesting part of using AI tools well: the model's job is not to make the
suite green, it is to work out which side of a disagreement is actually right.

### Where judgement overrode the brief

The brief asked for the Web Speech API fallbacks to be removed. We removed them and argued for
*why* they had to go rather than be kept as a safety net: a browser's default voice cannot match
a speaker's accent, which is the product's entire premise — and having it available was the
reason the broken pipeline had gone unnoticed. The honest failure mode is the app saying it
cannot reach the voice service, not quietly substituting a robot.

We also raised, unprompted, that `.env` had been committed with a live API key and that
`VITE_GEMINI_API_KEY` was being inlined into the browser bundle. Both are fixed; the committed
key needs rotating.

---

## 5. Honest limitations

- **Retrieval is deterministic in this proof of concept**, as set out in §3. The evidence-state
  contract is built for live connectors; they are not wired.
- **One jurisdiction is populated.** Nigeria. The architecture makes a second a data directory
  rather than a rewrite, but that claim is unproven until someone does it.
- **The Live API's free tier throttles** under sustained testing. The server classifies quota
  exhaustion correctly and says so rather than failing silently, but a heavily-used deployment
  needs a paid key.
- **Dialect coverage is the model's, not ours.** WAZI mirrors what Gemini can hear. We verified
  Nigerian Pidgin end to end; other languages are the model's capability, not a claim we have
  independently tested.

---

## 6. What we want you to take from it

The gap between a citizen and a public record is rarely secrecy. It is language, format, and the
absence of a named person to address. WAZI is built on the belief that closing that gap is an
engineering problem with a real answer — and that the answer has to speak to someone the way
their neighbour would, survive the connection they actually have, protect them while they use
it, and end not with information but with a letter that somebody is legally obliged to answer.
