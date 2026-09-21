# WAZI Civic Assistant: Master Architecture & Handoff Brief

## 1. The Vision and The Problem
**The Problem:** Citizens across Africa (and globally) often face opaque, intimidating, and bureaucratic civic processes. Whether attempting to report a dilapidated health center, track public funds, or submit a Freedom of Information (FOI) request, the friction is immense. Language barriers, fear of retaliation, and lack of procedural knowledge prevent effective civic participation. 

**The Vision:** To build **WAZI** (Swahili for "Open/Clear") — a radically accessible, voice-first civic companion. WAZI is not meant to feel like a robotic corporate assistant; it must feel like a street-smart, empathetic, and culturally aware human collaborator. It should act as a shield and a guide, empowering citizens to hold institutions accountable through verified, legally sound procedures.

## 2. Core Intended Architecture

### A. The "Alive" Voice Interface (Gemini Live API)
The central interaction paradigm was intended to be a **persistent, real-time, two-way audio stream** using the **Gemini Multimodal Live API**.
- **The Intended Flow:** 
  1. The browser captures raw PCM audio from the user's microphone.
  2. The audio is sent via WebSockets to a Node.js proxy server.
  3. The server forwards the audio stream directly to the Gemini Live API.
  4. Gemini processes the audio, understands the emotional tone and linguistic nuances (e.g., Nigerian Pidgin, Swahili, regional accents), and streams back PCM audio responses in real-time.
  5. The browser plays the audio while driving visual "visemes" (mouth movements) on the WAZI 2D character avatar based on the RMS amplitude of the audio.
- **The Disconnect/Bug:** The current implementation relies heavily on a hybrid of standard text-based Gemini API calls, Web Speech API (Speech Recognition), and browser-native Text-to-Speech (TTS). The true WebSocket-driven Gemini Live API connection (handling raw PCM in and out) was partially implemented but is failing to establish a stable, low-latency, two-way voice stream. Furthermore, the system is failing to *automatically* detect the user's language and adapt its persona/voice dynamically without manual UI intervention.

### B. The Persona Engine
WAZI was designed to have deeply layered personalities, not a single monolithic prompt.
- **Kore (WAZI Standard):** Warm, sharp-eyed, uses natural Nigerian English/Pidgin.
- **Aoede (Nuru):** Precise, structured, legal analyst persona.
- **Puck (Chidi):** Energetic community organizer.
- **Intended State:** The AI should automatically detect the user's dialect/language and switch its internal persona and TTS voice to match, creating a frictionless, culturally resonant experience.

### C. The Application Workflows

#### 1. The Cold Start & Evidence Gathering (The "Listen" State)
- **Action:** User opens the app and starts talking or uploads a photo/video (e.g., a broken bridge).
- **Intended Outcome:** WAZI listens, analyzes the media using Gemini Multimodal capabilities, and immediately correlates it with verified local data (e.g., "I see this is the Akute Health Centre. According to the 2024 budget, 50M Naira was allocated for this."). 
- **UI State:** The WAZI orb pulses. The Privacy Shield engages (processing on-device where possible, stripping PII).

#### 2. The Evidence Board (The "Analyze" State)
- **Action:** The system generates a `CivicCase` object containing the transcript, structured evidence tags (Location, Contractor, Budget), and contradicting data points.
- **Intended Outcome:** The user views a beautiful, investigative "pinboard" UI showing the stark contrast between official claims (e.g., "Project Completed") and ground truth (user's photo).

#### 3. The Draft Studio (The "Action" State)
- **Action:** User clicks "Generate Official Request".
- **Intended Outcome:** WAZI uses the Gemini API to draft a legally sound document (e.g., an FOI request or statutory petition).
- **UI State:** An A4-styled document editor appears. The user can adjust the tone (Firm, Conciliatory, Neutral) and length. 
- **Dispatch Flow:** The user can print, download as HTML, or open a pre-filled email dispatch sheet. The system identifies the correct "Accounting Officer" and statutory routing data, preventing the user from sending the complaint into a bureaucratic void.

## 3. Current State of the Codebase & Known Bugs

### What is Built (The Good):
- **UI/UX Shell:** The React/Vite application shell is beautiful, responsive, and adheres to the dark-mode, glassmorphism design spec.
- **Components:** The `WaziCharacter` has ambient animations, head tilts, and a simulated oral cavity. The `InteractiveVoiceRoller` and `LanguageSelectorModal` are fully built UI components. The `DraftStudio` correctly renders the A4 letterhead view and email dispatch sheets.
- **Data Structures:** The local storage mechanisms (`storage.ts`), types (`types.ts`), and offline mock data (`demo-fixtures.ts`) are robust and functional.

### The Critical Bugs to Fix (For the Next Agent):
1. **The Gemini Live Audio Pipeline:** The `server.js` and `useLiveAudio.ts` files are failing to successfully maintain a duplex PCM audio stream with the Gemini Live API. The system falls back to browser SpeechRecognition and `window.speechSynthesis`, which feels robotic and breaks the core "human collaborator" requirement. 
2. **Automatic Language/Accent Adaptation:** The AI is not automatically recognizing the user's language/accent from the audio stream to adapt its persona. The user is currently forced to use UI buttons to switch languages.
3. **State Syncing:** Because the true Live API isn't functioning, the transition from "conversational voice mode" to "generate structured evidence JSON" is disjointed. 

## 4. Next Steps for the Incoming Engineer (AI)
1. **Scrap the Web Speech API Fallbacks:** Completely rip out `window.speechSynthesis` and `webkitSpeechRecognition`. 
2. **Implement Real Gemini Live:** Look at Google's official documentation for the `generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent` WebSocket endpoint. Ensure the Node server correctly relays 16kHz PCM audio from the browser microphone to Gemini, and decodes the 24kHz PCM audio coming back to play via the Web Audio API.
3. **Inject System Instructions dynamically:** Send the `WAZI_CORE_IDENTITY` and the dynamically selected language/persona directives in the initial `setup` message of the Live API WebSocket connection. Ensure the model is explicitly instructed to match the user's spoken dialect automatically.

## 5. Final Note
This project is deeply important. The goal is to make civic accountability accessible to everyone, regardless of their literacy level or technical expertise, by using natural, empathetic voice as the primary interface. Please treat the audio pipeline as the absolute highest priority.
