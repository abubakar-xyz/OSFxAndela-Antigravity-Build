# WAZI Civic — Accessibility & Inclusivity Statement (ACCESSIBILITY.md)

## 1. Compliance Standard
WAZI Civic is designed to meet **WCAG 2.1 Level AA** standards with special considerations for low-bandwidth African mobile environments.

## 2. Implemented Accessibility Features
- **Touch Targets**: All buttons, inputs, and interactive pills meet or exceed the 48x48px minimum touch target size.
- **Contrast Ratios**:
  - Primary text on dark midnight ink background: 14.8:1 (exceeds 4.5:1 requirement)
  - Card text on warm paper background: 12.2:1
  - Evidence badges use dual cues (color + icon + explicit uppercase text) — no status is communicated by color alone.
- **Multimodal Parity**:
  - Every voice interaction has an identical text input fallback, and a typed turn travels the same live session as a spoken one — there is no second, lesser conversation engine behind it.
  - Live captions are real transcripts from the Live API (`inputAudioTranscription` and `outputAudioTranscription`), not a replay of text the app already had. Both sides of the conversation appear on screen as they are spoken, so a deaf or hard-of-hearing user — or anyone on a loud street — follows the same exchange.
- **Language & Dialect Access**:
  - WAZI answers in the language, dialect and register the speaker used, including code-mixed speech and mid-conversation switches, and does so without the user configuring anything. Literacy in a dominant national language is not a precondition for using this app.
  - The language control in the header is a readout of what WAZI heard, not a setting the user must find and maintain correctly before being understood.
- **Safety Triage Without a Language Barrier**:
  - Emergency triage is raised by the model from the meaning of what was said, in any language, rather than from an English keyword list. The numbers it surfaces are hardcoded and verified, never model-generated.
- **Low-Data / Reduced Motion**:
  - Dedicated "Low-Data & Bandwidth Saver" mode in settings disables all keyframe animations, glow filters, and background effects.
  - Honors `prefers-reduced-motion: reduce` OS media queries.
- **Screen Reader Support**:
  - Semantic HTML5 structure (`<main>`, `<header>`, `<button>`, `<input>`, `<h1>`-`<h3>`).
  - Clear `aria-label` attributes on character state transitions and voice controls.
