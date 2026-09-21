# WAZI Civic — Director's Master Build Brief for Claude Code

## 0. Mandate

You are taking over the design and implementation of a high-ambition proof of concept for the Andela x Open Society Foundations 2026 civic-tech hackathon, themed **Information You Can Trust**.

Do not treat this file as a rigid specification whose every implementation choice must be preserved. Treat it as the product's north star, evidence standard, interaction philosophy, and minimum ambition. Before coding, independently review the latest official documentation for every model, API, framework, browser capability, package, and integration you intend to use. Where current evidence suggests a materially better route, take it, document the decision in `DECISIONS.md`, and preserve the product principles below.

The desired outcome is not a generic chatbot with civic-themed prompts. It is a coherent mobile product that feels alive, human, useful, technically ambitious, and unusually trustworthy.

---

## 1. Challenge context

The hackathon asks teams to use AI software-development tools to make reliable information about civic life and opportunity visible, accessible, understandable, verifiable, and actionable for African communities.

The operating constraints include:

- trust, provenance, verification, and freshness;
- low bandwidth and limited device access;
- accessibility across literacy and digital-confidence levels;
- privacy and security for sensitive civic information;
- multilingual access;
- jurisdiction-specific relevance;
- concrete next steps after information is found.

Submissions are judged equally on uniqueness, scalability, use of AI coding tools, and presentation.

### Selected tracks

**Primary: Transparency & Accountability**

The product helps people understand public commitments, services, projects, policies, and institutional responsibilities; compare official claims against lived or field evidence; and communicate a documented issue to the correct public body.

**Secondary: Safety, Reporting & Protection**

The product provides privacy-aware issue reporting, evidence review, disclosure control, and clear referral or escalation pathways. It is not an emergency-dispatch system and must never imply protection that does not exist.

Do not claim Stability & Social Cohesion as a third full track. Better public information and safer institutional communication may contribute to cohesion, but that is an impact pathway rather than a separate product surface.

---

## 2. Product thesis

### Working name

**WAZI Civic**

The team may test alternatives, but the name should signal illumination, guidance, and public agency without sounding like a ministry portal or legal service.

### One-line proposition

> **Talk to WAZI, show what is happening, discover what the public record says, and turn the evidence into the right message for the right institution.**

### What the product is

WAZI Civic is a multilingual, avatar-led civic companion with three tightly connected capabilities:

1. **Understand**: explain public services, policies, rights, opportunities, public projects, and institutional responsibilities in plain language;
2. **Verify**: connect a person's question, photograph, signboard, document, receipt, screenshot, or field observation with traceable official and credible records;
3. **Act**: identify the responsible body and verified contact route, then prepare a reviewable evidence-backed email, letter, information request, complaint, petition, or shareable case brief.

### What makes it frontier rather than basic

The innovation is not any individual feature. It is the interaction between them:

- a persistent real-time conversational character;
- multimodal understanding of the user's environment;
- jurisdiction and entity resolution;
- evidence retrieval with provenance and freshness;
- Record vs Reality comparison;
- adversarial re-verification;
- institutional routing;
- controlled document generation;
- human approval before every consequential action.

The system does not merely answer. It helps a person move from **confusion or observation to verified understanding, then from verified understanding to a usable civic artifact**.

---

## 3. Flagship scenario

The flagship demonstration uses one real, locally verified public project or service-delivery issue.

A person opens WAZI on a mobile browser and speaks naturally:

> “They said this health centre was completed, but look at what is here.”

The person opens the camera and shows a project signboard and current site condition. WAZI:

1. sees and transcribes visible clues without overstating certainty;
2. asks for or confirms only the minimum location needed;
3. resolves the likely project, agency, and jurisdiction;
4. searches the prepared civic source pack and, where appropriate, grounded web sources;
5. distinguishes budget allocation, contract award, payment, reported completion, and physical delivery;
6. displays an **Official Record vs Field Evidence** board;
7. assigns a claim-level evidence state rather than a percentage confidence score;
8. offers **Check Again**, an adversarial search for contradiction or mistaken identity;
9. determines the appropriate institution and verified public contact route;
10. offers several action formats;
11. generates the selected artifact with sources and attachments;
12. shows a disclosure review before export or simulated sending.

The memorable moment is not merely that the AI can see a signboard. It is that the product connects something visible in a person's community to institutional records, explains the limits of the finding, finds the correct route for response, and turns the case into a usable document in minutes.

---

## 4. Product architecture: one home, expandable workspaces

### Home: The Companion

The home screen is primarily the user and WAZI.

WAZI is a stylised, lovable, non-human 2D character with a strong visual identity. Avoid a photoreal human because that introduces uncanny-valley risk, cultural and gender assumptions, heavier rendering, and excessive implied authority.

WAZI should have clear states:

- resting;
- listening;
- thinking;
- speaking;
- waiting for permission;
- quietly working in the background;
- requiring attention.

The character may subtly move within a bounded stage, orient towards new cards, and contract into a persistent companion when workspaces open. Do not build an uncontrolled free-roaming character or a game engine.

The home screen contains only:

- a prominent hold-to-talk control;
- Show WAZI;
- Type instead;
- a small expandable action dock;
- captions/transcript;
- language control;
- low-data and privacy controls.

The first line should be task-oriented and natural:

> “What would you like to understand or show me?”

WAZI remains capable of broad natural conversation, but the product should gracefully recognise civic intents and offer specialised workflows. General questions must not be allowed to bypass evidence requirements for civic facts.

### Persistent companion model

When a workspace opens, WAZI does not disappear. The character contracts into a small, unobtrusive companion surface that can:

- speak briefly;
- remain interruptible;
- indicate tool progress;
- highlight a relevant card;
- expand back into conversation;
- return the user to Home.

The workspace, not the avatar, owns the majority of screen space during evidence-intensive tasks.

### Action dock

Use one elegant expandable control rather than a permanent grid of modules. The dock may reveal:

- Check something
- Report an issue
- Understand a service or policy
- Open my drafts
- View saved cases

These are alternative entrances into the same underlying engine, not disconnected products.

---

## 5. Core workflows

### A. Conversational understanding

WAZI supports live voice, visible transcription, text fallback, user interruption, transcript correction, and explicit language switching.

Rules:

- one spoken sentence by default;
- three short sentences maximum;
- one question per turn;
- never read long figures or source lists aloud;
- never imitate an accent;
- do not promise exact dialect matching;
- follow tested languages and natural code-switching when reliable;
- remain transparent when transcription or language detection may be wrong.

### B. Show WAZI

The user can supply a camera frame, photo, screenshot, receipt, notice, form, signboard, letter, or PDF.

The system extracts structured clues such as:

- visible project or service name;
- institution;
- location clue;
- date;
- reference or tender number;
- amount;
- contact information;
- claimed status;
- visible physical condition.

All extracted clues remain editable before they are used. Separate what is visibly observed from what the model infers.

### C. Civic verification

The evidence engine resolves entities and queries a versioned Country Pack containing:

- source registry;
- structured project and service records;
- laws, policies, circulars, and official guidance;
- institutional directory;
- verified public contact routes;
- complaint and information-request procedures;
- source-quality and freshness metadata.

Use structured records for exact amounts, dates, IDs, agencies, payments, and statuses. Use document retrieval for explanatory rules and policies. Use grounded web search for current discovery and freshness checks. Never convert absence of a search result into proof that something did not occur.

### D. Record vs Reality

Render a deterministic comparison board:

- claim being checked;
- matched project/service/entity;
- official record;
- field or user evidence;
- agreements;
- differences;
- missing evidence;
- source, publication date, retrieval date, and excerpt;
- last checked;
- evidence state;
- Check Again;
- Take Action.

Evidence states:

- **VERIFIED**: directly supported by a primary authoritative source;
- **CORROBORATED**: supported by sufficiently independent credible sources;
- **REPORTED**: a claim exists without independent establishment;
- **CONFLICTING**: credible records or field evidence disagree;
- **UNKNOWN**: evidence is insufficient.

Never state that a photograph proves corruption, non-delivery, abandonment, or percentage completion. A photograph can support a dated observation and may reveal a discrepancy requiring further evidence.

### E. Check Again

A second verification pass is adversarial. Search for:

- a newer record;
- contradictory figures;
- mistaken jurisdiction;
- mismatched identifier;
- duplicate project names;
- changed service guidance;
- missing payment or completion evidence;
- alternative explanation;
- a source-quality limitation.

The system must be able to revise or downgrade its first result.

### F. Institutional routing

When the user chooses Take Action, the system identifies:

- responsible public body;
- relevant department or office;
- verified official email, portal, postal address, or phone route;
- jurisdiction;
- available complaint, information-request, ombudsman, or escalation process;
- required information and attachments;
- any source-backed deadline.

Contact information must come from a verified source and show when it was checked. If the responsible individual changes frequently, prefer the office or role over a person's name unless an official current directory confirms it.

### G. Civic Draft Studio

The Draft Studio is a first-class workspace, not a text blob in chat.

Available formats should depend on the case and jurisdiction:

- concise email;
- formal letter;
- Freedom of Information request;
- service complaint;
- ombudsman or agency complaint;
- issue report;
- petition draft;
- WhatsApp-ready summary;
- printable one-page case brief;
- evidence index.

Each draft includes:

- recipient and verified route;
- subject;
- neutral factual summary;
- requested resolution or information;
- evidence references;
- attachment list;
- source notes;
- optional user details;
- clear statement that the document is a draft for review.

The user can:

- edit wording;
- choose tone and length;
- remove personal information;
- include or exclude attachments;
- copy;
- print;
- export to PDF;
- open an email draft;
- produce a WhatsApp-ready message;
- simulate submission in demo mode.

Do not claim a PDF is signed unless an actual signing flow exists. Do not auto-send. Do not represent a simulated action as delivered.

### H. Case workspace

Every issue becomes a lightweight case containing:

- conversation summary;
- claim;
- evidence board;
- sources;
- user-provided files;
- generated drafts;
- selected recipient;
- disclosure settings;
- action history;
- status set by the user.

The Case workspace gives persistence and pride of place to deliverables without cluttering Home.

---

## 6. Personality and system behaviour

WAZI is warm, observant, concise, grounded, non-judgmental, and quietly capable.

WAZI is not a government official, lawyer, investigator, activist, emergency responder, or human caseworker.

WAZI can converse broadly, but when a user asks a changeable civic question, WAZI must search or retrieve before answering.

Core behavioural rules:

1. Reflect the task, not a presumed emotion.
2. Ask only what is needed to progress.
3. Explain uncertainty in ordinary language.
4. Distinguish observation, report, official record, and inference.
5. Never invent an amount, law, address, deadline, project, contact, or document requirement.
6. Never accuse a person or institution of misconduct from a discrepancy alone.
7. Never expose hidden reasoning. Show process status, sources, and conclusions.
8. Keep spoken output short, with richer detail on screen.
9. Let the user interrupt, correct, rewind, or switch modality.
10. Require explicit approval before any consequential external action.

Implement prompts as separate files:

- `identity.md`
- `conversation_policy.md`
- `evidence_policy.md`
- `safety_policy.md`
- `state_prompts/*.md`
- `drafting_policy.md`
- `jurisdictions/<country>/<pack>.json`

Do not place the entire product in one system instruction.

---

## 7. Tool contracts

Prefer narrow, testable functions:

- `classify_civic_intent`
- `resolve_jurisdiction`
- `extract_visual_clues`
- `resolve_civic_entity`
- `search_country_pack`
- `ground_current_information`
- `verify_claim`
- `challenge_finding`
- `find_responsible_body`
- `verify_contact_route`
- `list_action_options`
- `build_civic_draft`
- `render_export`
- `prepare_external_action`

Every evidence-related response must include structured provenance, freshness, missing fields, and an explicit evidence status. Validate outputs against schemas before they reach the interface.

A tool error is a valid product state. It is not permission for the conversational model to improvise.

---

## 8. Gemini implementation guidance

At the time of this brief, Google's official documentation lists Gemini 3.8 Live as the default model for most low-latency voice-agent experiences and Gemini 3.8 Live Extended Thinking for interactions that require more background reasoning. The Live API supports continuous audio, image, and text streams, tool use, transcripts, multilingual conversation, interruption, and stateful WebSocket sessions. Extended Thinking requires special handling because `turnComplete` does not necessarily mean the session is idle during asynchronous reasoning.

Before implementation, verify all of this again in official documentation and test model access in the team's actual API project.

Recommended architecture:

- Use **Gemini 3.8 Live** for the default conversational loop because low latency matters more than deep reasoning for ordinary turns.
- Route hard verification work to a backend evidence worker using **Gemini 3.8 Flash** with Google Search grounding and structured output.
- Consider **Gemini 3.8 Live Extended Thinking** only after the default Live path works reliably, or for a deliberately triggered deep-check mode.
- Do not rely on the Live model alone for structured evidence artifacts.
- Handle Live tool responses explicitly.
- Use ephemeral tokens if the browser connects directly to the Live API.
- Keep API keys and privileged actions server-side.
- Implement cancellation, interruption, reconnect, idle, and tool-pending states deliberately.

Avatar animation is an interface layer. Do not assume the Live API emits visemes unless current official documentation confirms it. Start with robust audio-amplitude and speaking-state animation; add phoneme/viseme approximation only if it materially improves the experience without destabilising mobile performance.

---

## 9. Information and data strategy

The flagship demo must be built around a small, real, hand-verified evidence pack.

Required records:

- one real project or service issue;
- authoritative project/service record;
- publication and retrieval dates;
- exact official status wording;
- responsible institution;
- genuine public contact route;
- action procedure;
- a current field photograph or clearly labelled demo fixture;
- an independent credible source where available;
- known data-quality limitations.

Do not use the placeholder procurement record currently in the seed file. Replace it before demo day.

Demo fixtures are allowed only when clearly labelled in the repository and interface. Never present synthetic data as live government data.

---

## 10. Privacy and reporting safety

Privacy is a visible interaction, not a hidden policy page.

Implement:

- contextual permission requests;
- text fallback for every voice flow;
- no raw-audio persistence by default;
- EXIF/GPS stripping before image storage;
- optional approximate location;
- redaction preview for faces, plates, phone numbers, and addresses where feasible;
- separation of identity data from case evidence;
- a disclosure review before export or action;
- deletion controls;
- clear prototype retention language.

Never promise anonymity, voice de-identification, legal privilege, guaranteed government response, or personal protection unless those protections actually exist.

If the user reports immediate danger, do not attempt an open-ended AI investigation. Present a pre-verified local support route and encourage the user to prioritise immediate safety.

---

## 11. Low-bandwidth and accessibility

Build the rich PWA, but make the core useful without rich media.

Required:

- mobile-first responsive layout;
- installable PWA;
- captions and editable transcripts;
- fully usable text mode;
- low-data mode;
- compressed upload preview;
- cached flagship Country Pack and current case;
- reconnect and retry states;
- large touch targets;
- high contrast;
- screen-reader labelling;
- reduced motion;
- visible focus states;
- plain-language summaries;
- no colour-only status communication.

Treat SMS, WhatsApp bot, USSD, and IVR as future transport layers unless actually implemented. Do not claim them in the POC as working features.

---

## 12. Visual direction

The product should feel like a trusted personal companion entering a rigorous evidence workspace.

Suggested visual system:

- midnight ink `#071820`;
- warm paper `#F7F3E8`;
- luminous teal `#16C6B1`;
- sun amber `#F4B942`;
- verified green `#4BCB91`;
- conflict coral `#EC7067`;
- muted slate `#78909A`.

Home can be atmospheric and character-led. Evidence, Cases, and Draft Studio should become calmer, brighter, and document-oriented.

Avoid:

- generic government blue;
- dense admin dashboards;
- cyberpunk interfaces;
- floating glass panels everywhere;
- photoreal avatars;
- culturally stereotyped costume;
- excessive animation;
- walls of chat bubbles;
- tiny source text;
- modal after modal.

Use progressive disclosure, generous whitespace, strong typographic hierarchy, and deterministic components.

---

## 13. Three-minute demo

### 0:00-0:20 — Meet WAZI

WAZI opens in a calm mobile scene and asks what the user would like to understand or show. The user speaks naturally. Captions appear.

### 0:20-0:45 — Show the issue

The user opens the camera and shows the real signboard/site image. WAZI extracts editable clues and confirms the location/project match.

### 0:45-1:20 — Connect the records

WAZI contracts into the companion position. The Evidence workspace visibly checks the prepared source pack, dates, agency, status, and contradiction risk.

### 1:20-1:45 — Record vs Reality

The board reveals that official status and dated field evidence differ. WAZI uses restrained language and states what remains unknown.

### 1:45-2:05 — Check Again

The user challenges the result. The adversarial pass looks for a mistaken match, newer status, or alternative explanation and shows whether the result changes.

### 2:05-2:25 — Route the issue

The user taps Take Action. WAZI identifies the responsible office and displays the verified public route and why it is appropriate.

### 2:25-2:45 — Create the deliverable

The user selects email, formal letter, or WhatsApp summary. Draft Studio produces a polished artifact with factual summary, request, citations, and attachments.

### 2:45-2:55 — Human control

The disclosure review shows exactly what will be shared. The user removes precise location and exports the PDF or opens a prepared email draft. Sending remains simulated unless a safe integration is actually built.

### 2:55-3:00 — Close

> “Public information only becomes power when people can connect it to what they see, understand what it means, and reach the institution that can act.”

---

## 14. Scope and prioritisation

### Must work end to end

1. Persistent Live conversation with captions and interruption.
2. One real multilingual test path.
3. Camera/photo intake and editable clue extraction.
4. One genuine Country Pack and flagship case.
5. Record vs Reality board.
6. Claim-level provenance and dates.
7. Check Again.
8. Responsible-body and contact-route lookup.
9. Draft Studio with at least email, formal letter/PDF, and WhatsApp summary.
10. Disclosure review.
11. Saved case and return-to-avatar navigation.
12. Honest demo mode.

### Stretch only after reliability

- second country or jurisdiction pack;
- live camera rather than photo capture;
- sophisticated viseme lip-sync;
- redaction assistance;
- real email handoff;
- second civic-domain scenario;
- richer long-term case tracking.

### Explicitly cut

- blockchain;
- reputation points;
- automatic accusations;
- autonomous submission;
- fake signatures;
- unverified contact scraping;
- emergency case management;
- generic “ask anything” claims as the pitch;
- unsupported language promises;
- fabricated live-data integrations.

---

## 15. Build sequence

1. Verify Gemini model access and build the smallest stable Live audio loop.
2. Prototype the full mobile state machine with deterministic fixture data.
3. Validate the flagship case and Country Pack.
4. Implement evidence schemas and source rendering.
5. Add image/document clue extraction.
6. Add Record vs Reality and Check Again.
7. Add institutional routing and contact verification.
8. Add Draft Studio and PDF/export surfaces.
9. Add disclosure controls and case persistence.
10. Integrate Live conversation into the state machine.
11. Add character animation and transitions.
12. Test low-data, accessibility, interruption, reconnect, tool failure, UNKNOWN, source conflict, incorrect project match, and permission denial.
13. Conduct short usability tests with representative mobile users.
14. Fix comprehension and reliability before adding polish.

---

## 16. Required repository deliverables

- working mobile-first PWA;
- public README with problem, tracks, architecture, setup, data provenance, limitations, and demo path;
- `.env.example` without credentials;
- prompt files separated by role;
- JSON schemas and runtime validation;
- Country Pack and source registry;
- clearly labelled demo fixtures;
- `DECISIONS.md`;
- `THREAT_MODEL.md`;
- `ACCESSIBILITY.md`;
- `AI_CODING_LOG.md` documenting use of AI coding tools;
- evaluation suite;
- demo script;
- written hackathon summary;
- exportable pitch-deck assets.

Required tests include:

- unsupported factual claim blocked;
- stale source surfaced;
- wrong jurisdiction corrected;
- project-ID mismatch handled;
- contradictory sources produce CONFLICTING;
- missing evidence produces UNKNOWN;
- Check Again can overturn the initial result;
- permission denial preserves a path forward;
- audio interruption works;
- tool failure does not trigger hallucination;
- unverified contact information is not offered;
- no external action occurs without approval;
- draft contents match selected evidence and disclosure settings.

---

## 17. Autonomy clause for Claude Code

You have authority to improve implementation choices, information architecture, component design, model routing, animation method, storage approach, naming, and technical stack when current documentation, platform constraints, usability evidence, or reliability testing indicate a better path.

Before making a major deviation, ask:

1. Does it strengthen the core user journey from conversation to evidence to action?
2. Does it improve trust, accessibility, safety, or demo reliability?
3. Does it preserve the strongest differentiators: persistent companion, multimodal civic verification, institutional routing, and Draft Studio?
4. Can it be demonstrated honestly within the hackathon timeframe?

If yes, proceed and record the rationale. If a proposed feature is visually impressive but weakens reliability or truthfulness, cut it.

The final product should feel ambitious because difficult technology has been made simple for the user, not because the interface displays complexity.
