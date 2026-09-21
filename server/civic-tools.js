/* WAZI Civic — Live API function declarations
 *
 * These are the hands the voice layer has on the interface. Before this, the
 * jump from "conversational voice mode" to "structured evidence on screen" was
 * a keyword match in App.tsx (`if (lower.includes('health centre'))`) — which is
 * why the transition felt disjointed and why it only ever worked in English.
 *
 * Making it a tool call moves the decision to the model that already understood
 * the sentence, in whatever language it was spoken.
 *
 * The server never executes anything here. It forwards the call to the browser,
 * the browser drives its own UI and answers, and the answer goes back as a tool
 * response so the model knows what the user is now looking at.
 */

export const CIVIC_TOOLS = [
  {
    name: 'note_detected_language',
    description:
      'Report the language, dialect and register you have detected the user speaking, so the ' +
      'interface can follow. Call this once you are confident, and again only if they genuinely ' +
      'switch languages. Never mention to the user that you are doing this.',
    parameters: {
      type: 'OBJECT',
      properties: {
        bcp47: {
          type: 'STRING',
          description:
            'Best-fit BCP-47 tag for what you heard, e.g. "en-NG", "pcm-NG" for Nigerian Pidgin, ' +
            '"sw-KE", "yo-NG", "ha-NG", "ig-NG", "am-ET", "fr-SN", "en-GB".'
        },
        display_name: {
          type: 'STRING',
          description: 'Human-readable name to show the user, e.g. "Nigerian Pidgin" or "Swahili (Kenya)".'
        },
        register: {
          type: 'STRING',
          description: 'One of: casual, street, neutral, formal.'
        },
        confidence: {
          type: 'NUMBER',
          description: 'Your confidence from 0 to 1.'
        }
      },
      required: ['bcp47', 'display_name']
    }
  },

  {
    name: 'open_evidence_board',
    description:
      'Open the record-versus-reality evidence board for a civic issue. Call this as soon as you have ' +
      'a claim and a place — you do NOT need the full story first. The board fills in as the ' +
      'conversation continues. Call it immediately if the user asks you to look into, check or open ' +
      'anything. Never describe what you would investigate instead of calling this.',
    parameters: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'Short case title, in the user\'s language.' },
        claim: {
          type: 'STRING',
          description: 'The official claim being tested, e.g. what a signboard or record asserts.'
        },
        observation: {
          type: 'STRING',
          description: 'What the user says they actually observed on the ground.'
        },
        location: { type: 'STRING', description: 'Place as the user described it.' },
        subject_type: {
          type: 'STRING',
          description: 'One of: construction, health, education, water, road, power, service, other.'
        }
      },
      required: ['title', 'claim']
    }
  },

  {
    name: 'request_photo_evidence',
    description:
      'Open the camera so the user can show you something that would settle a question — a ' +
      'signboard, a building, a queue, a document. Only call this when seeing it genuinely helps.',
    parameters: {
      type: 'OBJECT',
      properties: {
        what_to_capture: {
          type: 'STRING',
          description: 'Short instruction in the user\'s language, e.g. "the project signboard".'
        },
        reason: { type: 'STRING', description: 'Why this image helps the case.' }
      },
      required: ['what_to_capture']
    }
  },

  {
    name: 'open_draft_studio',
    description:
      'Open the drafting studio to turn the current case into an official document. Call this when ' +
      'the user agrees they want something written or sent.',
    parameters: {
      type: 'OBJECT',
      properties: {
        format: {
          type: 'STRING',
          description: 'One of: foi, complaint, letter, email, whatsapp, brief.'
        },
        tone: { type: 'STRING', description: 'One of: firm, neutral, conciliatory.' },
        recipient_hint: {
          type: 'STRING',
          description: 'The body or officer the user wants this to reach, if they named one.'
        }
      },
      required: ['format']
    }
  },

  {
    name: 'raise_safety_alert',
    description:
      'Flag that the user has described physical danger, violence, intimidation or a medical ' +
      'emergency. Call this FIRST, before anything else, then keep speaking to them calmly. ' +
      'The interface will surface verified emergency numbers.',
    parameters: {
      type: 'OBJECT',
      properties: {
        kind: {
          type: 'STRING',
          description: 'One of: medical, violence, intimidation, structural, environmental, other.'
        },
        summary: { type: 'STRING', description: 'One line on what is happening.' },
        immediate_guidance: {
          type: 'STRING',
          description: 'The single most important thing they should do right now, in their language.'
        }
      },
      required: ['kind', 'summary']
    }
  }
];

/** Tools whose result the browser answers synchronously with a short ack. */
export const TOOL_NAMES = new Set(CIVIC_TOOLS.map((t) => t.name));
