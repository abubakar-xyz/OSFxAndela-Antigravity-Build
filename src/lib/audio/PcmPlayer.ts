/* WAZI Civic — streaming PCM playback with playback-time viseme extraction.
 *
 * WHY THIS IS ITS OWN UNIT
 *
 * The previous build measured the RMS of each audio chunk at the moment it
 * *arrived* from the socket and fed that straight to the avatar's mouth. But an
 * arriving chunk is not a playing chunk: it is scheduled behind everything
 * already queued, which at the start of a sentence is most of the sentence. So
 * the mouth moved for audio that would not be heard for another second, and
 * went still while WAZI was still talking. That desync is most of what made the
 * character read as a puppet rather than a speaker.
 *
 * The fix is to stop measuring the data and start measuring the *output*: an
 * AnalyserNode sits on the playback graph and is sampled on animation frames,
 * so the level the avatar sees is, by construction, the level leaving the
 * speakers at that instant.
 */

const MIN_LEAD_SECONDS = 0.08;   // jitter cushion before the first scheduled frame
const FADE_SECONDS = 0.015;      // de-click ramp when cutting playback off
const ANALYSER_FFT = 512;
// How long the queue must stay empty before we accept that the turn is over.
// Chunks arrive in bursts with gaps between them, so the set of live sources
// empties briefly many times inside a single sentence.
const DRAIN_GRACE_MS = 220;

export interface PcmPlayerEvents {
  /** Fires when audio actually starts and stops leaving the speakers. */
  onSpeakingChange?: (speaking: boolean) => void;
}

export class PcmPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private scratch = new Float32Array(new ArrayBuffer(ANALYSER_FFT * 4));

  private sources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;
  private speaking = false;
  private rafId: number | null = null;
  private drainTimer: ReturnType<typeof setTimeout> | null = null;

  /** Smoothed 0..1 amplitude of what is leaving the speakers right now. */
  public level = 0;

  private readonly sampleRate: number;
  private readonly events: PcmPlayerEvents;

  constructor(sampleRate: number, events: PcmPlayerEvents = {}) {
    this.sampleRate = sampleRate;
    this.events = events;
  }

  /**
   * Must be called from a user gesture. Browsers start an AudioContext
   * suspended otherwise, which shows up as WAZI connecting fine and then
   * appearing completely mute.
   */
  async resume(): Promise<void> {
    if (!this.ctx) {
      this.ctx = new AudioContext({ sampleRate: this.sampleRate });
      this.master = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = ANALYSER_FFT;
      // Our own envelope below is what the avatar reads, so the analyser itself
      // stays fast and unsmoothed.
      this.analyser.smoothingTimeConstant = 0;
      this.scratch = new Float32Array(new ArrayBuffer(this.analyser.fftSize * 4));

      this.master.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.nextStartTime = this.ctx.currentTime;
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
  }

  /** True once the context exists and is running. */
  get ready(): boolean {
    return this.ctx?.state === 'running';
  }

  /**
   * Schedules one PCM16 chunk to play immediately after everything already
   * queued, so consecutive chunks join without a seam.
   */
  enqueue(pcm: Int16Array): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || pcm.length === 0) return;

    const frames = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) {
      // Int16 is asymmetric: -32768..32767. Scaling each sign by its own
      // magnitude keeps silence at exactly zero and avoids a DC offset.
      frames[i] = pcm[i] < 0 ? pcm[i] / 0x8000 : pcm[i] / 0x7fff;
    }

    const buffer = ctx.createBuffer(1, frames.length, this.sampleRate);
    buffer.getChannelData(0).set(frames);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.master);

    // If the queue has drained (network hiccup, or this is the first chunk of a
    // turn) restart the clock with a small cushion instead of scheduling in the
    // past, which the browser would play all at once as a burst.
    const earliest = ctx.currentTime + MIN_LEAD_SECONDS;
    const startAt = Math.max(earliest, this.nextStartTime);
    source.start(startAt);
    this.nextStartTime = startAt + buffer.duration;

    this.sources.add(source);
    source.onended = () => {
      this.sources.delete(source);
      if (this.sources.size === 0) this.scheduleDrainCheck();
    };

    this.cancelDrainCheck();
    this.setSpeaking(true);
  }

  /**
   * Barge-in: the user started talking over WAZI. Everything queued is now
   * stale and must not be heard, including chunks already scheduled seconds out.
   */
  interrupt(): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;

    // Ramp the master down first; stopping mid-waveform produces an audible click.
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);

    for (const source of this.sources) {
      try {
        source.onended = null;
        source.stop(now + FADE_SECONDS);
      } catch {
        /* already stopped */
      }
    }
    this.sources.clear();
    this.cancelDrainCheck();
    this.nextStartTime = now + FADE_SECONDS;

    // Restore the gain just after the ramp so the next turn is audible.
    this.master.gain.setValueAtTime(1, now + FADE_SECONDS + 0.001);
    this.setSpeaking(false);
  }

  /** Seconds of audio still queued ahead of the playhead. */
  get queuedSeconds(): number {
    if (!this.ctx) return 0;
    return Math.max(0, this.nextStartTime - this.ctx.currentTime);
  }

  async close(): Promise<void> {
    this.cancelDrainCheck();
    this.stopMeter();
    this.interrupt();
    const ctx = this.ctx;
    this.ctx = null;
    this.master = null;
    this.analyser = null;
    this.sources.clear();
    this.level = 0;
    if (ctx) await ctx.close().catch(() => {});
  }

  // ───────────────────────────────────────────────── level metering

  /**
   * A gap between chunks is not the end of a turn. Declaring one would stop the
   * viseme meter and drop the avatar's mouth shut mid-sentence, then restart it
   * on the next chunk — which is exactly what the browser verification caught:
   * six seconds of speech produced sixteen animation-frame reads instead of
   * several hundred.
   */
  private scheduleDrainCheck(): void {
    this.cancelDrainCheck();
    this.drainTimer = setTimeout(() => {
      this.drainTimer = null;
      if (this.sources.size === 0 && this.queuedSeconds <= 0) this.setSpeaking(false);
    }, DRAIN_GRACE_MS);
  }

  private cancelDrainCheck(): void {
    if (this.drainTimer !== null) {
      clearTimeout(this.drainTimer);
      this.drainTimer = null;
    }
  }

  private setSpeaking(next: boolean): void {
    if (this.speaking === next) return;
    this.speaking = next;
    this.events.onSpeakingChange?.(next);
    if (next) this.startMeter();
    else this.stopMeter();
  }

  private startMeter(): void {
    if (this.rafId !== null || typeof requestAnimationFrame === 'undefined') return;
    const tick = () => {
      this.rafId = requestAnimationFrame(tick);
      const analyser = this.analyser;
      if (!analyser) return;

      analyser.getFloatTimeDomainData(this.scratch);
      let sum = 0;
      for (let i = 0; i < this.scratch.length; i++) sum += this.scratch[i] * this.scratch[i];
      const rms = Math.sqrt(sum / this.scratch.length);

      // Speech RMS mostly lives in the bottom quarter of the range, so it is
      // expanded before it drives a mouth. Fast attack, slower release: lips
      // snap open on a plosive and close smoothly, which is how mouths behave.
      const target = Math.min(1, rms * 3.2);
      const coefficient = target > this.level ? 0.55 : 0.18;
      this.level += (target - this.level) * coefficient;
      if (this.level < 0.001) this.level = 0;
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopMeter(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.level = 0;
  }
}
