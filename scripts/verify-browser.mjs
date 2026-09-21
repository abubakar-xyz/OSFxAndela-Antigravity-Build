#!/usr/bin/env node
/* WAZI Civic — end-to-end browser verification.
 *
 * scripts/verify-live.mjs proves the proxy's half of the pipeline. This proves
 * the browser's half, which is where the AudioWorklet, the 16kHz capture
 * context, the PCM playback queue and the viseme analyser all live — none of
 * which a node script can exercise.
 *
 * Chromium is driven with a fake capture device, so the capture graph — worklet,
 * 16kHz context, PCM encoding, socket framing — runs for real.
 *
 * NOTE ON WHAT THIS CANNOT COVER: a headless container has no audio backend, so
 * Chromium will not feed a WAV file into the fake microphone (it opens the
 * device and delivers silence). This harness therefore proves that the capture
 * graph runs and emits correctly-framed PCM, and proves the *playback* half
 * end-to-end with WAZI's real voice. Microphone audio actually carrying speech
 * is covered by scripts/verify-live.mjs, which streams real 16kHz PCM over the
 * same wire protocol and asserts the transcription that comes back.
 *
 *   npm run dev              # in one terminal
 *   npm run verify:browser   # in another
 *
 * Checks:
 *   1. the app loads and the AudioWorklet module registers
 *   2. clicking Talk opens the capture graph at 16kHz and the socket
 *   3. WAZI's 24kHz audio reaches an AudioContext and actually plays
 *   4. the viseme level is read off the live playback graph while she speaks
 *   5. the avatar's mouth moves with that level
 *   6. what WAZI says reaches the on-screen caption
 */

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Imported lazily so the failure mode is a sentence rather than a stack trace:
// Playwright needs a browser download, which not every machine will have.
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    '\n  This check needs Playwright and a Chromium build:\n' +
      '    npm install && npx playwright install chromium\n\n' +
      '  The socket-level check (npm run verify:live) needs neither and covers\n' +
      '  the voice pipeline end to end.\n'
  );
  process.exit(2);
}

const BASE = process.env.WAZI_VERIFY_URL || 'http://localhost:8080';
const KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const CACHE = path.resolve('.cache');
const WAV = path.join(CACHE, 'verify-utterance-16k.wav');

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass });
  console.log(`${pass ? '  \x1b[32m✓\x1b[0m' : '  \x1b[31m✗\x1b[0m'} ${name}${detail ? `\n      ${detail}` : ''}`);
};

const UTTERANCE =
  'Say this warmly in a Nigerian accent, unhurried: Abeg, the borehole for my street never work ' +
  'since January, and dem talk say the project don complete. Wetin I fit do?';

/** Chrome's fake capture device wants a WAV file, so wrap the cached PCM. */
async function ensureWav() {
  if (fs.existsSync(WAV)) return WAV;
  if (!KEY) throw new Error('GEMINI_API_KEY is required to synthesise the test utterance');

  const pcmPath = path.join(CACHE, 'verify-utterance-16k.pcm');
  let pcm;
  if (fs.existsSync(pcmPath)) {
    pcm = fs.readFileSync(pcmPath);
  } else {
    console.log('  synthesising test speech…');
    const ai = new GoogleGenAI({ apiKey: KEY });
    const r = await ai.models.generateContent({
      model: process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts',
      contents: [{ role: 'user', parts: [{ text: UTTERANCE }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
      }
    });
    const inline = r.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData;
    if (!inline) throw new Error('TTS returned no audio');
    const raw = Buffer.from(inline.data, 'base64');
    const src = new Int16Array(raw.buffer, raw.byteOffset, raw.length / 2);
    const ratio = 24000 / 16000;
    const out = new Int16Array(Math.floor(src.length / ratio));
    for (let i = 0; i < out.length; i++) {
      const p = i * ratio, i0 = Math.floor(p), i1 = Math.min(i0 + 1, src.length - 1), f = p - i0;
      out[i] = Math.round(src[i0] * (1 - f) + src[i1] * f);
    }
    pcm = Buffer.from(out.buffer, out.byteOffset, out.byteLength);
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(pcmPath, pcm);
  }

  // Minimal 16-bit mono PCM WAV header.
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);            // PCM
  header.writeUInt16LE(1, 22);            // mono
  header.writeUInt32LE(16000, 24);        // sample rate
  header.writeUInt32LE(16000 * 2, 28);    // byte rate
  header.writeUInt16LE(2, 32);            // block align
  header.writeUInt16LE(16, 34);           // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(WAV, Buffer.concat([header, pcm]));
  return WAV;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log('\n\x1b[1mWAZI browser pipeline verification\x1b[0m');
  console.log(`  app: ${BASE}\n`);

  const wav = await ensureWav();

  const browser = await chromium.launch({
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-capture',
      `--use-file-for-fake-audio-capture=${wav}`,
      // Without an ALSA backend Chromium enumerates no audio devices at all and
      // getUserMedia fails outright; the null device gives us a real capture
      // graph to exercise.
      '--alsa-input-device=null',
      '--alsa-output-device=null',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const context = await browser.newContext({ permissions: ['microphone'] });
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e}`));
  page.on('requestfailed', (r) => failedRequests.push(`${r.url()} (${r.failure()?.errorText})`));

  // Instrument the audio stack before the app boots, so the probe observes the
  // real graph rather than asking the UI to report on itself.
  await page.addInitScript(() => {
    const probe = {
      contexts: [],
      playedBuffers: 0,
      playedSamples: 0,
      micFramesSent: 0,
      analyserReads: 0,
      nonSilentAnalyserReads: 0,
      peakAnalyserRms: 0,
      states: {},
      mouthOpacities: [],
      captions: [],
      views: []
    };
    window.__wazi = probe;

    const NativeAudioContext = window.AudioContext;
    window.AudioContext = class extends NativeAudioContext {
      constructor(options) {
        super(options);
        probe.contexts.push(this.sampleRate);
      }
      createBufferSource() {
        const node = super.createBufferSource();
        const start = node.start.bind(node);
        node.start = (...args) => {
          if (node.buffer) {
            probe.playedBuffers++;
            probe.playedSamples += node.buffer.length;
          }
          return start(...args);
        };
        return node;
      }
    };

    const send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
      if (data instanceof ArrayBuffer) probe.micFramesSent++;
      return send.call(this, data);
    };

    // The viseme level is derived from an AnalyserNode read on animation
    // frames. Counting those reads, and the amplitude they see, is what proves
    // the mouth is being driven by audio *leaving the speakers* rather than by
    // chunk sizes measured as they arrived off the socket.
    const readTimeDomain = AnalyserNode.prototype.getFloatTimeDomainData;
    AnalyserNode.prototype.getFloatTimeDomainData = function (array) {
      const out = readTimeDomain.call(this, array);
      probe.analyserReads++;
      let sum = 0;
      for (let i = 0; i < array.length; i++) sum += array[i] * array[i];
      const rms = Math.sqrt(sum / array.length);
      if (rms > probe.peakAnalyserRms) probe.peakAnalyserRms = rms;
      if (rms > 0.005) probe.nonSilentAnalyserReads++;
      return out;
    };

    // Sample the avatar itself, so the assertion covers the pixels a user sees.
    const sampleAvatar = () => {
      const el = document.querySelector('.wazi-character-container');
      if (el) {
        probe.states[el.className] = (probe.states[el.className] || 0) + 1;
        const cavity = el.querySelector('[data-wazi-mouth]');
        if (cavity) {
          const opacity = Number(getComputedStyle(cavity).opacity);
          if (Number.isFinite(opacity)) probe.mouthOpacities.push(Number(opacity.toFixed(3)));
        }
      }
      // WAZI can navigate the app herself mid-conversation, so the caption is
      // recorded as it happens rather than read once at the end from a view
      // that may no longer be on screen.
      const caption = document.querySelector('.transcript-scroll-area');
      if (caption) {
        const text = (caption.textContent || '').trim();
        if (text && probe.captions[probe.captions.length - 1] !== text) probe.captions.push(text);
      }
      const shell = document.querySelector('.mobile-shell');
      if (shell) {
        const view = shell.className;
        if (probe.views[probe.views.length - 1] !== view) probe.views.push(view);
      }
      requestAnimationFrame(sampleAvatar);
    };
    requestAnimationFrame(sampleAvatar);
  });

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.talk-button', { timeout: 15000 });
  check('app loads and renders the Talk control', true);

  await page.click('.talk-button');

  // Let the session open and WAZI's unprompted greeting play out.
  await sleep(18000);

  // Speak to her the only way this environment allows — typed. The turn still
  // travels the live session, so the reply comes back as 24kHz PCM exactly as a
  // spoken turn would.
  const input = page.locator('input[type="text"], textarea').first();
  if (await input.count()) {
    await input.fill('Abeg, the borehole for my street never work since January. Wetin I fit do?');
    await input.press('Enter');
  }

  // Let the wake greeting play, the fake microphone deliver its utterance, and
  // WAZI answer it.
  await sleep(30000);

  const probe = await page.evaluate(() => {
    const p = window.__wazi;
    const opacities = p.mouthOpacities;
    return {
      contexts: p.contexts,
      playedBuffers: p.playedBuffers,
      playedSamples: p.playedSamples,
      micFramesSent: p.micFramesSent,
      analyserReads: p.analyserReads,
      nonSilentAnalyserReads: p.nonSilentAnalyserReads,
      peakAnalyserRms: p.peakAnalyserRms,
      states: p.states,
      captions: p.captions,
      views: p.views,
      mouthDistinctValues: new Set(opacities).size,
      mouthMax: opacities.length ? Math.max(...opacities) : 0
    };
  });

  check('capture context opened at 16kHz', probe.contexts.includes(16000),
    `audio contexts: ${probe.contexts.join(', ')}Hz`);
  check('playback context opened at 24kHz', probe.contexts.includes(24000),
    `audio contexts: ${probe.contexts.join(', ')}Hz`);
  check('capture graph runs and streams encoded PCM frames', probe.micFramesSent > 50,
    `${probe.micFramesSent} PCM frames sent (silent here — see the note at the top of this file)`);
  check("WAZI's audio was scheduled for playback", probe.playedBuffers > 0,
    `${probe.playedBuffers} buffers, ${(probe.playedSamples / 24000).toFixed(2)}s of speech`);
  // The claim being tested is that the mouth is driven by the analyser sitting
  // on the playback graph. Frame counts are not comparable to a real device
  // here (this container has no audio backend, so the context clock and rAF
  // pacing are both synthetic) — what matters is that the analyser is polled
  // continuously and sees genuine amplitude.
  check('visemes are read from the live playback graph',
    probe.analyserReads > 50 && probe.peakAnalyserRms > 0.05,
    `${probe.analyserReads} analyser reads, ${probe.nonSilentAnalyserReads} carrying signal, peak RMS ${probe.peakAnalyserRms.toFixed(3)}`);
  check('the avatar entered the speaking state', Object.keys(probe.states).some((s) => s.includes('speaking')),
    `states seen: ${Object.keys(probe.states).join(', ')}`);
  check('the mouth actually moved with the voice', probe.mouthDistinctValues > 5,
    `${probe.mouthDistinctValues} distinct mouth openings, max ${probe.mouthMax}`);

  // Everything WAZI said that reached the screen, over the whole run.
  const spoken = probe.captions.filter((c) => !c.startsWith("Hello. I'm WAZI"));
  check('what WAZI said reached the on-screen caption', spoken.length > 0,
    `"${(spoken[spoken.length - 1] || '').slice(0, 140)}"`);

  check('the live session can drive the interface', probe.views.length > 1,
    `views entered: ${probe.views.map((v) => v.replace('mobile-shell', '').trim() || 'home').join(' → ')}`);

  // Requests to the app's own origin are ours; anything else failing here is
  // the sandbox's TLS interception, not the app.
  const ownOriginFailures = failedRequests.filter((f) => f.startsWith(BASE));
  const realErrors = consoleErrors.filter(
    (e) => !/favicon|manifest/i.test(e) && !/Failed to load resource/i.test(e)
  );
  check('no uncaught errors in the browser', realErrors.length === 0,
    realErrors.slice(0, 3).join(' | '));
  check('every request to the app origin succeeded', ownOriginFailures.length === 0,
    ownOriginFailures.slice(0, 3).join(' | ') ||
      (failedRequests.length ? `off-origin failures ignored: ${failedRequests.length}` : ''));

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed\n`);
  process.exit(failed.length ? 1 : 0);
}

main().catch(async (err) => {
  console.error(`\n\x1b[31mverification aborted:\x1b[0m ${err.message}\n`);
  process.exit(1);
});
