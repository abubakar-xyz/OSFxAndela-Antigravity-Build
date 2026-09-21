/* WAZI Civic — the whole app, in one process on one port.
 *
 *   npm run dev     Vite in middleware mode + the voice socket
 *   npm start       the built UI + the voice socket
 *
 * One command and one origin is a deliberate choice, not a convenience. A
 * separate dev server and proxy means two terminals, a CORS story, a second
 * port to forward, and a demo that dies if one of them is not running. It also
 * means the browser derives the WebSocket URL from the page it was served from,
 * so opening the app on a phone on the same network just works.
 *
 * Three jobs:
 *   1. /live  — one WebSocket per browser, bridged to one Gemini Live session.
 *   2. /api/* — the non-realtime Gemini calls, so the key never reaches a bundle.
 *   3. everything else — the UI itself.
 *
 * WAZI's character lives in server/wazi-identity.js; model capabilities live in
 * server/live-models.js.
 */

import http from 'http';
import path from 'path';
import fs from 'fs';
import express from 'express';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

import { LiveBridge } from './server/live-bridge.js';
import { LIVE_MODELS, INPUT_SAMPLE_RATE, OUTPUT_SAMPLE_RATE } from './server/live-models.js';
import { GRACE_PERIOD_MS, drain as drainVault } from './server/session-vault.js';
import { PERSONAS } from './server/wazi-identity.js';

dotenv.config();

// VITE_GEMINI_API_KEY is still read so existing .env files keep working, but it
// is the wrong name for this: anything VITE_-prefixed is inlined into the client
// bundle by Vite and therefore public. GEMINI_API_KEY is the one to use.
const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const PREFERRED_MODEL = process.env.GEMINI_LIVE_MODEL || process.env.VITE_GEMINI_LIVE_MODEL || '';
const JURISDICTION = process.env.WAZI_JURISDICTION || 'Nigeria';
const PORT = Number(process.env.PORT || 8080);
const VERBOSE = process.env.WAZI_LOG !== 'quiet';

if (!API_KEY) {
  console.warn('⚠️  No GEMINI_API_KEY set — the live voice session will refuse to open.');
} else if (process.env.VITE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
  console.warn(
    '⚠️  Using VITE_GEMINI_API_KEY. Vite inlines VITE_-prefixed vars into the browser bundle; ' +
    'rename it to GEMINI_API_KEY so the key stays server-side.'
  );
}

const DEV = process.env.NODE_ENV !== 'production';

const app = express();
app.use(express.json({ limit: '12mb' })); // photo evidence arrives as base64

const server = http.createServer(app);
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// ═══════════════════════════════════════════════════════════════
// HTTP
// ═══════════════════════════════════════════════════════════════

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    liveConfigured: Boolean(API_KEY),
    preferredModel: PREFERRED_MODEL || null,
    models: LIVE_MODELS.map((m) => ({ id: m.id, label: m.label, capabilities: m.capabilities })),
    personas: Object.values(PERSONAS).map((p) => ({ id: p.id, name: p.displayName, role: p.role })),
    audio: { inputSampleRate: INPUT_SAMPLE_RATE, outputSampleRate: OUTPUT_SAMPLE_RATE },
    reconnectGraceMs: GRACE_PERIOD_MS,
    jurisdiction: JURISDICTION
  });
});

const VISION_MODEL = process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash';

const CLUE_PROMPT = `Analyze this civic signboard or public project site image. Extract visible structured clues.
Fields to look for:
- project_name: Title of project or service
- tender_ref: Contract / Tender reference code
- agency: Government ministry, department or agency
- contractor: Company or contractor name
- status_claimed: Claimed state (e.g. Completed, In Progress)
- visual_condition: Visible physical state (e.g. unroofed, weeds, no equipment)
- location: City, LGA, State
Return ONLY a valid JSON array of objects shaped { "id": string, "field": string, "label": string, "value": string, "confidence": number }.
Omit any field you cannot actually read in the image. Never invent a reference number.`;

/** Multimodal clue extraction. The browser sends pixels; the key stays here. */
app.post('/api/vision/clues', async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'gemini_unconfigured' });

  const { image } = req.body || {};
  if (typeof image !== 'string' || image.length < 32) {
    return res.status(400).json({ error: 'missing_image' });
  }
  const data = image.replace(/^data:image\/\w+;base64,/, '');

  try {
    const result = await ai.models.generateContent({
      model: VISION_MODEL,
      contents: [
        { role: 'user', parts: [{ text: CLUE_PROMPT }, { inlineData: { mimeType: 'image/jpeg', data } }] }
      ]
    });
    const text = result.text || '';
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return res.status(502).json({ error: 'unparseable_response' });
    return res.json({ clues: JSON.parse(match[0]) });
  } catch (err) {
    console.error('vision extraction failed:', err?.message);
    return res.status(502).json({ error: 'extraction_failed', message: err?.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// WEBSOCKET
// ═══════════════════════════════════════════════════════════════

const wss = new WebSocketServer({ server, path: '/live' });
let clientSeq = 0;

wss.on('connection', (ws) => {
  const id = ++clientSeq;
  const log = VERBOSE ? (...a) => console.log(`[live#${id}]`, ...a) : () => {};
  log('browser connected');

  // Heartbeat liveness flag — see the sweep below.
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  if (!API_KEY) {
    ws.send(
      JSON.stringify({
        type: 'error',
        code: 'auth',
        message: 'This server has no GEMINI_API_KEY, so the live voice session cannot open.',
        fatal: true
      })
    );
    ws.close();
    return;
  }

  // One bridge per socket, and therefore one Gemini session per socket. Live
  // sessions are a metered, concurrency-limited resource; leaking them is how
  // you end up serving "quota exceeded" to real users.
  new LiveBridge(ws, {
    apiKey: API_KEY,
    preferredModel: PREFERRED_MODEL,
    jurisdiction: JURISDICTION,
    log
  });
});

// Heartbeat: a phone that walks into a lift leaves a half-open socket behind,
// holding a Gemini session open against the concurrency limit.
const HEARTBEAT_MS = 30_000;
const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) { ws.terminate(); continue; }
    ws.isAlive = false;
    try { ws.ping(); } catch { /* socket already dying */ }
  }
}, HEARTBEAT_MS);
wss.on('close', () => clearInterval(heartbeat));

// ═══════════════════════════════════════════════════════════════
// THE UI
// ═══════════════════════════════════════════════════════════════
// Mounted last so /api and the /live upgrade are matched first.

async function mountUi() {
  if (DEV) {
    // Vite as middleware rather than as a second server: same port, same
    // origin, full HMR, one process to start and one to stop.
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
    console.log('Vite dev middleware mounted (HMR active)');
    return;
  }

  const DIST = path.resolve('dist');
  if (!fs.existsSync(DIST)) {
    console.warn('⚠️  No ./dist found. Run `npm run build` first, or use `npm run dev`.');
    return;
  }
  app.use(express.static(DIST));
  app.get(/^\/(?!api\/|live$).*/, (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
  console.log('Serving the built UI from ./dist');
}

await mountUi();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  WAZI is live on http://localhost:${PORT}`);
  console.log(`  voice         ws://localhost:${PORT}/live`);
  console.log(`  model chain   ${(PREFERRED_MODEL ? [PREFERRED_MODEL] : []).concat(LIVE_MODELS.map((m) => m.id)).join(' → ')}`);
  console.log(`  audio         ${INPUT_SAMPLE_RATE}Hz PCM in / ${OUTPUT_SAMPLE_RATE}Hz PCM out`);
  console.log(`  jurisdiction  ${JURISDICTION}\n`);
});

function shutdown(signal) {
  console.log(`\n${signal} — closing live sessions.`);
  clearInterval(heartbeat);
  drainVault();
  for (const ws of wss.clients) { try { ws.close(); } catch { /* already gone */ } }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
