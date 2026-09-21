# WAZI Civic — Architectural Decisions Log (DECISIONS.md)

## DEC-001: 2D Stylized SVG Luminous Character over Photoreal Avatar
- **Decision**: Implemented WAZI as a non-human, organic luminous character (warm river-stone / flame shape) rendered entirely in lightweight 2D SVG with CSS keyframe state animations.
- **Rationale**:
  - Eliminates uncanny-valley dissonance and false human authority.
  - Neutral across gender, culture, and ethnic backgrounds.
  - Zero heavy 3D assets or GPU dependencies — runs at 60fps even on entry-level Android devices.

## DEC-002: Synthetic Crystal Audio via Web Audio API
- **Decision**: Replaced external MP3 audio assets with real-time synthetic harmonic chimes generated via the browser's Web Audio API.
- **Rationale**:
  - Eliminates network fetch failures for audio assets on mobile networks.
  - Works 100% offline with zero latency.
  - Instant response and zero battery drain.

## DEC-003: Dual-Mode AI Reasoning (Gemini Flash Grounding + Deterministic Offline Pack)
- **Decision**: Built a hybrid engine: when a Gemini API key is present, it uses Gemini 3.8 Flash for dynamic multimodal extraction; otherwise, it executes against a hand-verified, gazetted Country Pack.
- **Rationale**:
  - Ensures 100% reliability during live hackathon judging or low-connectivity mobile scenarios.
  - Protects against quota limits, network drops, and hallucinations.

## DEC-004: Client-Side HTML5 Canvas EXIF Sanitization
- **Decision**: Implemented automatic image re-encoding via offscreen HTML5 Canvas before evidence analysis.
- **Rationale**:
  - Strips GPS metadata, device serials, and timestamps directly on the user's phone.
  - Fulfills the Secondary Track (Safety, Reporting & Protection) requirement for reporting safety.

## DEC-005: Deterministic Evidence States over Percentage Confidence Scores
- **Decision**: Rejected percentage-based confidence scores (e.g., "87% confident") in favor of deterministic categorical states: `VERIFIED`, `CORROBORATED`, `REPORTED`, `CONFLICTING`, `UNKNOWN`.
- **Rationale**:
  - Percentage confidence scores mislead non-technical users and mask data limitations.
  - Categorical states reflect the actual legal and evidentiary standard.
