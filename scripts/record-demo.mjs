#!/usr/bin/env node
/* WAZI Civic — records the demo walkthrough as a video, and a still of each beat.
 *
 *   npm run dev          # in one terminal
 *   npm run demo         # in another  → .cache/demo/
 *
 * It drives the real app against the real Gemini Live session, so what is
 * recorded is the product working, not a mock: WAZI greets unprompted, explains
 * a citizen's rights in the dialect she was asked in, and opens the evidence
 * board herself when the conversation warrants it.
 *
 * The container has no audio device, so the recording is silent by design — it
 * is meant to carry a voiceover. The captions on screen are real transcripts of
 * what WAZI actually said.
 */

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('\n  Needs Playwright: npm install && npx playwright install chromium\n');
  process.exit(2);
}

const BASE = process.env.WAZI_VERIFY_URL || 'http://localhost:8080';
const OUT = process.env.WAZI_DEMO_OUT || '.cache/demo';
const W = 1280;
const H = 800;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

let beat = 0;
const say = (msg) => console.log(`  ${String(++beat).padStart(2, '0')}  ${msg}`);

/** Scrolls in small steps so the recording glides instead of jumping. */
async function glide(page, distance, steps = 26) {
  const step = Math.round(distance / steps);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step);
    await sleep(38);
  }
}

/** Waits until WAZI has finished her turn, or the budget runs out. */
async function waitForReply(page, budgetMs = 30000) {
  const started = Date.now();
  let sawSpeaking = false;
  while (Date.now() - started < budgetMs) {
    const state = await page
      .locator('.wazi-character-container')
      .getAttribute('class')
      .catch(() => '');
    if (state?.includes('speaking')) sawSpeaking = true;
    else if (sawSpeaking && state?.includes('listening')) return true;
    await sleep(250);
  }
  return sawSpeaking;
}

async function main() {
  console.log('\n\x1b[1mRecording the WAZI demo\x1b[0m');
  console.log(`  app: ${BASE}\n`);

  const browser = await chromium.launch({
    args: [
      '--alsa-input-device=null',
      '--alsa-output-device=null',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-capture',
      '--autoplay-policy=no-user-gesture-required',
      '--hide-scrollbars'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: W, height: H },
    permissions: ['microphone'],
    recordVideo: { dir: OUT, size: { width: W, height: H } }
  });
  const page = await context.newPage();
  const shot = async (name) => page.screenshot({ path: path.join(OUT, `${name}.png`) });

  // ── Beat 1: she opens the app
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('.talk-button', { timeout: 15000 });
  await sleep(2600);
  say('home — WAZI at rest');
  await shot('01-home');

  // ── Beat 2: one tap, and WAZI is listening
  await page.locator('.talk-button').click();
  await sleep(1400);
  say('connecting — microphone and live session opening');
  await shot('02-connecting');

  await waitForReply(page, 26000);
  await sleep(900);
  say('WAZI greets her first, unprompted');
  await shot('03-greeting');
  await sleep(1600);

  // ── Beat 3: she asks what a right she has never used actually is.
  //
  // This is the everyday case, and the one most civic tools skip: not a
  // scandal, just someone who wants to understand how the system works and has
  // nobody to ask. WAZI teaches here — she does not open an investigation.
  const input = page.locator('input[type="text"]').first();
  await input.click();
  await input.type('Abeg, wetin be dis FOI ting I dey hear people talk about?', { delay: 46 });
  await sleep(700);
  say('she asks what a right she has never used actually is — in Pidgin');
  await shot('04-question');
  await input.press('Enter');

  await waitForReply(page, 34000);
  await sleep(1200);
  say('WAZI answers in the same dialect, and the language pill follows her');
  await shot('05-answer-pidgin');
  await sleep(2400);

  // ── Beat 4: now the thing she actually walked past
  await input.click();
  await input.type('The health centre for my area — dem talk say e don complete, but e no get roof at all.', { delay: 38 });
  await sleep(700);
  say('she describes the health centre');
  await shot('06-describes-case');
  await input.press('Enter');

  // ── Beat 5: WAZI decides what to do about it.
  //
  // She has two reasonable moves here and takes either depending on the turn:
  // ask to SEE the place, or go straight to the record. The demo follows her
  // rather than forcing one, because a scripted path that fights the model is
  // not a demo of the product.
  const wentToBoard = await page
    .waitForFunction(
      () => {
        const shell = document.querySelector('.mobile-shell')?.className || '';
        const camera = /Show WAZI/i.test(document.body.innerText);
        return shell.includes('workspace-mode') || camera;
      },
      { timeout: 45000 }
    )
    .then(() => true)
    .catch(() => false);

  await sleep(1800);
  const cameraOpen = await page.locator('text=/Show WAZI/i').count();

  if (cameraOpen) {
    // She asked to see it. Show her.
    say('WAZI asks to see it — the camera opens on her say-so');
    await shot('07a-camera');
    await sleep(2000);

    const loadSignboard = page.locator('text=/Load Signboard/i').first();
    if (await loadSignboard.count()) {
      await loadSignboard.click();
      await sleep(6500);
      say('the signboard is read — clues extracted, location data already stripped');
      await shot('07b-clues');
      await sleep(2600);
    }
    const confirm = page.locator('button').filter({ hasText: /confirm|verify|continue|check these/i }).first();
    if (await confirm.count()) await confirm.click();
    await sleep(2000);
  } else if (wentToBoard) {
    say('the evidence board opens on its own — no button was pressed');
    await shot('07-searching');
  }

  await page
    .waitForFunction(
      () => document.querySelector('.mobile-shell')?.className.includes('workspace-mode'),
      { timeout: 30000 }
    )
    .catch(() => {});
  await sleep(6500);
  say('the record is retrieved and compared');
  await shot('08-evidence-top');
  await sleep(1800);

  // ── Beat 6: record against reality
  await glide(page, 620);
  await sleep(2200);
  say('official record beside observed reality, claim by claim');
  await shot('09-record-vs-reality');
  await glide(page, 620);
  await sleep(2200);
  await shot('10-evidence-sources');
  await sleep(1400);

  // ── Beat 7: the adversarial pass
  const checkAgain = page.locator('button').filter({ hasText: /check again/i }).first();
  if (await checkAgain.count()) {
    await checkAgain.scrollIntoViewIfNeeded();
    await sleep(700);
    say('"check again" — an adversarial pass that tries to break the finding');
    await checkAgain.click();
    await sleep(7500);
    await shot('11-check-again');
    await sleep(1600);
  }

  // ── Beat 8: the letter
  const toDraft = page.locator('button').filter({ hasText: /^Draft Studio$/i }).first();
  if (await toDraft.count()) {
    await toDraft.scrollIntoViewIfNeeded();
    await sleep(500);
    await toDraft.click();
  }
  await sleep(3400);
  say('the draft studio — an FOI request, not a complaint');
  await shot('12-draft-top');
  await sleep(2000);
  await glide(page, 560);
  await sleep(2400);
  await shot('13-draft-letter');
  await glide(page, 720);
  await sleep(2400);
  await shot('14-draft-body');
  await sleep(1400);

  // ── Beat 9: somewhere to send it
  const dispatch = page.locator('button').filter({ hasText: /open email app/i }).first();
  if (await dispatch.count()) {
    await dispatch.scrollIntoViewIfNeeded();
    await sleep(800);
    say('dispatch — pre-addressed to the named officer, for her to review');
    await dispatch.click({ timeout: 10000 }).catch(() => {});
    await sleep(3000);
    await shot('15-dispatch');
    await sleep(2200);
    await page.keyboard.press('Escape').catch(() => {});
    await sleep(1200);
  }

  await sleep(1800);
  say('done');

  await context.close(); // the video is written on close
  await browser.close();

  // Playwright names the file by an internal id; give it a name a human wants.
  const videos = fs.readdirSync(OUT).filter((f) => f.endsWith('.webm'));
  if (videos.length) {
    const newest = videos
      .map((f) => ({ f, t: fs.statSync(path.join(OUT, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t)[0].f;
    const target = path.join(OUT, 'wazi-demo.webm');
    if (path.join(OUT, newest) !== target) fs.renameSync(path.join(OUT, newest), target);
    const mb = (fs.statSync(target).size / 1e6).toFixed(1);
    console.log(`\n  video   ${target}  (${mb} MB)`);
  }
  console.log(`  stills  ${OUT}/01-home.png … \n`);
}

main().catch((err) => {
  console.error(`\n\x1b[31mrecording failed:\x1b[0m ${err.message}\n`);
  process.exit(1);
});
