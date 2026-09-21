/* WAZI Civic — short-lived parking for live sessions across a dropped connection.
 *
 * THE PROBLEM THIS SOLVES
 *
 * The people this app is for are on mobile data in places where it drops: a
 * lift, a tunnel, a bus, a power cut at the mast. Without this, every one of
 * those moments ends the conversation. The browser reconnects, a brand new
 * Gemini session opens, and WAZI has forgotten the case they were in the middle
 * of describing — so the user has to start over, which is exactly the friction
 * this product exists to remove.
 *
 * With it, a browser that comes back within the grace window reclaims the same
 * Gemini session, with its full context intact, and WAZI simply carries on.
 *
 * KEYED, NOT GLOBAL
 *
 * Sessions are parked under a per-browser id rather than in a module-level
 * variable. A single global works for one user on a laptop and silently hands
 * one person's conversation to the next visitor as soon as two people use the
 * deployment at once.
 */

const GRACE_MS = 20_000;
const MAX_PARKED = 50; // a bound, so a flood of drops cannot exhaust memory

/** @type {Map<string, {holder: object, timer: NodeJS.Timeout, parkedAt: number}>} */
const parked = new Map();

/**
 * Parks a live session for `GRACE_MS`, after which it is closed for good.
 * @param {string} id      the browser's session id
 * @param {object} holder  { session, sink, backlog, model, persona }
 * @param {(...a:any[])=>void} log
 */
export function park(id, holder, log = () => {}) {
  if (!id || !holder?.session) return false;

  // Evict the oldest rather than refuse the newest: a caller who just dropped
  // is more likely to come back than one who dropped a while ago.
  if (parked.size >= MAX_PARKED && !parked.has(id)) {
    const oldest = [...parked.entries()].sort((a, b) => a[1].parkedAt - b[1].parkedAt)[0];
    if (oldest) {
      log(`vault full — evicting ${oldest[0]}`);
      discard(oldest[0]);
    }
  }

  discard(id); // never leak a previous park under the same id

  // Detach the message sink. Anything the model says while nobody is listening
  // is held in the holder's backlog and replayed if the browser comes back.
  holder.sink = null;

  const timer = setTimeout(() => {
    parked.delete(id);
    log(`grace period expired for ${id} — closing Gemini session`);
    try { holder.session.close(); } catch { /* already gone */ }
  }, GRACE_MS);
  timer.unref?.();

  parked.set(id, { holder, timer, parkedAt: Date.now() });
  log(`parked session ${id} for ${GRACE_MS / 1000}s`);
  return true;
}

/**
 * Reclaims a parked session, if one is still waiting under this id.
 * @returns {object|null} the holder, or null
 */
export function claim(id) {
  if (!id) return null;
  const entry = parked.get(id);
  if (!entry) return null;
  clearTimeout(entry.timer);
  parked.delete(id);
  return entry.holder;
}

/** Closes and forgets a parked session immediately. */
export function discard(id) {
  const entry = parked.get(id);
  if (!entry) return;
  clearTimeout(entry.timer);
  parked.delete(id);
  try { entry.holder.session.close(); } catch { /* already gone */ }
}

/** Closes every parked session — used on shutdown. */
export function drain() {
  for (const id of [...parked.keys()]) discard(id);
}

export const GRACE_PERIOD_MS = GRACE_MS;
