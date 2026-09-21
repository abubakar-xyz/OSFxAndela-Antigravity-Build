/* WAZI Civic — microphone capture at Gemini's input rate.
 *
 * WHY THERE IS NO RESAMPLER IN THE HOT PATH
 *
 * The previous build opened an AudioContext at the device rate (usually 48kHz)
 * and downsampled every frame to 16kHz in JavaScript with a box average — no
 * anti-aliasing filter, a divide-by-zero when a bucket came out empty, and a
 * main-thread cost paid fifty times a second on the exact devices least able to
 * afford it.
 *
 * Asking for `new AudioContext({ sampleRate: 16000 })` hands the whole problem
 * to the browser's own resampler, which is filtered, native, and free. Chrome,
 * Firefox and current Safari all honour it. A browser that silently ignores the
 * request is caught by the rate the worklet reports back, and only then does a
 * JS fallback engage.
 */

import { INPUT_SAMPLE_RATE } from '../live-protocol';
import { resampleInt16 } from '../../utils/audio';

// A microphone cannot produce more than one second of audio per second. If a
// device or driver ever free-runs faster than realtime (virtual devices and
// some Android audio HALs do), forwarding every frame would flood the Live API
// with minutes of audio in seconds — billed, rate-limited, and pointless.
// Frames beyond this much lead over wall-clock are dropped.
const MAX_LEAD_SECONDS = 1.5;

export interface MicCaptureEvents {
  /** One 20ms PCM16LE frame, already at INPUT_SAMPLE_RATE, ready for the wire. */
  onFrame: (pcm: Int16Array) => void;
  /** Smoothed 0..1 input level, for the listening animation. */
  onLevel?: (level: number) => void;
}

export class MicCapture {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private node: AudioWorkletNode | null = null;
  private sink: GainNode | null = null;

  private actualRate = INPUT_SAMPLE_RATE;
  private level = 0;
  private startedAt = 0;
  private sentSeconds = 0;
  private warnedAboutRate = false;

  private readonly events: MicCaptureEvents;

  constructor(events: MicCaptureEvents) {
    this.events = events;
  }

  /** True when the browser gave us the rate we asked for. */
  get nativeRate(): boolean {
    return this.actualRate === INPUT_SAMPLE_RATE;
  }

  get sampleRate(): number {
    return this.actualRate;
  }

  async start(workletUrl = '/audio-processor.js'): Promise<void> {
    // Echo cancellation is the browser's job and it does it against the real
    // speaker output, which is the only place the information exists. The old
    // client-side "echo gate" muted the microphone outright whenever WAZI was
    // speaking — which also made it impossible to interrupt her, and left the
    // barge-in handling downstream permanently dead code.
    this.startedAt = performance.now();
    this.sentSeconds = 0;

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1
      }
    });

    const ctx = new AudioContext({ sampleRate: INPUT_SAMPLE_RATE });
    this.ctx = ctx;
    if (ctx.state === 'suspended') await ctx.resume();

    await ctx.audioWorklet.addModule(workletUrl);

    this.source = ctx.createMediaStreamSource(this.stream);
    this.node = new AudioWorkletNode(ctx, 'mic-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });

    this.node.port.onmessage = (event) => this.handleWorkletMessage(event.data);
    this.source.connect(this.node);

    // The worklet produces no output, but some browsers stop pulling on a node
    // that reaches no sink. A muted gain keeps the graph running without
    // routing the microphone back to the speakers — which is what the previous
    // build did by connecting the processor straight to `destination`.
    this.sink = ctx.createGain();
    this.sink.gain.value = 0;
    this.node.connect(this.sink);
    this.sink.connect(ctx.destination);
  }

  /** Stops sending audio without tearing the graph down. */
  setMuted(muted: boolean): void {
    this.node?.port.postMessage({ type: 'mute', muted });
    if (muted) {
      this.level = 0;
      this.events.onLevel?.(0);
    }
  }

  async stop(): Promise<void> {
    this.node?.port.close();
    this.source?.disconnect();
    this.node?.disconnect();
    this.sink?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());

    const ctx = this.ctx;
    this.ctx = null;
    this.stream = null;
    this.source = null;
    this.node = null;
    this.sink = null;
    this.level = 0;
    if (ctx) await ctx.close().catch(() => {});
  }

  private handleWorkletMessage(data: { type: string; sampleRate?: number; pcm?: ArrayBuffer }): void {
    if (data.type === 'rate') {
      this.actualRate = data.sampleRate ?? INPUT_SAMPLE_RATE;
      if (!this.nativeRate) {
        console.warn(
          `[wazi] browser ignored the 16kHz request and gave ${this.actualRate}Hz; ` +
            'resampling each frame in JS as a fallback.'
        );
      }
      return;
    }

    if (data.type !== 'frame' || !data.pcm) return;

    let pcm: Int16Array<ArrayBuffer> = new Int16Array(data.pcm);
    if (!this.nativeRate) pcm = resampleInt16(pcm, this.actualRate, INPUT_SAMPLE_RATE);

    const elapsed = (performance.now() - this.startedAt) / 1000;
    if (this.sentSeconds > elapsed + MAX_LEAD_SECONDS) {
      if (!this.warnedAboutRate) {
        this.warnedAboutRate = true;
        console.warn(
          '[wazi] the capture device is producing audio faster than realtime; ' +
            'throttling to protect the live session.'
        );
      }
      return;
    }
    this.sentSeconds += pcm.length / INPUT_SAMPLE_RATE;

    // Level for the listening animation. Cheap enough to do per frame and it
    // saves a second analyser node on the capture graph.
    let sum = 0;
    for (let i = 0; i < pcm.length; i++) {
      const v = pcm[i] / 0x8000;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / (pcm.length || 1));
    const target = Math.min(1, rms * 4);
    this.level += (target - this.level) * (target > this.level ? 0.5 : 0.12);
    this.events.onLevel?.(this.level);

    this.events.onFrame(pcm);
  }
}
