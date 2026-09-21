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
  - Every voice interaction has an identical text input fallback.
  - Live captions appear simultaneously with audio output.
- **Low-Data / Reduced Motion**:
  - Dedicated "Low-Data & Bandwidth Saver" mode in settings disables all keyframe animations, glow filters, and background effects.
  - Honors `prefers-reduced-motion: reduce` OS media queries.
- **Screen Reader Support**:
  - Semantic HTML5 structure (`<main>`, `<header>`, `<button>`, `<input>`, `<h1>`-`<h3>`).
  - Clear `aria-label` attributes on character state transitions and voice controls.
