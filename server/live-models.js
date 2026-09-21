/* WAZI Civic — Live API model capability table
 *
 * Every entry here was verified empirically against generativelanguage.googleapis.com
 * with the project key, not taken from documentation. The Live API rejects the whole
 * `setup` frame with "Request contains an invalid argument" if you send a config field
 * the chosen model does not support, which kills the session before a single audio
 * frame moves — so capabilities are gated per model rather than sent hopefully.
 *
 * Measured on a 5.1s Nigerian-Pidgin utterance (16kHz PCM in -> first audio byte out):
 *
 *   gemini-3.1-flash-live-preview          ~1.9s   tools OK   affectiveDialog REJECTED
 *   gemini-2.5-flash-native-audio-latest   ~7.5s   tools OK   affectiveDialog OK
 *   gemini-3.8-live                         n/a    tools TIMED OUT, audio TIMED OUT
 *
 * WAZI is a conversation, so responsiveness outranks the affective-dialog flag:
 * a companion that takes seven seconds to react does not feel alive no matter how
 * expressive it eventually sounds. Hence 3.1-flash leads and native-audio backs it up.
 */

export const LIVE_MODELS = [
  {
    id: 'gemini-3.1-flash-live-preview',
    label: 'Gemini 3.1 Flash Live',
    outputSampleRate: 24000,
    capabilities: {
      tools: true,
      affectiveDialog: false,
      contextWindowCompression: true,
      sessionResumption: true,
      transcription: true
    }
  },
  {
    id: 'gemini-2.5-flash-native-audio-latest',
    label: 'Gemini 2.5 Flash Native Audio',
    outputSampleRate: 24000,
    capabilities: {
      tools: true,
      affectiveDialog: true,
      contextWindowCompression: true,
      sessionResumption: true,
      transcription: true
    }
  },
  {
    id: 'gemini-2.5-flash-native-audio-preview-12-2025',
    label: 'Gemini 2.5 Flash Native Audio (12-2025)',
    outputSampleRate: 24000,
    capabilities: {
      tools: true,
      affectiveDialog: true,
      contextWindowCompression: true,
      sessionResumption: true,
      transcription: true
    }
  }
];

/** Audio format constants. These are contractual: the browser encodes and decodes to them. */
export const INPUT_SAMPLE_RATE = 16000;   // what we send Gemini
export const OUTPUT_SAMPLE_RATE = 24000;  // what Gemini sends us
export const INPUT_MIME = `audio/pcm;rate=${INPUT_SAMPLE_RATE}`;

/**
 * The ordered list of models to try. An operator can pin one with
 * GEMINI_LIVE_MODEL; it is moved to the front rather than replacing the chain,
 * so a bad pin degrades instead of breaking the app.
 */
export function buildModelChain(preferredId) {
  const known = new Map(LIVE_MODELS.map((m) => [m.id, m]));
  const chain = [];

  if (preferredId) {
    chain.push(
      known.get(preferredId) || {
        id: preferredId,
        label: preferredId,
        outputSampleRate: OUTPUT_SAMPLE_RATE,
        // Unknown model: assume the conservative intersection of capabilities.
        capabilities: {
          tools: true,
          affectiveDialog: false,
          contextWindowCompression: false,
          sessionResumption: false,
          transcription: true
        }
      }
    );
  }

  for (const m of LIVE_MODELS) {
    if (!chain.some((c) => c.id === m.id)) chain.push(m);
  }
  return chain;
}

/**
 * Builds a `setup` config that the given model will actually accept.
 * Unsupported fields are omitted entirely rather than sent as `false` —
 * some are rejected by presence, not by value.
 */
export function buildLiveConfig(model, { systemInstruction, voiceName, tools }) {
  const cfg = {
    responseModalities: ['AUDIO'],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    speechConfig: {
      voiceConfig: { prebuiltVoiceConfig: { voiceName } }
    }
  };

  if (model.capabilities.transcription) {
    // Both directions. These are what let a deaf or hard-of-hearing user, or
    // anyone on a noisy street, follow the same conversation on screen.
    cfg.inputAudioTranscription = {};
    cfg.outputAudioTranscription = {};
  }
  if (model.capabilities.tools && tools?.length) {
    cfg.tools = [{ functionDeclarations: tools }];
  }
  if (model.capabilities.affectiveDialog) {
    cfg.enableAffectiveDialog = true;
  }
  if (model.capabilities.contextWindowCompression) {
    // A civic conversation can run long. Without this the session dies on a
    // context overflow mid-sentence.
    cfg.contextWindowCompression = { slidingWindow: {} };
  }
  return cfg;
}
