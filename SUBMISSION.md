# WAZI — Submission Summary

**OSF × Andela 2026 · *Information you can trust***
Repo: github.com/abubakar-xyz/OSFxAndela-Antigravity-Build

> **WAZI** turns *"they said this was finished and it isn't"* into a letter the government
> is legally obliged to answer — in whatever language the person actually speaks.
> *Wazi* is Swahili for open: clear, out in the daylight.

---

## Track

**Transparency & Accountability** (primary) × **Safety, Reporting & Protection** (secondary)

We did not choose two tracks to score twice. We chose two because our user cannot have
one without the other.

The moment someone proves a health centre certified *completed* has no roof, they have
done something that exposes them — naming a contractor, a ward, a reference number,
while standing in front of the building. **A transparency tool that hands someone
evidence and no protection has handed them a liability.**

So protection is not a module bolted to the side. It is the same flow:

- The photograph is inspected and stripped **on the phone**, before it reaches any
  server — and WAZI reports back exactly which tags she found and removed.
- A disclosure sheet lets the user withhold name, contact and precise location, and sign
  as a concerned community resident.
- The output is a **statutory request**, not a public accusation. Exercising a legal
  right is a far safer posture than making an allegation — and it is the posture that
  actually obliges someone to reply.

---

## What it does

A person talks to WAZI in the language they actually speak. She explains how the system
works, compares what the public record claims against what they are looking at, and
produces a legally grounded letter addressed to the officer obliged to answer it.

Three decisions make it different from anything else in this space.

**Language is detected, never configured.** There is no language setting in the app. WAZI
mirrors the speaker's language, dialect, register and accent — including a switch
mid-sentence — then reports what she heard so the interface follows *her*. A language
menu assumes you can read the menu. For a market trader who speaks Pidgin and reads
little English, that menu is a locked door with the key on the other side. This is the
single largest accessibility decision in the product.

**The conversation operates the interface.** The evidence board, the camera, the draft
studio and the safety banner are opened by the model calling them as tools when what was
said warrants it. The codebase we inherited decided this by matching English keywords in
the transcript — which worked in one language, for phrasings someone had anticipated.
Moving the decision to the model that already understood the sentence is what makes the
whole application work in Yoruba or Swahili without translating a single interface
string.

**It ends with an instrument, not an insight.** Not a dashboard of where the money went.
A Freedom of Information request citing Section 4, addressed to a named accounting
officer at a verified desk, with the seven-working-day clock displayed and the ICPC
escalation route pre-loaded for the day it lapses.

---

## Information sources

Everything WAZI asserts about Nigerian institutions comes from a hand-verified country
pack, never from the model:

| Source | Authority | Tier |
|---|---|---|
| Nigeria Open Contracting Portal (NOCOPO) | Bureau of Public Procurement | Primary |
| FGN Open Treasury Portal | Office of the Accountant-General | Primary |
| NPHCDA Health Facility Baseline Register | National Primary Health Care Dev. Agency | Primary |
| Budget Office of the Federation | Fed. Ministry of Budget & Economic Planning | Primary |
| Ogun State PHC Development Board | Ogun State Ministry of Health | Secondary |

**The division of labour is absolute: the model handles language, the pack handles fact.**
Statutes, response deadlines, named officers, escalation routes and emergency numbers all
come from verified data. The FOI Act's seven-day clock is a fact about Nigerian law. It
is not something a language model should improvise in front of someone about to rely on
it.

**Stated plainly.** Record retrieval in this proof of concept is deterministic rather than
live-scraped. The flagship case is real and hand-verified — Akute Model PHC, contract
`NPHCDA/2023/LOT-14`, ₦38.25m on voucher `OTP-20240228-44102`, certified complete March
2024, against a dated photograph of an unroofed shell. The retrieval sequence replays
that verification rather than querying portals at demo time. That is a choice, not an
omission: it works offline, on a collapsing connection, and it means the app physically
cannot hallucinate a procurement record under demo pressure. Live connectors slot in
behind the same evidence-state contract.

**Image analysis, by contrast, is live.** Photographs go to Gemini vision through the
server under an instruction that forbids inventing reference codes, contractors or
agencies not visible in the frame. Shown an ordinary photo with no signboard, it says so
rather than fabricating a project.

---

## Trust and accuracy

This is a tool for telling institutions they did not do what they were paid to do. It has
to be careful, and honest about its own limits.

**Evidence states, not confidence scores.** `VERIFIED` · `CORROBORATED` · `REPORTED` ·
`CONFLICTING` · `UNKNOWN`. We rejected percentages deliberately: "87% confident" implies a
precision nobody has, and a non-technical reader will round it up to "true".

**The record and the reality never merge.** Two columns, five dimensions, tested one at a
time. WAZI never says money was stolen — she shows the gap, dated and sourced, and then
the lawful route to make someone account for it. That is a hard constraint in her
instructions, not a question of tone.

**Every claim carries its source and two dates** — published and retrieved. A procurement
record accurate in March may not be in September, and someone about to send a legal
instrument needs to know which.

**"Check again" is adversarial on purpose.** A second pass that hunts the innocent
explanation: a later variation order, a phase-two contract, a boundary reassignment, a
debarred contractor. The failure we feared most was never a tool that misses corruption.
It was a tool that sends a citizen to confront an institution over a discrepancy with a
perfectly boring explanation.

**Privacy is demonstrated, not asserted.** The app reads the raw bytes of an uploaded
image for JPEG EXIF markers and PNG metadata chunks, re-encodes to strip them, and reports
which tags were purged — GPS, camera hardware, timestamp. The user watches it happen
rather than being told it happened. A privacy receipt, not a privacy promise.

**Emergency numbers are hardcoded.** WAZI decides *when* to raise a safety alert, from
meaning, in any language. The numbers come from the verified pack. A hallucinated
emergency line is the one failure this app may not have.

**Nothing leaves the device without a human.** No email sent, no document exported, no
disclosure made without explicit confirmation on a review screen.

---

## Use of AI coding tools

Two assistants, two jobs, and one method that mattered more than either.

**Google Antigravity (Gemini)** built and later redesigned the product surface — the React
shell, the design system, the character, the evidence board, the draft studio, the privacy
pipeline, the country pack, and the final visual pass including the persistent workflow
navigation.

**Claude Code (Opus)** was handed that codebase and told the voice pipeline — the central
premise of the product — did not work.

### The method: interrogate the API, don't trust the spec

The handoff named an endpoint and a model to build against. Both were probed against the
live API before a line was written, and **neither existed** — the model was not on the
key, and the named endpoint was HTTP streaming, not a WebSocket. A third defect was larger
than either: the server called two SDK methods that **do not exist in the installed
version**, so every audio send threw. The pipeline had never carried a single frame. It
was not mistuned; it was written against an API that was not there.

An hour of probing replaced a day of debugging against a plausible-sounding specification.
Model latencies and the config fields each one actually accepts were then **measured and
encoded as a capability table** the server reads at runtime — because the Live API rejects
an entire session if it contains one unsupported field, killing the connection before any
audio moves.

### Tests that drive the real thing

Three verification harnesses, **none of which mock the API.** One synthesises
Nigerian-Pidgin speech and streams it as real 16 kHz PCM over the production protocol,
asserting the reply comes back *in the dialect that was spoken*. One drives the entire
journey in a browser at 360 px — the screen this is actually for. One instruments the
browser's own audio graph to prove the character's mouth follows live playback rather
than the network.

**Every one found real defects rather than confirming a happy path** — a race that
resolved a live session as null, a lip-sync meter that stopped between syllables, a
capture device flooding the API at six times realtime, four CSS variables referenced but
never defined that left two screens with no background, and a document preview whose fixed
aspect ratio swallowed clicks on the send button.

One harness reported a failure that **was not one**: it asserted a tool call after a
nominated turn, while the app correctly acted on the first utterance that warranted it.
The test was wrong, and the test was fixed. That distinction is what using these tools
well actually looks like. The job is not a green suite. It is working out which side of a
disagreement is right.

### Where the tools pushed back

Asked to remove the Web Speech API fallbacks, we removed them — and argued they had to
*go* rather than be kept as a safety net. A browser's default voice cannot match a
speaker's accent, which is this product's entire premise, and its presence was precisely
why the broken pipeline had gone unnoticed. The tooling also flagged, unprompted, that a
live API key had been committed and was being inlined into the browser bundle.

---

## Honest limitations

- Record retrieval is deterministic in this proof of concept. Image analysis is live.
- One jurisdiction is populated. A second is a data directory, not a rewrite — but that
  is unproven until someone does it.
- Dialect coverage is the model's, not ours. Nigerian Pidgin is verified end to end;
  other languages are Gemini's capability, not a claim we have independently tested.
- The Live API's free tier throttles under sustained use. The server classifies quota
  exhaustion and says so rather than failing silently.
