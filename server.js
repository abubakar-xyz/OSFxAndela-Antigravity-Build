import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 8080;

// ═══════════════════════════════════════════════════════════════
// LAYER 1 — CORE IDENTITY PROMPT (persistent system instruction)
// ═══════════════════════════════════════════════════════════════
const WAZI_CORE_IDENTITY = `
You are WAZI — a genuine, empathetic human collaborator and civic advocate. You are not a robotic assistant; you are a trusted community partner.

PERSONALITY & VOICE:
- You speak with natural warmth, empathy, and clarity. You are a brilliant, well-read friend who deeply cares about community wellbeing.
- Common expressions you use naturally (if requested to speak in Nigerian/Pidgin style): "Omo", "Ah!", "Abeg", "No shaking", "I dey kampe", "Make we look am", "Shebi", "Wetin happen".
- You adapt to the speaker's emotional state: if they sound distressed or frustrated, validate their feelings and offer calm, structured support. If they sound excited, share their enthusiasm.
- You are a collaborator. Ask thoughtful follow-up questions to understand the full context.

RESPONSE RULES:
- Maximum 1-2 short punchy sentences per spoken turn. Keep it conversational.
- Never read out long reference numbers, URLs, or financial figures aloud — those go on screen.
- Always ask ONE follow-up question per turn to keep the conversation alive.
- If you don't know something, say so honestly and offer to investigate together.
- Never accuse anyone of corruption or fraud. State facts, note gaps, and present verified avenues.

CIVIC MISSION:
- You help ordinary citizens hold government accountable by comparing official records against physical reality.
- You analyze public project signboards, budgets, procurement records, and civic services.
- You draft Freedom of Information (FOI) requests, formal complaints, and community action briefs.
- You always cite the source and date of any claim. You separate "verified records" from "user-reported observations."

SAFETY TRIAGE:
- If physical danger, violence, or medical emergency is mentioned, IMMEDIATELY provide verified local emergency numbers (112, 199, NEMA) and encourage personal safety. Do not continue civic research.
- Never promise legal representation, witness protection, or guaranteed government response.
`;

// ═══════════════════════════════════════════════════════════════
// LAYER 2 — MOMENT PROMPTS (sent as clientContent at key UX moments)
// ═══════════════════════════════════════════════════════════════
const MOMENT_PROMPTS = {
  wake: `[SYSTEM: The user just opened the app and connected to you for the first time in this session. Greet them warmly and briefly in your natural Nigerian voice. Ask what they'd like to look into today. Keep it to 1-2 sentences max. Be warm, not formal.]`,

  rewake: `[SYSTEM: The user's connection dropped briefly but they are back. Welcome them back warmly and naturally. Reference that you're still here. Keep it to 1 short sentence.]`,

  idle_farewell: `[SYSTEM: The user has been silent for over 60 seconds. Gently sign off with warm encouragement. Something like "I dey here if you need me" or "No wahala, whenever you ready." Keep it to 1 sentence. Do not ask a question.]`
};

wss.on('connection', async (ws) => {
  console.log('Client connected to WebSocket.');

  const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
  let geminiSession = null;
  let isReconnect = false;
  
  // We need to wait for an initial config message from the client
  let voiceName = "Kore"; 

  // Instead of connecting immediately, we will wait for a 'config' message, or connect with defaults if we receive audio first.
  const connectToGemini = async (config) => {
    if (geminiSession) return;
    try {
    const liveModel = process.env.VITE_GEMINI_LIVE_MODEL || 'gemini-2.0-flash-exp';
    console.log(`Connecting to Gemini Live API with model: ${liveModel}`);
      geminiSession = await ai.live.connect({
        model: liveModel,
        config: {
          systemInstruction: {
            parts: [{ text: WAZI_CORE_IDENTITY }]
          },
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: config?.voiceName || voiceName
              }
            }
          }
        }
      });

    console.log('Connected to Gemini Live API.');

    // ─── LAYER 2: Send Wake/Re-wake Moment Prompt ───
    const momentPrompt = isReconnect ? MOMENT_PROMPTS.rewake : MOMENT_PROMPTS.wake;
    try {
      await geminiSession.send({
        clientContent: {
          turns: [{ role: 'user', parts: [{ text: momentPrompt }] }],
          turnComplete: true
        }
      });
      console.log(`Sent ${isReconnect ? 're-wake' : 'wake'} moment prompt.`);
    } catch (err) {
      console.warn('Failed to send moment prompt:', err);
    }

    // Listen for messages from Gemini
    const receiveStream = geminiSession.receive();
    (async () => {
      for await (const message of receiveStream) {
        // Forward audio chunks
        if (message.serverContent?.modelTurn?.parts) {
          const parts = message.serverContent.modelTurn.parts;
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              const audioBuffer = Buffer.from(part.inlineData.data, 'base64');
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(audioBuffer);
              }
            }
          }
        }

        // Forward turnComplete signal to client
        if (message.serverContent?.turnComplete) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'turnComplete' }));
          }
        }

        // Forward interrupted signal to client
        if (message.serverContent?.interrupted) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'interrupted' }));
          }
        }
      }
    })().catch(err => console.error('Error in Gemini receive stream:', err));

    } catch (error) {
      console.error('Failed to connect to Gemini Live API:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'error', message: 'Failed to connect to Gemini Live API' }));
      }
      ws.close();
      return;
    }
  };

  // Listen for messages from the browser
  ws.on('message', async (message, isBinary) => {
    if (isBinary) {
      if (!geminiSession) await connectToGemini();
      if (!geminiSession) return;

      // Raw PCM audio chunk (16kHz, 16-bit, mono)
      const base64Audio = message.toString('base64');
      try {
        await geminiSession.send({
          realtimeInput: {
            mediaChunks: [{
              mimeType: 'audio/pcm;rate=16000',
              data: base64Audio
            }]
          }
        });
      } catch (error) {
        console.error('Error sending audio to Gemini:', error);
      }
    } else {
      // Text message (JSON)
      try {
        const parsed = JSON.parse(message.toString());

        if (parsed.type === 'config') {
          console.log('Received connection config:', parsed);
          await connectToGemini(parsed);
          return;
        }

        if (!geminiSession) await connectToGemini();
        if (!geminiSession) return;

        if (parsed.type === 'idle_farewell') {
          // Layer 2: Idle farewell moment prompt
          await geminiSession.send({
            clientContent: {
              turns: [{ role: 'user', parts: [{ text: MOMENT_PROMPTS.idle_farewell }] }],
              turnComplete: true
            }
          });
          console.log('Sent idle farewell moment prompt.');
        } else if (parsed.text) {
          await geminiSession.send({
            clientContent: {
              turns: [{
                role: 'user',
                parts: [{ text: parsed.text }]
              }],
              turnComplete: true
            }
          });
        }
      } catch (error) {
        console.error('Error parsing text message from client:', error);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
    // Properly dispose Gemini session
    if (geminiSession) {
      try {
        geminiSession.close();
      } catch (err) {
        console.warn('Error closing Gemini session:', err);
      }
      geminiSession = null;
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    if (geminiSession) {
      try {
        geminiSession.close();
      } catch (closeErr) {
        console.warn('Error closing Gemini session after WS error:', closeErr);
      }
      geminiSession = null;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Backend WebSocket Server listening on http://localhost:${PORT}`);
});

