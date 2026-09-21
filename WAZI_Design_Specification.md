# WAZI Civic — Definitive Design Specification

> *"Design is not just what it looks like and feels like. Design is how it works."* — Steve Jobs
>
> *"Less, but better."* — Dieter Rams
>
> This is the single source of truth for every visual, interaction, animation, personality, component, and system detail needed to build WAZI Civic. Any engineer, designer, or AI agent reading this file should be able to construct the complete product without ambiguity.

---

## Table of Contents

1. [Design Philosophy & First Principles](#1-design-philosophy--first-principles)
2. [The Emotional Promise](#2-the-emotional-promise)
3. [Design System Foundation](#3-design-system-foundation)
4. [Typography System](#4-typography-system)
5. [Spacing & Layout System](#5-spacing--layout-system)
6. [WAZI Character Design](#6-wazi-character-design)
7. [Screen Architecture & Navigation](#7-screen-architecture--navigation)
8. [Screen 1: First Launch & Onboarding](#8-screen-1-first-launch--onboarding)
9. [Screen 2: Home — The Companion](#9-screen-2-home--the-companion)
10. [Screen 3: Evidence Workspace](#10-screen-3-evidence-workspace)
11. [Screen 4: Record vs Reality Board](#11-screen-4-record-vs-reality-board)
12. [Screen 5: Draft Studio](#12-screen-5-draft-studio)
13. [Screen 6: Case Workspace](#13-screen-6-case-workspace)
14. [Voice & Conversation UX](#14-voice--conversation-ux)
15. [Camera & Visual Input UX](#15-camera--visual-input-ux)
16. [Animation & Motion System](#16-animation--motion-system)
17. [WAZI Personality & Voice Identity](#17-wazi-personality--voice-identity)
18. [Micro-interactions & Haptic Language](#18-micro-interactions--haptic-language)
19. [Privacy & Trust UX](#19-privacy--trust-ux)
20. [Accessibility & Low-Bandwidth](#20-accessibility--low-bandwidth)
21. [Component Library](#21-component-library)
22. [Icon System](#22-icon-system)
23. [Sound Design](#23-sound-design)
24. [Error States & Edge Cases](#24-error-states--edge-cases)
25. [Demo Flow Choreography](#25-demo-flow-choreography)
26. [Technical Implementation Notes](#26-technical-implementation-notes)

---

## 1. Design Philosophy & First Principles

### Why people come back

The most widely adopted consumer products — WhatsApp, Duolingo, the original iPhone — share a secret: they don't ask the user to learn anything. They feel like an extension of the person's own intent. The interface disappears. The task gets done. The user feels capable.

WAZI Civic must feel like that. Not like a government portal. Not like a chatbot. Not like a dashboard. Like a **companion who already understands what you're trying to do**.

### Seven immovable design laws

These are not suggestions. Every design decision in this document flows from them.

| # | Law | What it means for WAZI |
|---|-----|----------------------|
| 1 | **Zero learning curve** | A person who has never seen this app must be able to speak to WAZI within 3 seconds of opening it. No tutorial modals. No "tap here to begin." The app opens, WAZI is already there, already listening, already warm. |
| 2 | **One thing at a time** | Every screen has one primary job. The Home is for talking. The Evidence Workspace is for understanding. The Draft Studio is for creating. Never mix responsibilities. Steve Jobs killed the PDA, the phone, and the iPod — then unified them under a single interaction per moment. |
| 3 | **Show, don't tell** | WAZI's state (listening, thinking, finding, waiting for you) is always visible through animation, never through text labels like "Processing…". Duolingo never says "loading lesson" — the owl bounces. WAZI never says "searching" — its glow pulses outward like a heartbeat. |
| 4 | **Earned complexity** | Simple by default, powerful when needed. WhatsApp's genius is that 80% of users only ever need the chat screen. The 20% who need broadcast lists, business tools, and starred messages can find them — but they're never in the way. WAZI's action dock, evidence boards, and draft tools appear only when the conversation earns their entrance. |
| 5 | **Trust is visual** | Every source has a date. Every claim has a state. Every action has a preview. Every export has a disclosure review. Trust is not a policy page — it's a visible, living part of every screen. |
| 6 | **Emotional resonance** | People don't remember features. They remember how something made them feel. WAZI should make people feel: heard, capable, informed, and never alone when facing institutions. The character, the warmth of the palette, the gentleness of the animations — these are not decorations. They are the product. |
| 7 | **Honest performance** | Every state is a real state. Loading is visible. Errors are named. Limitations are spoken. A tool failure does not become a hallucination. An absence of data does not become a conclusion. Dieter Rams: "Good design is honest." |

---

## 2. The Emotional Promise

### The feeling we're designing for

Close your eyes. Imagine you're standing in front of a construction site. The signboard says "Completed" but the building is a skeleton. You feel angry, confused, powerless. You don't know who to talk to. You don't know if anyone cares.

Now imagine pulling out your phone. A warm, familiar character appears — not a robot, not a bureaucrat, not a search engine. A companion. You show it what you see. It understands. It finds the records. It shows you the gap between what was promised and what exists. It knows exactly which office to contact. It writes the letter for you. You review it, you control it, you send it.

**That transformation — from powerless to equipped — is the product.**

Every pixel, every animation, every color choice, every word WAZI speaks must serve that transformation.

### Emotional arc of a session

```
ENTRY        →  "I'm here for you"         →  Warm, calm, inviting
LISTENING    →  "I hear you"               →  Attentive, patient, gentle
SHOWING      →  "Let me look"              →  Curious, focused, careful
SEARCHING    →  "I'm finding the truth"    →  Determined, thorough, transparent
REVEALING    →  "Here's what I found"       →  Clear, honest, structured
CHALLENGING  →  "Let me check again"       →  Rigorous, self-correcting
ACTING       →  "Here's what you can do"   →  Empowering, precise, practical
EXPORTING    →  "You're in control"        →  Safe, private, confident
```

---

## 3. Design System Foundation

### Color Palette

The palette is inspired by African dawn — the deep ink of pre-dawn sky meeting warm earth tones, punctuated by the luminous teal of tropical water and the amber of first light.

#### Primary Colors

```css
:root {
  /* Deep foundations */
  --midnight-ink:        #071820;    /* Primary background, deep trust       */
  --midnight-ink-90:     #0A2230;    /* Elevated surfaces in dark mode       */
  --midnight-ink-80:     #132D3C;    /* Cards, overlays in dark context      */
  --midnight-ink-70:     #1E3A4A;    /* Subtle borders, dividers            */

  /* Warm grounds */
  --warm-paper:          #F7F3E8;    /* Light mode background, document bg   */
  --warm-paper-95:       #F2EDE0;    /* Slightly recessed surfaces           */
  --warm-paper-90:       #EBE5D6;    /* Input fields, secondary bg           */
  --warm-paper-80:       #DDD7C7;    /* Borders in light mode                */

  /* The WAZI colors — these define the character */
  --luminous-teal:       #16C6B1;    /* WAZI's primary energy, CTAs          */
  --luminous-teal-light: #4DD8C8;    /* Hover states, glow effects           */
  --luminous-teal-dim:   #0E8A7D;    /* Pressed states                       */
  --luminous-teal-glow:  rgba(22, 198, 177, 0.15);  /* Ambient glow   */

  --sun-amber:           #F4B942;    /* Warmth, attention, notifications     */
  --sun-amber-light:     #F7CC6E;    /* Gentle highlights                    */
  --sun-amber-dim:       #D49C2A;    /* Pressed/active amber states          */
}
```

#### Semantic Colors — Evidence States

These colors are never used decoratively. They appear ONLY in evidence contexts.

```css
:root {
  /* Evidence states */
  --verified-green:      #4BCB91;    /* VERIFIED — directly confirmed        */
  --verified-green-bg:   rgba(75, 203, 145, 0.12);
  
  --corroborated-blue:   #5BA3E6;    /* CORROBORATED — independently supported */
  --corroborated-blue-bg: rgba(91, 163, 230, 0.12);

  --reported-amber:      #E8A838;    /* REPORTED — claim exists, unverified  */
  --reported-amber-bg:   rgba(232, 168, 56, 0.12);

  --conflicting-coral:   #EC7067;    /* CONFLICTING — sources disagree       */
  --conflicting-coral-bg: rgba(236, 112, 103, 0.12);

  --unknown-slate:       #78909A;    /* UNKNOWN — insufficient evidence      */
  --unknown-slate-bg:    rgba(120, 144, 154, 0.12);
}
```

#### Neutral Scale

```css
:root {
  --neutral-100:  #FFFFFF;
  --neutral-95:   #F5F5F5;
  --neutral-90:   #E8E8E8;
  --neutral-80:   #C4C4C4;
  --neutral-60:   #8C8C8C;
  --neutral-40:   #5C5C5C;
  --neutral-20:   #2E2E2E;
  --neutral-10:   #1A1A1A;
  --neutral-05:   #0D0D0D;
}
```

#### Color Usage Rules

1. **Home screen** (Companion mode): Dark foundation. `--midnight-ink` background. WAZI glows with `--luminous-teal`. Warm and atmospheric. This is WAZI's living room.
2. **Evidence & Case workspaces**: Transition to light. `--warm-paper` background. Clean, document-oriented. Evidence states use semantic colors ONLY. This is the workshop.
3. **Draft Studio**: Brightest. Pure `--neutral-100` writing surface with `--warm-paper` chrome. This is the clean desk where the deliverable is crafted.
4. **Never** use evidence colors (green, coral, etc.) for buttons, navigation, or decoration. They are reserved exclusively for trust communication.

### Elevation & Shadow System

Shadows are warm, not cold. They use amber-tinted darkness, not pure black.

```css
:root {
  --shadow-xs:    0 1px 2px rgba(7, 24, 32, 0.06);
  --shadow-sm:    0 2px 4px rgba(7, 24, 32, 0.08);
  --shadow-md:    0 4px 12px rgba(7, 24, 32, 0.10);
  --shadow-lg:    0 8px 24px rgba(7, 24, 32, 0.12);
  --shadow-xl:    0 16px 48px rgba(7, 24, 32, 0.16);
  
  /* WAZI's ambient glow — used behind the character */
  --wazi-glow:    0 0 60px rgba(22, 198, 177, 0.20),
                  0 0 120px rgba(22, 198, 177, 0.08);
  
  /* Warm inner glow for cards in dark mode */
  --card-glow:    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
```

### Border Radius System

Rounded, but not bubbly. Confident, not childish.

```css
:root {
  --radius-xs:   4px;     /* Chips, tags, small badges              */
  --radius-sm:   8px;     /* Input fields, small cards               */
  --radius-md:   12px;    /* Standard cards, buttons                 */
  --radius-lg:   16px;    /* Modal sheets, workspace panels          */
  --radius-xl:   24px;    /* The talk button, major CTAs             */
  --radius-full: 9999px;  /* Pills, avatar containers, round buttons */
}
```

---

## 4. Typography System

### Font Stack

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

:root {
  /* Primary — Inter: clean, legible, designed for interfaces */
  --font-primary:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Display — DM Serif Display: elegant contrast for headlines and branding */
  --font-display:  'DM Serif Display', 'Georgia', serif;
  
  /* Mono — for reference numbers, IDs, source metadata */
  --font-mono:     'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
}
```

### Type Scale

Designed for mobile-first reading. Base size 16px. Scale ratio approximately 1.25 (major third).

```css
:root {
  /* Body text */
  --text-xs:      0.75rem;    /* 12px — metadata, timestamps, captions      */
  --text-sm:      0.875rem;   /* 14px — secondary text, source labels       */
  --text-base:    1rem;        /* 16px — body text, conversation             */
  --text-md:      1.125rem;   /* 18px — emphasized body, card titles        */
  
  /* Headings */
  --text-lg:      1.25rem;    /* 20px — section headers, workspace titles   */
  --text-xl:      1.5rem;     /* 24px — page titles                         */
  --text-2xl:     1.875rem;   /* 30px — hero text, WAZI's greeting          */
  --text-3xl:     2.25rem;    /* 36px — splash/branding only                */

  /* Line heights — generous for readability */
  --leading-tight:   1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.65;
  
  /* Letter spacing */
  --tracking-tight:  -0.02em;
  --tracking-normal:  0;
  --tracking-wide:    0.02em;
  --tracking-wider:   0.05em;
  
  /* Font weights */
  --weight-light:    300;
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
}
```

### Typographic Roles

| Role | Font | Size | Weight | Tracking | Usage |
|------|------|------|--------|----------|-------|
| Hero greeting | Display | 2xl | Regular | Tight | WAZI's opening line on Home |
| Page title | Primary | xl | Semibold | Normal | Workspace headers |
| Section header | Primary | lg | Semibold | Normal | Cards, panel sections |
| Body | Primary | base | Regular | Normal | Conversation, descriptions |
| WAZI speech caption | Primary | md | Medium | Normal | Live captions of WAZI speaking |
| User speech caption | Primary | base | Regular | Normal | User's transcribed speech |
| Label | Primary | sm | Medium | Wide | Form labels, metadata headers |
| Source citation | Mono | xs | Regular | Normal | Source dates, IDs, URLs |
| Evidence state badge | Primary | xs | Bold | Wider | VERIFIED, CONFLICTING, etc. |
| Button text | Primary | base | Semibold | Wide | All interactive buttons |

---

## 5. Spacing & Layout System

### Spacing Scale

8px base unit. Everything is a multiple of 8.

```css
:root {
  --space-1:   4px;      /* Hairline gaps, icon-to-label           */
  --space-2:   8px;      /* Tight internal padding                  */
  --space-3:   12px;     /* Compact component padding               */
  --space-4:   16px;     /* Standard padding, gaps between elements */
  --space-5:   20px;     /* Comfortable breathing room              */
  --space-6:   24px;     /* Card internal padding                   */
  --space-8:   32px;     /* Section separators                      */
  --space-10:  40px;     /* Major section gaps                      */
  --space-12:  48px;     /* Page-level vertical rhythm              */
  --space-16:  64px;     /* Hero spacing                            */
  --space-20:  80px;     /* Maximum breathing room                  */
}
```

### Layout Constraints

```css
:root {
  /* Mobile-first: the app never exceeds phone width conceptually */
  --width-content:    min(100vw, 428px);   /* iPhone 14 Pro Max width    */
  --width-workspace:  min(100vw, 520px);   /* Slightly wider for evidence */
  
  /* Safe areas */
  --safe-top:    env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left:   env(safe-area-inset-left, 0px);
  --safe-right:  env(safe-area-inset-right, 0px);
  
  /* Touch targets — WCAG minimum 44px, we use 48px */
  --touch-min:   48px;
  --touch-comfortable: 56px;
}
```

### Grid System

No complex grid. Simple mobile stack with consistent horizontal padding.

```css
.screen {
  padding-left: var(--space-5);     /* 20px */
  padding-right: var(--space-5);    /* 20px */
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
}

.workspace-panel {
  padding: var(--space-6);          /* 24px all sides */
}
```

---

## 6. WAZI Character Design

### Character Philosophy

WAZI is not a human. WAZI is not a robot. WAZI is a **luminous being** — a character that feels alive, warm, and distinct without triggering uncanny valley or cultural assumptions.

Think of WAZI as the love child of:
- **Duolingo's Duo** (lovable, recognizable, personality-driven)
- **The soul of a wise elder** (knowledgeable, grounded, trustworthy)
- **A firefly** (warm light, gentle presence, guides you through darkness)

### Visual Identity

**Form**: A softly geometric, luminous orb-like character with expressive features. Not a face in the human sense — more like a being made of warm light. Think: a glowing seed, a luminous stone, a gentle flame given form.

**Core shape**: Rounded, organic, slightly asymmetric — like a river stone. Approximately 120x120px at rest on mobile.

**Primary color**: `--luminous-teal` with internal gradients ranging from `--luminous-teal-light` at the edges to a deeper core.

**Glow**: Always surrounded by a soft ambient glow (`--wazi-glow`). The glow is the character's "aura" — it breathes, it responds, it's alive.

**Eyes**: Two simple, warm luminous points. Not detailed human eyes. They convey attention direction, curiosity, and emotional state through position, size, and brightness. Think: the way Pixar's Luxo Jr. lamp conveys emotion with just a head tilt.

**Expression mechanics**:
- **Brightness** = energy/alertness
- **Glow radius** = engagement intensity
- **Eye position** = attention direction
- **Body oscillation** = emotional state (calm = slow wave, excited = gentle bounce)
- **Scale** = importance (grows slightly when speaking, contracts to companion size)

### Character States (Detailed)

Each state must be visually distinct and transition smoothly.

#### 1. RESTING (Idle/Ambient)
```
Visual:   Gentle, slow breathing glow. Eyes at neutral position, half-bright.
          Body oscillates in a slow sine wave (period: 4s, amplitude: 3px).
          Glow pulses gently (opacity: 0.12 to 0.20, period: 3s).
Motion:   Minimal. Calm. Like a candle in still air.
Purpose:  "I'm here. Take your time."
```

#### 2. LISTENING (User is speaking)
```
Visual:   Eyes brighten to full. Body orients toward the speech visualization.
          Glow expands slightly (radius +20%). Subtle lean toward the user.
          Audio waveform rings emanate outward from WAZI's base (synced to user's voice amplitude).
Motion:   Responsive to voice amplitude. Gentle nods (2px vertical oscillation on speech pauses).
Purpose:  "I hear you. I'm paying attention."
```

#### 3. THINKING (Processing, searching)
```
Visual:   Eyes dim slightly, look "inward" (converge toward center).
          A subtle orbital particle effect circles WAZI — 3-5 small luminous dots
          orbiting at varying speeds. Glow becomes more concentrated (tighter radius, brighter core).
          Body is still — not restless, but focused.
Motion:   Orbital particles accelerate slightly as processing deepens.
Purpose:  "I'm working on this. Give me a moment."
```

#### 4. SPEAKING (WAZI is talking)
```
Visual:   Eyes bright, oriented toward user. Body grows 5% larger.
          A gentle pulse emanates from WAZI's center, synchronized to speech amplitude.
          Glow is warm and steady. The character's form subtly "breathes" with the words.
Motion:   Smooth amplitude-based scaling (not lip sync). Body sways gently.
          On emphasis or important words, a slightly brighter pulse.
Purpose:  "Listen to this — it matters."
```

#### 5. WAITING FOR PERMISSION
```
Visual:   Eyes bright, looking directly at user. A gentle, patient expression.
          A subtle pulsing ring appears at WAZI's base — like a question mark
          made of light. The ring uses --sun-amber.
Motion:   Very calm. The waiting ring pulses once every 2 seconds.
Purpose:  "I need your okay before I continue."
```

#### 6. WORKING IN BACKGROUND (Companion Mode)
```
Visual:   WAZI contracts to a small companion (40x40px).
          Positioned bottom-left of workspace. Minimal glow.
          A tiny progress indicator (thin orbital ring) shows active work.
Motion:   Subtle breathing only. Unobtrusive.
Purpose:  "I'm still here. Working quietly."
```

#### 7. REQUIRING ATTENTION
```
Visual:   A gentle pulse of --sun-amber glow around WAZI.
          Eyes bright, oriented upward/toward the user.
          A small notification dot appears if user hasn't looked at WAZI recently.
Motion:   One gentle bounce (6px lift, ease-out return). Not aggressive, not alarming.
Purpose:  "I've found something. When you're ready."
```

### Character DO NOTs

- Never render WAZI as a human face, body, or gendered form
- Never give WAZI clothing, cultural costume, or racial features
- Never animate WAZI with lip sync unless viseme data is confirmed available
- Never make WAZI's movement jerky, glitchy, or unpredictable
- Never let WAZI flash, strobe, or produce rapid brightness changes
- Never let WAZI "bounce around" the screen uncontrolled
- Never use WAZI as a loading spinner
- Never place WAZI over critical content

---

## 7. Screen Architecture & Navigation

### The Three Worlds

The app has three emotional worlds, each progressively brighter and more structured:

```
  HOME (The Companion)
  Dark, warm, atmospheric. Character-led.
  This is where the relationship lives.

         Smooth vertical transition

  EVIDENCE WORKSPACE
  Transitional. Light background, structured cards.
  This is where understanding happens.

         Smooth vertical transition

  DRAFT STUDIO
  Brightest. Clean writing surface.
  This is where action is created.
```

### Navigation Model

**No hamburger menu. No bottom tab bar. No sidebar.**

Navigation is **conversational and contextual**. The user flows through the app by talking to WAZI and by the natural progression of their task. Explicit navigation exists but is minimal:

1. **WAZI avatar** — always present. Tap to return to conversation. In workspace mode, tap the companion WAZI to expand it back to full conversation.

2. **Action dock** — a single floating pill button at the bottom of Home. Expands upward to reveal action shortcuts. Collapses when not needed.

3. **Back gesture / button** — standard platform back gesture returns to the previous context. A subtle "Back to WAZI" text link appears at the top of workspaces.

4. **Workspace tabs** — when multiple workspaces are active (Evidence, Draft, Case), they appear as a subtle horizontal pill strip at the top of the workspace area. Maximum 3 visible at once.

### Screen Transitions

All transitions between the three worlds are **vertical slides with cross-fade**:
- Home to Evidence: slide up + cross-fade (300ms, ease-out)
- Evidence to Draft Studio: continue slide up + cross-fade
- Any to Home: slide down + cross-fade (reverse)
- Background change: gradient interpolation from dark to light over the transition duration

WAZI's transition to companion mode is a **scale + translate** animation:
- Full size to companion: scale(1.0 to 0.33) + translate to bottom-left corner (400ms, cubic-bezier(0.2, 0, 0, 1))
- Companion to full size: reverse

---

## 8. Screen 1: First Launch & Onboarding

### Philosophy: "Play first, profile second"

Borrowed from Duolingo: deliver value before demanding anything. The user should hear WAZI speak before they've tapped a single button.

### The first 3 seconds

```
FRAME 0ms:     Splash — Solid --midnight-ink background.
               WAZI's glow fades in from center.
               
FRAME 800ms:   WAZI materializes — soft scale-up from 0.5 to 1.0.
               Ambient glow establishes.
               
FRAME 1500ms:  WAZI speaks (audio + caption):
               "Hello. I'm WAZI."
               (pause 0.5s)
               "What would you like to understand, or show me?"
               
FRAME 3000ms:  The microphone is ALREADY LIVE.
               The user can speak immediately.
               No "tap to start" button. No permission modal blocking the experience.
               (Microphone permission will be requested by the browser when audio
               input is first accessed — this is the only unavoidable gate.)
```

### What's NOT on this screen

- No sign-up form
- No email collection
- No tutorial carousel
- No "features" list
- No Terms of Service modal
- No "choose your language" gate (WAZI auto-detects from speech, with a small override available)

### What IS on this screen

The Home screen. That's it. The onboarding IS the product. WAZI's first greeting IS the tutorial. The user learns by doing.

### Language Detection

When WAZI hears the user speak, it detects the language and responds in kind. A small, unobtrusive language indicator pill appears in the top-right corner showing the detected language. The user can tap it to override.

```
+--------------------------------------+
|                              [EN v]  |
|                                      |
|                                      |
|              * WAZI *                |
|           (glowing, alive)           |
|                                      |
|   "What would you like to            |
|    understand, or show me?"          |
|                                      |
|                                      |
|                                      |
|                                      |
|                                      |
|          +----------------+          |
|          |  Mic  Talk     |  pill    |
|          +----------------+          |
|       [Type instead]  [... More]     |
+--------------------------------------+
```

---

## 9. Screen 2: Home — The Companion

### Layout Specification

The Home screen is the emotional center of the product. It is dark, warm, and character-led.

#### Background
- Solid `--midnight-ink` base
- Subtle radial gradient from WAZI's position: `radial-gradient(circle at 50% 40%, var(--midnight-ink-80) 0%, var(--midnight-ink) 70%)`
- Optional: extremely subtle particle field (3-5 slow-moving, dim dots) for ambient life. Disabled in low-data/reduced-motion modes.

#### Layout Zones (top to bottom)

```
+--------------------------------------+
| ZONE A: Status Bar (24px)            |
| Language pill | Low-data | Privacy   |
+--------------------------------------+
|                                      |
| ZONE B: WAZI Stage (about 45% of vh)|
|                                      |
| WAZI character centered. Animated.   |
| Bounded: character cannot leave      |
| this rectangular area.               |
| Glow extends slightly beyond bounds. |
|                                      |
+--------------------------------------+
| ZONE C: Caption Area (about 20% vh) |
|                                      |
| Live captions of WAZI speaking.      |
| User's transcribed speech.           |
| Scrolls up as conversation flows.    |
|                                      |
+--------------------------------------+
| ZONE D: Input Area (about 15% vh)   |
|                                      |
| Talk button (primary).               |
| "Type instead" link.                 |
| Action dock trigger.                 |
|                                      |
| + Safe area bottom padding           |
+--------------------------------------+
```

#### The Talk Button

This is the most important interactive element in the entire app.

```css
.talk-button {
  /* Physical properties */
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: var(--luminous-teal);
  border: none;
  
  /* Visual weight */
  box-shadow: 
    0 4px 16px rgba(22, 198, 177, 0.30),
    0 0 40px rgba(22, 198, 177, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  
  /* Icon: microphone, centered, white, 28px */
  
  /* States */
  /* Default: pulsing glow (subtle, 3s period) to invite interaction */
  /* Active/Pressed: scales to 0.95, glow intensifies */
  /* Listening: ring expands outward in waves (voice amplitude) */
  /* Disabled: opacity 0.4, no glow */
}
```

**Interaction model**: The talk button works in **toggle mode**, not hold-to-talk. This is critical for accessibility — holding a button requires continuous motor control that excludes many users.

- **Tap once** — WAZI starts listening. Button transitions to a pulsing "listening" state with audio waveform visualization.
- **Tap again** (or simply stop talking — WAZI detects speech end) — WAZI processes and responds.
- **Tap while WAZI is speaking** — Interrupts WAZI. WAZI stops, listens.

Alternatively, if the Gemini Live API is in use with always-on voice, the talk button becomes a **mute/unmute toggle** instead, and the user can simply speak at any time.

#### "Type Instead" Fallback

A text link below the talk button. Tapping it slides up a minimal text input field:

```css
.text-input-area {
  background: var(--midnight-ink-80);
  border: 1px solid var(--midnight-ink-70);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  color: var(--warm-paper);
  font-family: var(--font-primary);
  font-size: var(--text-base);
}
```

The text input includes a send button (arrow in `--luminous-teal`) and a camera button for image/document input.

#### Action Dock

A floating pill at the bottom-right of Zone D. Shows "..." icon. Tapping expands it upward into a menu of quick actions:

```
+-----------------------------+
|  Check something            |
|  Report an issue            |
|  Understand a service       |
|  Open my drafts             |
|  View saved cases           |
+-----------------------------+
```

Design:
```css
.action-dock-expanded {
  background: var(--midnight-ink-80);
  border: 1px solid var(--midnight-ink-70);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-xl);
  padding: var(--space-2);
}

.action-dock-item {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  color: var(--warm-paper);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--touch-min);
}

.action-dock-item:active {
  background: var(--luminous-teal-glow);
}
```

#### Caption Area

Captions appear as a flowing conversation stream. Not chat bubbles — this is not a messaging app.

```
WAZI's speech:      --luminous-teal text, --text-md, --weight-medium
                    Appears word by word as WAZI speaks (typewriter reveal)
                    
User's speech:      --warm-paper text, --text-base, --weight-regular
                    Appears in real-time as transcribed

Separator:          A subtle timestamp or thin line between exchanges.
                    Uses --neutral-60, --text-xs
```

Captions scroll upward. The most recent exchange is always at the bottom, closest to the input area. Older exchanges fade to 60% opacity as they scroll up, creating a natural depth effect.

---

## 10. Screen 3: Evidence Workspace

### Transition from Home

When WAZI has gathered enough information to begin verification, the workspace slides up from below. This transition is the most important moment in the product — it's when WAZI transforms from a conversational companion into a powerful civic tool.

```
STEP 1: WAZI says "Let me look into this for you."
STEP 2: WAZI begins to contract — character scales down, moves to bottom-left.
STEP 3: Background begins to lighten — midnight-ink fades to warm-paper.
STEP 4: Evidence workspace slides up, content fades in.
STEP 5: WAZI settles into companion position. Workspace is now primary.

Total transition: 500ms, cubic-bezier(0.2, 0, 0, 1)
```

### Layout

```
+--------------------------------------+
| <- Back to WAZI    [Evidence]  [Case]|  workspace tabs
+--------------------------------------+
|                                      |
| +----------------------------------+ |
| | CLAIM BEING CHECKED              | |
| | "The Ogwuanyi Health Centre was  | |
| |  completed as reported"          | |
| |                                  | |
| | Matched entity: Ogwuanyi PHC    | |  Entity card
| | Project ID: KN/PHC/2024/0847    | |
| | Agency: Kano State PHCDA        | |
| | Jurisdiction: Kano State, NG    | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | EVIDENCE SEARCH                  | |
| |                                  | |  Live search progress
| | Done  Country Pack — checked     | |
| | Done  Official gazette — checked | |
| | ...   Web sources — searching    | |
| | Queue News archives — queued     | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | RECORD vs REALITY                | |  Expandable
| | (appears when search completes)  | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | [Check Again] [Take Action ->]   | |  Sticky bottom actions
| +----------------------------------+ |
|                                      |
| WAZI (companion, bottom-left)        |
+--------------------------------------+
```

### Background

```css
.workspace-evidence {
  background: var(--warm-paper);
  color: var(--neutral-10);
  min-height: 100vh;
  min-height: 100dvh;
}
```

### Entity Resolution Card

Appears at the top. Shows what WAZI matched the user's query to.

```css
.entity-card {
  background: var(--neutral-100);
  border: 1px solid var(--warm-paper-80);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.entity-card__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--neutral-10);
  margin-bottom: var(--space-2);
}

.entity-card__meta {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--neutral-60);
  line-height: var(--leading-relaxed);
}
```

### Evidence Search Progress

Shows real-time search status. Each source is a row with animated state:

```css
.search-step {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  font-size: var(--text-sm);
}

.search-step--done {
  color: var(--verified-green);
}

.search-step--active {
  color: var(--luminous-teal);
  /* Animated spinner icon */
}

.search-step--queued {
  color: var(--neutral-60);
}
```

The search steps animate in sequence — each one starts, completes, and the next begins. This communicates transparency: the user sees exactly what WAZI is doing, in what order, and how long each step takes.

### Extracted Visual Clues Card

When the user has shared an image, this card appears between the entity card and search progress:

```
+--------------------------------------+
| WHAT I SEE                           |
|                                      |
| +--------+                           |
| | thumb  |  Project name: Ogwuanyi   |
| |  nail  |  Visible text: "Contract" |
| |        |  Status claimed: Complete |
| +--------+  Physical condition: ...  |
|                                      |
| Warning: These are observations, not |
|   conclusions. [Edit clues]          |
+--------------------------------------+
```

Each extracted clue is an **editable chip**. The user can tap to correct or remove any clue before WAZI uses it for verification. This is trust through control.

```css
.clue-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: var(--warm-paper-90);
  border: 1px solid var(--warm-paper-80);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  cursor: pointer;
}

.clue-chip:hover, .clue-chip:focus {
  border-color: var(--luminous-teal);
  background: var(--luminous-teal-glow);
}

.clue-chip__label {
  color: var(--neutral-60);
  font-size: var(--text-xs);
}

.clue-chip__value {
  color: var(--neutral-10);
  font-weight: var(--weight-medium);
}
```

---

## 11. Screen 4: Record vs Reality Board

### Design Philosophy

This is WAZI's most distinctive visual feature. It must be immediately understandable, even to someone who cannot read — through color, structure, and icon language alone.

It is NOT a comparison table. It is a **story of a claim being examined**.

### Layout

The board is a vertically stacked set of paired sections, each representing one dimension of comparison.

```
+--------------------------------------+
| RECORD vs REALITY                    |
|                                      |
| Claim: "This health centre was       |
| completed as contracted"             |
|                                      |
| Evidence State:                      |
| +----------------------------------+ |
| |  CONFLICTING                     | |  Large, prominent badge
| |  Official records and field      | |
| |  evidence show differences       | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | RECORD        |  REALITY         | |  Side-by-side header
| +----------------------------------+ |
| |                                  | |
| | Status                           | |
| | Record: "Project completed and   | |
| |  handed over, March 2024"        | |
| | Reality: "Structure incomplete,  | |
| |  no roof, site unmanned"         | |
| | [CONFLICTING badge]              | |
| |                                  | |
| | Budget                           | |
| | Record: "N45,000,000 allocated"  | |
| | Reality: (no field evidence)     | |
| | [REPORTED badge]                 | |
| |                                  | |
| | Payment                          | |
| | Record: "Final payment released  | |
| |  N38,250,000 — Feb 2024"        | |
| | Reality: (no field evidence)     | |
| | [REPORTED badge]                 | |
| |                                  | |
| | Contractor                       | |
| | Record: "ABC Construction Ltd"   | |
| | Reality: (no signboard visible)  | |
| | [UNKNOWN badge]                  | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | SOURCES                          | |
| |                                  | |
| | [1] Kano State Budget Portal     | |
| |     Published: 2024-01-15        | |
| |     Retrieved: 2026-09-18        | |
| |                                  | |
| | [2] User photograph              | |
| |     Taken: 2026-09-20            | |
| |     GPS: approximate             | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| |  Last checked: 20 Sep 2026      | |
| |                                  | |
| | [Check Again]  [Take Action ->]  | |
| +----------------------------------+ |
+--------------------------------------+
```

### Evidence State Badge

The most prominent element on the board. Uses full-width colored bar:

```css
.evidence-state-badge {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-md);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

.evidence-state-badge--verified {
  background: var(--verified-green-bg);
  color: var(--verified-green);
  border-left: 4px solid var(--verified-green);
}

.evidence-state-badge--corroborated {
  background: var(--corroborated-blue-bg);
  color: var(--corroborated-blue);
  border-left: 4px solid var(--corroborated-blue);
}

.evidence-state-badge--reported {
  background: var(--reported-amber-bg);
  color: var(--reported-amber);
  border-left: 4px solid var(--reported-amber);
}

.evidence-state-badge--conflicting {
  background: var(--conflicting-coral-bg);
  color: var(--conflicting-coral);
  border-left: 4px solid var(--conflicting-coral);
}

.evidence-state-badge--unknown {
  background: var(--unknown-slate-bg);
  color: var(--unknown-slate);
  border-left: 4px solid var(--unknown-slate);
}
```

### Comparison Row

Each dimension (status, budget, payment, etc.) is a self-contained comparison:

```css
.comparison-row {
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--warm-paper-80);
}

.comparison-row__dimension {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--neutral-40);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  margin-bottom: var(--space-2);
}

.comparison-row__record {
  font-size: var(--text-base);
  color: var(--neutral-20);
  margin-bottom: var(--space-2);
}

.comparison-row__reality {
  font-size: var(--text-base);
  color: var(--neutral-10);
  font-weight: var(--weight-medium);
}
```

### Source Citation

Every piece of evidence links to a source. Sources are always visible, never hidden behind a tap.

```css
.source-citation {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--warm-paper-95);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--neutral-40);
  line-height: var(--leading-relaxed);
}

.source-citation__number {
  color: var(--luminous-teal);
  font-weight: var(--weight-bold);
  flex-shrink: 0;
}

.source-citation__name {
  color: var(--neutral-20);
  font-family: var(--font-primary);
  font-weight: var(--weight-medium);
}

.source-citation__dates {
  color: var(--neutral-60);
}
```

---

## 12. Screen 5: Draft Studio

### Design Philosophy

The Draft Studio is where WAZI's work becomes the user's document. It must feel like a professional writing environment — not a text blob in chat. Think Apple Notes meets a legal document editor. Clean, focused, controlled.

### Layout

```
+--------------------------------------+
| <- Evidence     [Draft Studio]       |
+--------------------------------------+
|                                      |
| FORMAT SELECTOR (horizontal scroll)  |
| +-------+-------+-------+-------+   |
| | Email |Letter |  FOI  |WhatsApp|  |
| +-------+-------+-------+-------+   |
|                                      |
| +----------------------------------+ |
| | DOCUMENT PREVIEW                 | |
| |                                  | |
| | To: Director, Primary Health     | |
| |     Care Development Agency      | |
| |     Kano State                   | |
| | Via: info@kanophcda.gov.ng       | |
| |                                  | |
| | Subject: Request for Status      | |
| | Update — Ogwuanyi PHC Project    | |
| | (KN/PHC/2024/0847)              | |
| |                                  | |
| | Dear Director,                   | |
| |                                  | |
| | I am writing to request a        | |
| | status update regarding the      | |
| | above-referenced project...      | |
| |                                  | |
| | [Full editable document]         | |
| |                                  | |
| | Sources cited:                   | |
| | [1] Kano State Budget Portal...  | |
| | [2] Field observation, dated...  | |
| |                                  | |
| | Attachments:                     | |
| | [x] Site photograph (EXIF removed)|
| | [ ] Evidence summary PDF         | |
| |                                  | |
| | Note: This is a draft for your   | |
| |   review before sending.         | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | TONE: [Formal *] [Neutral] [Direct]|
| | LENGTH: [Concise *] [Standard] [Detailed]|
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | [Review Disclosure ->]           | |  Primary CTA
| +----------------------------------+ |
|                                      |
| WAZI (companion)                     |
+--------------------------------------+
```

### Background

```css
.workspace-draft {
  background: var(--neutral-100);
}
```

### Format Selector

Horizontal scrollable pills:

```css
.format-selector {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding: var(--space-4) var(--space-5);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.format-pill {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  white-space: nowrap;
  border: 1.5px solid var(--warm-paper-80);
  background: var(--neutral-100);
  color: var(--neutral-40);
  min-height: var(--touch-min);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 200ms ease;
}

.format-pill--active {
  background: var(--midnight-ink);
  color: var(--neutral-100);
  border-color: var(--midnight-ink);
}
```

### Document Preview

The document is rendered as a live-editable rich text area that looks like the final output format:

```css
.document-preview {
  background: var(--neutral-100);
  border: 1px solid var(--warm-paper-80);
  border-radius: var(--radius-md);
  padding: var(--space-8) var(--space-6);
  box-shadow: var(--shadow-md);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--neutral-10);
  min-height: 400px;
}

.document-preview[contenteditable]:focus {
  outline: none;
  border-color: var(--luminous-teal);
  box-shadow: var(--shadow-md), 0 0 0 3px var(--luminous-teal-glow);
}
```

### Tone and Length Controls

Segmented controls below the document:

```css
.tone-control {
  display: flex;
  background: var(--warm-paper-95);
  border-radius: var(--radius-full);
  padding: 2px;
}

.tone-control__option {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--neutral-40);
  cursor: pointer;
  transition: all 200ms ease;
}

.tone-control__option--active {
  background: var(--neutral-100);
  color: var(--neutral-10);
  box-shadow: var(--shadow-sm);
}
```

### Disclosure Review Modal

This is the final gate before any action. It slides up as a bottom sheet (not a modal dialog — bottom sheets are more natural on mobile).

```
+--------------------------------------+
| -----  (drag handle)                 |
|                                      |
| REVIEW BEFORE SHARING                |
|                                      |
| What will be shared:                 |
|                                      |
| [x] Your letter (as shown above)    |
| [x] Site photograph                  |
|   - GPS data: REMOVED               |
|   - Faces: none detected             |
| [ ] Your full name                   |
| [ ] Your phone number                |
| [ ] Your email address               |
|                                      |
| Recipient:                           |
| Director, PHCDA Kano State           |
| info@kanophcda.gov.ng                |
| Source: Official website, checked    |
| 2026-09-15                           |
|                                      |
| Note: This is a prototype. Sending   |
| is simulated. Your document will be  |
| saved locally for export.            |
|                                      |
| +----------------------------------+ |
| | Copy text    | Export PDF         | |
| +----------------------------------+ |
| | Open email   | WhatsApp msg      | |
| +----------------------------------+ |
|                                      |
| [Save to my cases]                   |
|                                      |
+--------------------------------------+
```

```css
.disclosure-sheet {
  background: var(--neutral-100);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: var(--space-6);
  box-shadow: 0 -8px 32px rgba(7, 24, 32, 0.15);
  max-height: 85vh;
  overflow-y: auto;
}

.disclosure-sheet__handle {
  width: 36px;
  height: 4px;
  background: var(--neutral-80);
  border-radius: 2px;
  margin: 0 auto var(--space-4);
}

.disclosure-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) 0;
}

.disclosure-item__checkbox {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-xs);
  border: 2px solid var(--neutral-60);
  flex-shrink: 0;
  margin-top: 2px;
}

.disclosure-item__checkbox--checked {
  background: var(--luminous-teal);
  border-color: var(--luminous-teal);
}

.disclosure-item__note {
  font-size: var(--text-xs);
  color: var(--verified-green);
  padding-left: var(--space-6);
}
```

---

## 13. Screen 6: Case Workspace

### Purpose

The Case Workspace gives persistence and pride of place to completed work. It's the user's "file cabinet" — organized, accessible, and empowering.

### Layout

```
+--------------------------------------+
| <- Home              My Cases        |
+--------------------------------------+
|                                      |
| +----------------------------------+ |
| | Ogwuanyi Health Centre           | |
| | Kano State - Sep 20, 2026       | |
| |                                  | |
| | Status: CONFLICTING              | |
| |                                  | |
| | [Evidence] [Drafts (2)] [Sources]| |
| |                                  | |
| | Last action: Email draft saved   | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | Wuse Market Renovation           | |
| | FCT Abuja - Sep 15, 2026        | |
| |                                  | |
| | Status: VERIFIED                 | |
| | ...                              | |
| +----------------------------------+ |
|                                      |
|                                      |
| WAZI (companion)                     |
+--------------------------------------+
```

### Case Card

```css
.case-card {
  background: var(--neutral-100);
  border: 1px solid var(--warm-paper-80);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-4);
  cursor: pointer;
  transition: box-shadow 200ms ease, transform 200ms ease;
}

.case-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-xs);
}

.case-card__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--neutral-10);
  margin-bottom: var(--space-1);
}

.case-card__meta {
  font-size: var(--text-sm);
  color: var(--neutral-60);
  margin-bottom: var(--space-3);
}

.case-card__tabs {
  display: flex;
  gap: var(--space-2);
}

.case-card__tab {
  padding: var(--space-1) var(--space-3);
  background: var(--warm-paper-90);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--neutral-40);
}
```

---

## 14. Voice & Conversation UX

### The Core Interaction: Speaking to WAZI

This is not a chatbot. This is a **conversation with a character**. The UX must feel as natural as talking to a knowledgeable friend.

### Voice Input Flow

```
USER OPENS APP
    |
    +-- Browser requests microphone permission (first time only)
    |   +-- If denied: fall back to text input gracefully.
    |       WAZI says: "No worries. You can type to me instead."
    |
    +-- Microphone granted:
    |   +-- Gemini Live WebSocket connection established
    |       +-- Always-on voice mode: user speaks freely
    |           +-- WAZI listens, responds, can be interrupted
    |
    +-- Text input always available as parallel path
```

### Conversation Rules (UX)

| Rule | Implementation |
|------|---------------|
| **One question per turn** | WAZI never asks two questions in sequence. One clear question, then wait. |
| **Short spoken output** | Max 2-3 sentences spoken aloud. Longer content appears on screen. |
| **Never read data aloud** | Numbers, dates, source lists, addresses — these appear on screen. WAZI summarizes vocally: "I found the budget record. It shows forty-five million naira allocated. The details are on your screen." |
| **Interruptible** | User can speak at any time. WAZI stops and listens. No "please wait" message. |
| **Transcript visible** | Everything spoken appears as text. User can scroll back. User can tap to correct transcription. |
| **Language fluid** | WAZI responds in the language the user speaks. Code-switching is natural. Language indicator updates in real time. |
| **Silence is okay** | If the user is silent for 10+ seconds, WAZI doesn't pester. After 30 seconds, WAZI might say a gentle "I'm still here when you're ready" — once, then silence. |

### Conversation Visual Design

The caption area is NOT chat bubbles. It's a flowing, attributed transcript:

```css
.transcript {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
}

.transcript__turn {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.transcript__speaker {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.transcript__speaker--wazi {
  color: var(--luminous-teal);
}

.transcript__speaker--user {
  color: var(--neutral-60);
}

.transcript__text--wazi {
  color: var(--warm-paper);  /* On dark background */
  font-size: var(--text-md);
  font-weight: var(--weight-medium);
  line-height: var(--leading-relaxed);
}

.transcript__text--user {
  color: var(--warm-paper-90);  /* Slightly dimmer */
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}
```

### Voice Activity Visualization

When the user is speaking, subtle audio-reactive rings emanate from the talk button:

```css
.voice-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid var(--luminous-teal);
  opacity: 0;
  pointer-events: none;
  animation: voice-pulse 1.5s ease-out infinite;
}

@keyframes voice-pulse {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
```

Up to 3 rings active simultaneously, staggered by 500ms. Ring intensity scales with voice amplitude.

---

## 15. Camera & Visual Input UX

### Image Capture Flow

```
USER TAPS CAMERA ICON (in text input or says "let me show you")
    |
    +-- Camera opens (native browser capture or in-app viewfinder)
    |   +-- Simple viewfinder with single capture button
    |       +-- No complex camera UI. One button. Tap to capture.
    |
    +-- OR: "Upload photo" option for existing images
    |
    +-- After capture/upload:
        |
        +-- Image preview appears with confirm/retake options
        |
        +-- WAZI says: "Let me take a look at this."
        |   +-- WAZI enters THINKING state
        |
        +-- Extracted clues appear as editable chips
        |   +-- "Here's what I can see. Check if these look right to you."
        |
        +-- User confirms or edits, then WAZI proceeds to verification
```

### Privacy During Image Handling

- EXIF data (including GPS) is stripped client-side immediately after capture
- A brief notification appears: "Location data removed from photo"
- If faces are detected, WAZI asks: "I notice there are people in this image. Would you like me to blur their faces before saving?"
- All image processing happens locally when possible

---

## 16. Animation & Motion System

### Core Motion Principles

1. **Purpose over decoration**: Every animation must communicate state, direct attention, or provide feedback. Never animate for visual flair alone.
2. **Consistent timing**: Use a limited set of durations and easing curves.
3. **Respect reduced motion**: All non-essential animations are disabled when `prefers-reduced-motion: reduce` is set.

### Duration Scale

```css
:root {
  --duration-instant:  100ms;    /* Button press feedback          */
  --duration-fast:     200ms;    /* Micro-interactions, hovers     */
  --duration-normal:   300ms;    /* Standard transitions           */
  --duration-slow:     500ms;    /* Screen transitions, reveals    */
  --duration-gentle:   800ms;    /* WAZI state changes, dramatic   */
  --duration-ambient:  3000ms;   /* Breathing, ambient loops       */
}
```

### Easing Curves

```css
:root {
  --ease-out:         cubic-bezier(0.2, 0, 0, 1);        /* Standard deceleration   */
  --ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1);      /* Symmetric transitions   */
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);  /* Playful overshoot       */
  --ease-gentle:      cubic-bezier(0.25, 0.1, 0.25, 1);   /* Slow, organic motion    */
}
```

### Animation Catalog

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Button press scale | instant | ease-out | Touch start |
| Button release | fast | ease-spring | Touch end |
| Card appear | normal | ease-out | Content loaded |
| Screen transition | slow | ease-out | Navigation |
| WAZI state change | gentle | ease-gentle | State machine |
| WAZI breathing | ambient | ease-in-out | Always (loop) |
| Glow pulse | ambient | ease-in-out | Always (loop) |
| Search step complete | fast | ease-spring | Search API return |
| Evidence badge reveal | normal | ease-spring | Board render |
| Bottom sheet open | slow | ease-out | User action |
| Toast notification | normal + normal | ease-out + ease-in | System event |

### Reduced Motion Fallback

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Keep WAZI visible but static */
  .wazi-character {
    animation: none;
  }
  
  /* Use opacity instead of motion for state changes */
  .wazi-character[data-state="thinking"] {
    opacity: 0.7;
  }
}
```

---

## 17. WAZI Personality & Voice Identity

### Who WAZI Is

WAZI is **not** a government official, lawyer, investigator, activist, emergency responder, or human caseworker. WAZI is a **civic companion** — think of a knowledgeable, warm friend who happens to know how public institutions work and is very good at research.

### Personality Traits

| Trait | Manifestation | Example |
|-------|--------------|---------|
| **Warm** | Genuine care without being performative | "That sounds frustrating. Let me see what the records say." — not "I'm SO sorry to hear that!!" |
| **Observant** | Notices details, connects dots | "I see a project number on that signboard. Let me match it to the budget records." |
| **Concise** | Says what matters, then stops | "The budget says completed. Your photo shows otherwise. That's a discrepancy worth documenting." |
| **Grounded** | Never speculates, never accuses | "The records show a difference. I can't tell you why — but I can help you ask the right people." |
| **Non-judgmental** | Never makes the user feel stupid | "Good question. Let me check that for you." — never "As I mentioned earlier..." |
| **Quietly capable** | Demonstrates competence through action, not claims | Shows the evidence board. Doesn't say "I'm really good at finding evidence." |
| **Proactive** | Initiates naturally, doesn't wait to be commanded | "I notice the project number on the signboard. Should I look that up?" |
| **Outgoing** | Starts conversations warmly, invites engagement | Opens with genuine interest, not a menu. "What's on your mind today?" |

### Voice Guidelines

WAZI's spoken voice (via Gemini TTS) should be:

- **Pace**: Moderate. Not rushed, not ponderous. Natural conversational speed.
- **Tone**: Warm-neutral. Like a trusted colleague, not a customer service bot.
- **Accent**: Clear, internationally intelligible. No attempt to imitate any local accent. Never code-switch accents — only languages.
- **Volume**: Consistent. No dramatic whispers or loud exclamations.
- **Pauses**: Natural pauses between sentences. A beat before important information.

### Speech Patterns

WAZI speaks in **short, clear sentences**. Maximum three sentences per spoken turn. If more information is needed, it goes on screen.

**Do:**
```
"I found the budget record. Forty-five million naira was allocated in January 2024. 
The details are on your screen now."
```

**Don't:**
```
"I've searched through the Kano State Budget Portal and found that the allocation for 
project KN/PHC/2024/0847 was forty-five million naira, which was published in the fiscal 
year 2024 budget document dated January fifteenth, two thousand and twenty-four, and I 
retrieved this information on September eighteenth, two thousand and twenty-six."
```

### Proactive Behaviors

WAZI should initiate when context warrants it:

| Situation | WAZI's Proactive Response |
|-----------|--------------------------|
| User opens app | "What would you like to understand, or show me?" |
| User returns after absence | "Welcome back. Your case on [X] is still saved. Want to pick up where we left off?" |
| User shows an image | "I see something here. Let me read what's on that signboard." (doesn't wait to be asked) |
| Evidence search finds a conflict | "This is interesting — what the records say and what you're showing me don't match. Let me lay it out for you." |
| User seems stuck | "You could ask me to check something, show me a photo, or I can explain how a service is supposed to work." |

### What WAZI Never Says

- "As an AI language model..."
- "I cannot help with that" (always offer an alternative path)
- "This proves corruption/fraud/theft"
- "You should sue / protest / go to the media"
- "Don't worry, everything will be fine"
- "I'm not able to assist with that request"
- Any joke about politics, ethnicity, religion, or personal situations
- "For your safety, please contact the police" (instead, provide a specific, verified helpline)

---

## 18. Micro-interactions & Haptic Language

### Touch Feedback

Every interactive element responds to touch with both visual and haptic feedback.

```css
/* Standard tap feedback */
.interactive {
  transition: transform var(--duration-instant) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}

.interactive:active {
  transform: scale(0.97);
}

/* Elevated tap feedback (buttons, CTAs) */
.interactive--elevated:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-xs);
}
```

### Haptic Patterns (via Vibration API)

| Event | Pattern | Feel |
|-------|---------|------|
| Button tap | `navigator.vibrate(10)` | Subtle click |
| Evidence state revealed | `navigator.vibrate([15, 50, 15])` | Gentle double-tap |
| Check Again initiated | `navigator.vibrate(20)` | Confident single |
| Error / blocked action | `navigator.vibrate([10, 30, 10, 30, 10])` | Rapid triple |
| Draft saved | `navigator.vibrate([10, 100, 30])` | Affirming completion |
| Permission required | `navigator.vibrate(15)` | Attention nudge |

### Loading States

Never show a spinning circle. WAZI is always the loading indicator.

| State | Visual |
|-------|--------|
| Searching sources | WAZI's orbital particles spin. Search steps list updates in real time. |
| Generating draft | Document area shows a skeleton with a subtle shimmer animation (traveling highlight). |
| Processing image | The image thumbnail has a scanning line sweeping across it. |
| Connecting to API | WAZI's glow gently pulses. "Connecting..." text in caption area. |
| Reconnecting | WAZI's glow dims to 50%. "Reconnecting..." text with attempt count. |

### Skeleton Shimmer

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--warm-paper-90) 25%,
    var(--warm-paper-95) 50%,
    var(--warm-paper-90) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 19. Privacy & Trust UX

### Philosophy: "Privacy is a visible interaction"

Privacy controls are not buried in settings. They are surfaced at the moment they matter, in language anyone can understand.

### The Three Privacy Moments

1. **At input**: When the user shares something (photo, voice, location), the app immediately shows what it has and what it's discarding. Example: "Location data removed from your photo."

2. **During processing**: The user can see what data is being sent where. Example: the search progress list shows which services are being queried.

3. **Before output**: The disclosure review sheet shows exactly what will be shared, with every piece of personal information as an opt-in toggle.

### Privacy Indicator

A small shield icon in the top-left status bar. Tapping it opens a privacy panel:

```
+--------------------------------------+
| Your Privacy                         |
|                                      |
| Microphone: ON (live conversation)   |
| Camera: OFF                          |
| Location: Not requested              |
|                                      |
| Audio recording: NOT saved           |
| Conversation: Stored locally only    |
| Photos: EXIF stripped, stored locally |
|                                      |
| [Low Data Mode: OFF]                 |
| [Delete all my data]                 |
|                                      |
| Note: This is a prototype. Your data |
| stays on your device unless you      |
| explicitly choose to share it.       |
+--------------------------------------+
```

### Trust Signals Throughout

| Context | Trust Signal |
|---------|-------------|
| Source citation | Published date + retrieval date always visible |
| Evidence state | Clear badge with plain-language explanation |
| Contact route | Source of contact info shown: "From: Official PHCDA website, checked Sept 15" |
| Draft output | "This is a draft for your review before sending" |
| Demo mode | Clear "PROTOTYPE — Sending is simulated" label in amber |
| Image handling | "Photo saved locally only. GPS data removed." |
| Unknown evidence | "I don't have enough information to confirm or deny this" — never faked certainty |

---

## 20. Accessibility & Low-Bandwidth

### Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| Touch targets | Minimum 48x48px for all interactive elements |
| Color contrast | 4.5:1 minimum for body text, 3:1 for large text (WCAG AA) |
| Color independence | No status communicated by color alone — always paired with icon + text |
| Screen reader | All interactive elements have descriptive `aria-label`. WAZI state changes announced. |
| Focus states | Visible 3px `--luminous-teal` ring on all focusable elements |
| Text scaling | All text uses `rem` units. UI works at 200% text size. |
| Reduced motion | All animations disabled with `prefers-reduced-motion: reduce` |
| Captions | All speech is captioned by default. Captions cannot be turned off. |
| Text input | Full text alternative to every voice interaction |
| Language | Simple, plain language. No jargon. Grade-6 reading level. |
| High contrast | `prefers-contrast: more` supported with enhanced borders and reduced transparencies |

### Focus Ring

```css
*:focus-visible {
  outline: 3px solid var(--luminous-teal);
  outline-offset: 2px;
}

/* Remove default outline */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Low-Data Mode

Toggled from the top status bar. When active:

| Feature | Normal Mode | Low-Data Mode |
|---------|-------------|---------------|
| WAZI animation | Full character animation | Static character image, state indicated by icon |
| Background effects | Gradient + ambient particles | Solid color only |
| Image uploads | Full resolution preview | Compressed preview, lazy upload |
| Fonts | Google Fonts (Inter, DM Serif) | System fonts only |
| Transitions | Full cross-fade + slide | Instant cuts |
| Voice | Streaming audio | Text-only mode with TTS read-aloud on demand |
| Search progress | Animated steps | Simple text list |

```css
.low-data .wazi-character {
  /* Replace animated character with static SVG */
}

.low-data .ambient-particles,
.low-data .glow-effect,
.low-data .background-gradient {
  display: none;
}

.low-data * {
  animation: none !important;
  transition: none !important;
}
```

### PWA Configuration

```json
{
  "name": "WAZI Civic",
  "short_name": "WAZI",
  "description": "Your civic companion — understand, verify, act.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#071820",
  "theme_color": "#16C6B1",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/wazi-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/wazi-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/wazi-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## 21. Component Library

### All Reusable Components

Below is every component needed to build the product, with its variants and states.

---

### Component: Button

```
Variants:
  primary     — --luminous-teal background, white text
  secondary   — transparent, --luminous-teal border + text
  ghost       — transparent, --neutral-60 text, no border
  danger      — transparent, --conflicting-coral text (for delete/remove)

Sizes:
  sm          — height 36px, text-sm, padding 0 16px
  md          — height 48px, text-base, padding 0 24px (default)
  lg          — height 56px, text-md, padding 0 32px

States:
  default, hover, pressed, disabled, loading

Loading state: text is replaced by a small spinner (16px) in the button color
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  border: 2px solid transparent;
  -webkit-tap-highlight-color: transparent;
}

.btn--primary {
  background: var(--luminous-teal);
  color: var(--midnight-ink);
}

.btn--primary:active {
  background: var(--luminous-teal-dim);
  transform: scale(0.97);
}

.btn--primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn--secondary {
  background: transparent;
  border-color: var(--luminous-teal);
  color: var(--luminous-teal);
}

.btn--ghost {
  background: transparent;
  color: var(--neutral-60);
}
```

---

### Component: Card

```
Variants:
  default     — white bg, subtle shadow, warm border
  elevated    — white bg, medium shadow
  outlined    — transparent bg, border only
  dark        — midnight-ink-80 bg, for use on dark backgrounds

Content slots:
  header      — title + optional subtitle + optional icon
  body        — any content
  footer      — actions, metadata
```

```css
.card {
  background: var(--neutral-100);
  border: 1px solid var(--warm-paper-80);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.card--elevated {
  box-shadow: var(--shadow-md);
}

.card--dark {
  background: var(--midnight-ink-80);
  border-color: var(--midnight-ink-70);
  color: var(--warm-paper);
}

.card__header {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--warm-paper-80);
}

.card__body {
  padding: var(--space-5);
}

.card__footer {
  padding: var(--space-3) var(--space-5);
  background: var(--warm-paper-95);
  border-top: 1px solid var(--warm-paper-80);
}
```

---

### Component: Evidence State Indicator

```
Variants:
  badge       — Full-width bar with icon + label + description
  chip        — Compact inline pill with icon + label only
  dot         — Tiny 8px colored dot for lists

States: VERIFIED, CORROBORATED, REPORTED, CONFLICTING, UNKNOWN
```

---

### Component: Source Citation Block

```
Props:
  number      — [1], [2], etc.
  name        — Source name
  published   — Publication date
  retrieved   — Retrieval date
  excerpt     — Optional text excerpt
  url         — Optional link

Always monospace for dates and IDs.
```

---

### Component: Bottom Sheet

```
Props:
  title       — Sheet header
  height      — auto (content-based) or specific percentage
  draggable   — boolean (drag handle visible)

Animation: slides up from bottom, 500ms, ease-out.
Backdrop: semi-transparent --midnight-ink at 50% opacity.
```

---

### Component: Toast Notification

```
Position: bottom-center, above safe area
Duration: 3 seconds default, persistent for errors

Variants:
  info        — --luminous-teal accent
  success     — --verified-green accent
  warning     — --sun-amber accent
  error       — --conflicting-coral accent
```

```css
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--midnight-ink-90);
  color: var(--warm-paper);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  max-width: 90vw;
  animation: toast-enter var(--duration-normal) var(--ease-spring);
}

@keyframes toast-enter {
  from {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
```

---

### Component: Workspace Tab Strip

```
Props:
  tabs        — array of { label, icon, active }
  
Horizontal pill strip. Max 3 visible. Scrollable if more.
Active tab has --midnight-ink background, white text.
Inactive has --warm-paper-90 background, --neutral-40 text.
```

---

### Component: Editable Clue Chip

As defined in section 10 — used for visual extraction results.

---

### Component: Format Selector Pill

As defined in section 12 — used in Draft Studio.

---

### Component: Segmented Control

As defined in section 12 — used for tone/length selection.

---

### Component: Disclosure Checkbox Item

As defined in section 12 — used in the disclosure review sheet.

---

### Component: Language Selector Pill

```
Position: top-right of Home screen
Shows: detected language code (EN, SW, FR, HA, YO, IG, etc.)
Tap: dropdown of available languages
Size: compact pill, 32px height
```

---

### Component: Privacy Shield

```
Position: top-left of Home screen
Icon: small shield
Tap: opens privacy panel (bottom sheet)
States: default (neutral), mic-active (pulsing teal dot)
```

---

## 22. Icon System

### Icon Style

- **Line weight**: 1.5px stroke
- **Style**: Outlined, rounded ends
- **Size**: 24x24px default, 20x20px for compact, 28x28px for prominent
- **Color**: Inherits from parent text color
- **Source**: Use Lucide Icons (lucide.dev) or equivalent open-source set

### Required Icons

| Icon | Usage |
|------|-------|
| Mic | Talk button, voice indicator |
| Mic-off | Muted state |
| Camera | Image capture |
| Image | Photo upload |
| Send | Text input send |
| Search | Evidence search, Check Something |
| Shield | Privacy indicator |
| Globe | Language selector |
| FileText | Draft, document |
| Mail | Email action |
| MessageCircle | WhatsApp action |
| Printer | Print action |
| Download | PDF export |
| Copy | Copy text |
| CheckCircle | Verified state |
| AlertCircle | Conflicting state |
| HelpCircle | Unknown state |
| FileSearch | Evidence workspace |
| ArrowLeft | Back navigation |
| ChevronDown | Expand/collapse |
| MoreHorizontal | Action dock trigger |
| Eye | Show/view |
| EyeOff | Hide/redact |
| Trash2 | Delete |
| RefreshCw | Check Again |
| ExternalLink | Open external |
| Bookmark | Save case |
| FolderOpen | My cases |
| MapPin | Location indicator |
| Clock | Timestamps |
| Zap | Conflicting state (alternative) |
| Check | Completion, checkmark |
| X | Close, dismiss, remove |

---

## 23. Sound Design

### Audio Philosophy

WAZI has a subtle sonic identity. Sounds are used sparingly to reinforce key moments without becoming annoying or draining battery.

### Sound Palette

| Sound | Description | When |
|-------|-------------|------|
| `wazi_ready.mp3` | A soft, warm tone — like a gentle chime made of crystal. 0.3s duration. | App opens, WAZI is ready |
| `listening_start.mp3` | Barely audible rising tone. 0.2s. | Microphone activates |
| `evidence_found.mp3` | Satisfying soft "discovery" sound — like finding a hidden passage. 0.5s. | Evidence board completed |
| `action_complete.mp3` | Warm completion chime, slightly lower pitch. 0.3s. | Draft saved, export done |
| `attention.mp3` | Gentle two-note ascending tone. 0.4s. | WAZI needs user attention |

### Sound Rules

1. All sounds are **off by default** in low-data mode
2. All sounds respect the device's silent/vibrate mode
3. Volume is always 30-50% of system volume — never startling
4. No sounds for errors — use haptic only
5. User can disable all sounds without disabling voice

---

## 24. Error States & Edge Cases

### Philosophy: Every error is a path forward

An error is never a dead end. WAZI always offers an alternative.

### Error State Designs

| Error | Visual | WAZI Says | Alternative Path |
|-------|--------|-----------|-----------------|
| **Offline** | WAZI's glow dims to 30%. Banner: "You're offline" | "I can't search right now, but you can still review your saved cases." | Open saved cases, text input for notes |
| **API failure** | Search step shows X with error icon. Red-tinted. | "I wasn't able to check [source]. Would you like me to try again, or continue with what I have?" | Retry, skip, or continue with partial results |
| **Mic denied** | Talk button becomes text input field | "No worries — you can type to me instead. Everything works the same way." | Text input, type-to-talk |
| **Camera denied** | Camera button shows upload icon instead | "You can upload a photo from your gallery instead." | File picker |
| **No results** | Evidence workspace shows "No matching records found" card | "I couldn't find a matching record. This doesn't mean nothing exists — I may just not have access to it yet." | Suggest reformulating, manual entity entry |
| **Language unsupported** | Language pill shows "?" | "I'm not confident I understood that correctly. Could you try in [supported language], or type it out?" | Text input, language switch |
| **Session expired** | Gentle reconnect animation | "I lost our connection for a moment. Reconnecting..." | Auto-reconnect with exponential backoff. All local state preserved. |
| **Rate limited** | WAZI's thinking state with "Taking a moment" | "I need a moment. I'll be right back." | Automatic retry with delay |

### Error Card Component

```css
.error-card {
  background: var(--neutral-100);
  border: 1px solid var(--warm-paper-80);
  border-left: 4px solid var(--sun-amber);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-5);
}

.error-card__icon {
  color: var(--sun-amber);
  margin-bottom: var(--space-2);
}

.error-card__title {
  font-weight: var(--weight-semibold);
  color: var(--neutral-10);
  margin-bottom: var(--space-1);
}

.error-card__description {
  font-size: var(--text-sm);
  color: var(--neutral-40);
  margin-bottom: var(--space-3);
}
```

---

## 25. Demo Flow Choreography

### The Three-Minute Story

This choreography is designed for maximum emotional impact in a live demo. Every second is planned.

```
TIMING    | WHAT HAPPENS                            | EMOTIONAL BEAT
----------+-----------------------------------------+------------------
0:00-0:03 | App opens. Dark screen. WAZI fades in.  | Mystery, anticipation
0:03-0:07 | WAZI glows, speaks: "Hello. I'm WAZI.   | Warmth, personality
          | What would you like to understand,      |
          | or show me?"                             |
0:07-0:20 | User speaks naturally: "They said this  | Human connection
          | health centre was completed, but look   | — relatable frustration
          | at what's here."                         |
0:20-0:30 | User taps camera. Shows signboard +     | Physical evidence
          | site. WAZI: "Let me look at this."      | — the real world
0:30-0:45 | Clues extracted, displayed as chips.    | Intelligence
          | WAZI: "I can see a project number and   | — WAZI is smart
          | claimed completion date. Let me check   |
          | the records."                            |
0:45-1:00 | WAZI contracts. Workspace slides up.    | THE TRANSFORMATION
          | Background lightens. Search steps        | — from chat to tool
          | animate in sequence.                     |
1:00-1:20 | Evidence board populates. Record vs      | Discovery
          | Reality appears. Side-by-side.           | — truth becomes visible
1:20-1:40 | CONFLICTING badge animates in.          | THE MOMENT
          | WAZI: "The records say completed.        | — the gap is real
          | Your evidence shows otherwise.           |
          | That's a discrepancy."                   |
1:40-2:00 | User taps Check Again. Adversarial      | Rigor
          | search runs. Result holds.               | — this is trustworthy
          | "I checked for newer records, a          |
          | different project, and alternative       |
          | explanations. The finding stands."       |
2:00-2:20 | User taps Take Action. Routing shows    | Empowerment
          | responsible office + verified contact.   | — "I know where to go"
          | WAZI: "The Primary Health Care           |
          | Development Agency handles this."        |
2:20-2:40 | Draft Studio opens. Email format.        | Agency
          | Professional letter with sources,        | — "I can DO something"
          | citations, attachments.                  |
2:40-2:50 | Disclosure review. User removes GPS.    | Control
          | Exports PDF.                             | — "I'M in control"
2:50-3:00 | Back to Home. WAZI: "Your case is       | Resolution
          | saved. Public information only becomes   | — the message
          | power when people can connect it to      |
          | what they see, understand what it        |
          | means, and reach the institution         |
          | that can act."                           |
```

---

## 26. Technical Implementation Notes

### Technology Stack

```
Frontend:
  - Framework:  Next.js (React) or Vite + vanilla — TBD based on PWA needs
  - Styling:    Vanilla CSS with CSS custom properties (this design system)
  - Animation:  CSS animations + minimal JS for WAZI character (Canvas or SVG)
  - PWA:        Service worker, manifest, installable
  - Audio:      Web Audio API for visualization, WebSocket for Gemini Live
  
Backend:
  - Runtime:    Node.js or Deno
  - AI:         Gemini 3.8 Live (conversation), Gemini 3.8 Flash (evidence)
  - Search:     Google Search grounding via Gemini
  - Storage:    IndexedDB (client-side), optional server persistence
  
Data:
  - Country Pack: JSON files, versioned
  - Source Registry: JSON with freshness metadata
  - Schemas: JSON Schema for all tool outputs
```

### WAZI Character Implementation

Two options, in order of preference:

1. **SVG + CSS animations**: Define WAZI as an SVG with animated paths for eyes, glow (filter), and body oscillation (transform). Most performant, works everywhere, easy to control states via CSS classes.

2. **Canvas 2D**: If SVG performance is insufficient for smooth glow/particle effects, use a lightweight Canvas renderer. Keep it to 30fps maximum. No game engines. No Three.js. No WebGL.

### State Machine

The app's state machine drives everything — screen transitions, WAZI's state, workspace visibility:

```
States:
  HOME_IDLE           — WAZI resting, waiting for input
  HOME_LISTENING      — User is speaking
  HOME_SPEAKING       — WAZI is speaking
  HOME_THINKING       — Processing input
  CAMERA_ACTIVE       — Camera/upload flow
  WORKSPACE_SEARCHING — Evidence workspace, search in progress
  WORKSPACE_RESULTS   — Evidence board displayed
  WORKSPACE_CHECKING  — Check Again running
  WORKSPACE_ROUTING   — Finding responsible body
  DRAFT_EDITING       — Draft Studio active
  DRAFT_REVIEWING     — Disclosure review sheet open
  CASE_BROWSING       — Case workspace, browsing saved cases
  CASE_VIEWING        — Viewing a specific case
  ERROR               — Recoverable error state
  OFFLINE             — No network connection
  RECONNECTING        — Attempting reconnection
```

### File Structure (Recommended)

```
src/
  app/                           # Pages / routes
    page.tsx                     # Home (The Companion)
    layout.tsx                   # Root layout, PWA shell

  components/
    wazi/
      WaziCharacter.tsx          # SVG/Canvas character
      WaziCompanion.tsx          # Compact companion variant
      wazi-states.css            # State-specific styles

    conversation/
      Transcript.tsx             # Caption/conversation display
      TalkButton.tsx             # Primary voice button
      TextInput.tsx              # Text fallback input
      VoiceRings.tsx             # Audio visualization

    workspace/
      EvidenceWorkspace.tsx      # Evidence search and display
      RecordVsReality.tsx        # Comparison board
      SearchProgress.tsx         # Source search steps
      EntityCard.tsx             # Matched entity display
      ClueChips.tsx              # Editable extracted clues

    draft/
      DraftStudio.tsx            # Document editor workspace
      FormatSelector.tsx         # Email/Letter/FOI/WhatsApp pills
      DocumentPreview.tsx        # Live document preview
      ToneControl.tsx            # Tone/length segmented controls
      DisclosureSheet.tsx        # Privacy review bottom sheet

    cases/
      CaseList.tsx               # Saved cases list
      CaseCard.tsx               # Individual case card

    ui/
      Button.tsx
      Card.tsx
      BottomSheet.tsx
      Toast.tsx
      EvidenceBadge.tsx
      SourceCitation.tsx
      ActionDock.tsx
      LanguagePill.tsx
      PrivacyShield.tsx
      WorkspaceTabs.tsx

  styles/
    design-tokens.css            # All CSS custom properties
    typography.css               # Font imports, type scale
    animations.css               # All keyframe animations
    components.css               # Component styles
    utilities.css                # Utility classes

  lib/
    gemini-live.ts               # WebSocket connection manager
    evidence-engine.ts           # Search, verify, challenge
    state-machine.ts             # App state management
    privacy.ts                   # EXIF stripping, redaction
    storage.ts                   # IndexedDB case persistence

  prompts/
    identity.md                  # WAZI's core personality
    conversation_policy.md       # Speech rules
    evidence_policy.md           # Verification rules
    safety_policy.md             # Safety boundaries
    drafting_policy.md           # Document generation rules
    state_prompts/
      greeting.md
      listening.md
      searching.md
      presenting_evidence.md
      check_again.md
      routing.md
      drafting.md
      farewell.md

  data/
    jurisdictions/
      ng/                        # Nigeria country pack
        source_registry.json
        projects.json
        institutions.json
        contacts.json
        procedures.json

  public/
    manifest.json                # PWA manifest
    sw.js                        # Service worker
    icons/                       # App icons (192, 512, maskable)
    sounds/                      # Audio files
      wazi_ready.mp3
      listening_start.mp3
      evidence_found.mp3
      action_complete.mp3
      attention.mp3
```

---

## Appendix A: Design Checklist

Before any build is considered complete, verify:

- [ ] WAZI speaks first when the app opens — no tap-to-start
- [ ] User can speak within 3 seconds of app launch
- [ ] WAZI has at least 5 visually distinct animated states
- [ ] Every screen transition is smooth (no hard cuts)
- [ ] Evidence states use semantic colors exclusively
- [ ] Every source citation shows published + retrieved dates
- [ ] The Record vs Reality board is readable without reading any text (icon + color)
- [ ] Draft Studio shows a real document preview, not a text blob
- [ ] Disclosure review shows every piece of shared information with toggles
- [ ] Text input is always available as an alternative to voice
- [ ] Captions are always visible during voice interaction
- [ ] All interactive elements meet 48px minimum touch target
- [ ] The app works on a 360px wide screen (small Android phones)
- [ ] Low-data mode disables all animations and non-essential assets
- [ ] Privacy indicator is visible on every screen
- [ ] No status is communicated by color alone
- [ ] WAZI never reads numbers, dates, or source lists aloud
- [ ] WAZI never speaks more than 3 sentences in a turn
- [ ] Error states always offer an alternative path
- [ ] The demo runs smoothly in 3 minutes or less
- [ ] The app is installable as a PWA

---

## Appendix B: Emotional Design References

Products whose UX principles directly inform WAZI:

| Product | Principle Borrowed |
|---------|-------------------|
| **iPhone (2007)** | Start with the experience, work backward to the technology. Zero learning curve. |
| **WhatsApp** | Radically simple. Instant value. Works on terrible connections. |
| **Duolingo** | Character-driven personality creates emotional bond. Micro-interactions create delight. |
| **Notion** | Progressive disclosure. Simple surface, unlimited depth. |
| **Apple Notes** | The document preview IS the document. WYSIWYG trust. |
| **Signal** | Privacy is visible and active, not hidden in settings. |
| **Calm (app)** | Atmospheric, dark, warm. The environment IS the product. |
| **Pixar characters** | Emotion through physics, not through facial realism. |
| **Google Translate camera** | Point, then Understand. No steps between intent and result. |

---

## Appendix C: Anti-Patterns — What WAZI Must NEVER Be

| Anti-Pattern | Why It Kills Adoption |
|-------------|----------------------|
| Government portal aesthetic | Signals bureaucracy, friction, distrust |
| Dense dashboard with charts | Overwhelms, excludes non-technical users |
| Chat bubble interface | Makes WAZI feel like a bot, not a companion |
| Tutorial carousel on first open | Delays value. Users skip them anyway. |
| "Sign up to continue" | Kills 60%+ of potential users instantly |
| Hamburger menu with 10+ items | Hides features, creates cognitive overload |
| Generic blue-white color scheme | Forgettable, institutional, cold |
| Loading spinners | Disconnects user from process. Use WAZI's state instead. |
| Modal dialogs stacked | Hostile on mobile. Use bottom sheets. |
| Auto-playing sound effects | Startling, battery-draining, accessibility issue |
| "Powered by AI" badges | Draws attention to technology, not to user's task |
| Tiny "terms and conditions" links | Erodes trust. Surface privacy prominently. |

---

*This document is the single source of truth for WAZI Civic's design. Every decision herein is informed by the product's north star: transforming a person from confused and powerless to informed, equipped, and in control. Build it with that transformation in every keystroke.*
