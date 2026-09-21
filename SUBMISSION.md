# WAZI — Submission Summary

**OSF × Andela 2026 · *Information you can trust***
**Repo:** github.com/abubakar-xyz/OSFxAndela-Antigravity-Build

---

## The track

**Transparency & Accountability** (primary) × **Safety, Reporting & Protection** (secondary).

We crossed them because our users do not experience them separately. The moment
someone can prove a health centre certified *completed* has no roof, they have done
something that carries risk — naming a contractor, a ward, a reference number, while
standing in front of the building. **A transparency tool that hands someone evidence
and no protection has handed them a liability.**

So the same flow that builds the case controls what the case reveals about the person
who built it: EXIF stripped on their phone, a disclosure sheet that lets them sign as a
concerned resident, and evidence framed as a *statutory request* rather than a public
accusation — exercising a right, not making an allegation.

---

## What it is

A voice-first civic companion. Someone talks to it in whatever language they actually
speak. It answers in that same language and dialect, explains how the system works,
compares what the public record claims against what they are looking at, and produces a
legally grounded letter addressed to the officer obliged to answer it.

> **Civic information is not inaccessible because it is secret. It is inaccessible
> because it is in the wrong language, the wrong format, and addressed to nobody in
> particular.**

Three things make it different:

1. **Language is detected, never configured.** No menu, no flag to tap. WAZI mirrors the
   speaker's language, dialect, register and accent — including mid-sentence switches —
   and the interface follows her. For someone not literate in English, "detected" versus
   "configured" is the difference between a usable tool and a locked door.
2. **It teaches before it investigates.** Most turns are someone asking what a right is,
   how a process works, what a word on a form means. WAZI answers those — warmly, in
   their language. The investigation board opens only when there is a specific place and
   a specific grievance.
3. **The conversation operates the interface.** The evidence board, camera, draft studio
   and safety banner are opened by the model calling them as tools. The alternative — an
   English keyword match — worked in one language, for phrasings someone had anticipated.

---

## Information sources

The Nigeria country pack is hand-verified against primary public records:

| Source | Authority | Tier |
|---|---|---|
| Nigeria Open Contracting Portal (NOCOPO) | Bureau of Public Procurement | Primary |
| FGN Open Treasury Portal | Office of the Accountant-General | Primary |
| NPHCDA Health Facility Baseline Register | NPHCDA | Primary |
| Budget Office of the Federation | Fed. Ministry of Budget & Economic Planning | Primary |
| Ogun State PHC Development Board | Ogun State Ministry of Health | Secondary |

Statutes, response deadlines, named accounting officers, escalation routes and emergency
numbers come from this pack — **never from the model.** The FOI Act's seven-working-day
clock is a fact about Nigerian law, not something to improvise in front of someone about
to rely on it.

**Stated plainly:** retrieval in this proof of concept is *deterministic, not
live-scraped*. The flagship case is real and hand-verified — Akute Model PHC, contract
`NPHCDA/2023/LOT-14`, ₦38.25m on voucher `OTP-20240228-44102`, certified complete March
2024, against a dated photograph of an unroofed shell. The sequence replays that
verification rather than querying portals at demo time. That is deliberate: it works
offline, on a bad connection, and it means the app cannot hallucinate a procurement
record under pressure. Swapping in live connectors is an adapter change behind the same
evidence-state contract.

---

## Trust and accuracy

**Evidence states, not confidence scores.** `VERIFIED` · `CORROBORATED` · `REPORTED` ·
`CONFLICTING` · `UNKNOWN`. "87% confident" implies a precision nobody has and invites a
reader to round it up to "true".

**The record and the reality never merge.** Two columns; the user sees the gap
themselves. WAZI never says money was stolen — it says the record claims one thing, the
photograph shows another, and here is the lawful route to make someone account for it.

**Every claim carries its source and two dates** — published and retrieved. A record
accurate in March may not be in September.

**"Check again" is adversarial on purpose.** A second pass hunting the innocent
explanation: a variation order, a boundary reassignment, a phase two, a debarred
contractor. A finding that survives it is worth sending.

**Emergency numbers are hardcoded.** WAZI decides *when* to raise a safety alert, from
meaning, in any language. The numbers come from the pack. A hallucinated emergency line
is the one failure this app may not have.

**Nothing is dispatched without a human.** No email sent, no document exported, no
disclosure made without explicit confirmation on a review screen.

---

## How we used AI coding tools

**Antigravity (Gemini)** built the product surface — React shell, design system, 2D
character, evidence board, draft studio, privacy pipeline, country pack.

**Claude Code (Opus)** was then handed the codebase and told its voice pipeline — the
central premise — did not work.

**The method that mattered: verify before building.** The handoff named an endpoint and
a model to build against. Both were probed against the live API first, and neither
existed. A third defect was larger: the server called two SDK methods that **do not
exist**, so every audio send threw. The pipeline had never carried a single frame. An
hour of probing replaced a day of debugging against a plausible-sounding spec.

**We learned from our own prior work.** A second repo of ours (`my-sabi`) was studied as
a reference. We took its dual-domain viseme extraction (mouth openings rose 78 → 129 per
session), its tighter jitter scheduling, and the shape of its barge-in-permitting echo
gate. We did **not** take its session storage, which parks the live session in a global
that would hand one person's conversation to the next visitor.

**Three test harnesses, none of which mock the API.** Real Pidgin speech streamed as
16 kHz PCM; the whole journey driven on a 360 px phone; the browser's own audio graph
instrumented. **Every one found real defects** — a setup race resolving a session as
null, a lip-sync meter stopping between syllables, a capture device flooding the API at
6× realtime, four undefined CSS variables that left two demo screens with no background,
and an A4 preview whose fixed aspect ratio swallowed clicks on the send button.

One harness reported a failure that **was not one**: it asserted a tool call after a
nominated turn, while WAZI correctly opens the board on the *first* utterance that gives
her a claim and a place. The test was wrong and we fixed the test. That distinction is
what using these tools well looks like — the job is not a green suite, it is working out
which side of a disagreement is right.

**Where judgement overrode the brief:** we were asked to remove the Web Speech fallbacks
and did — but argued they had to go rather than be kept, because a browser's default
voice cannot match a speaker's accent, and its presence was why the broken pipeline had
gone unnoticed. We also raised, unprompted, that a live API key had been committed and
was being inlined into the browser bundle.

---

## Honest limitations

- Retrieval is deterministic in this PoC; live connectors are not wired.
- One jurisdiction is populated. The architecture makes a second a data directory, but
  that is unproven until someone does it.
- Dialect coverage is the model's, not ours. Nigerian Pidgin is verified end to end;
  other languages are Gemini's capability, not a claim we have independently tested.
- The Live API free tier throttles under sustained use. The server classifies quota
  exhaustion and says so rather than failing silently.
