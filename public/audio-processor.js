/* WAZI Civic — microphone capture worklet.
 *
 * Runs on the audio thread. Its only job is to cut the incoming stream into
 * fixed 20ms frames and hand them to the main thread as PCM16, already encoded.
 *
 * Two decisions worth knowing about:
 *
 *  - The AudioContext is created at 16000 Hz by the caller, so `sampleRate`
 *    here is already Gemini's input rate and there is no resampling to do. The
 *    browser's own resampler sits between the microphone hardware and this
 *    node, and it is a far better one than anything we would write in JS.
 *    The real rate is posted back on startup, so the main thread can fall back
 *    to resampling if the browser ignored the request (older Safari).
 *
 *  - Float32 is converted to Int16 here rather than on the main thread, and the
 *    buffer is transferred rather than copied. At 50 frames a second on a
 *    low-end Android phone, halving the bytes and skipping the copy is the
 *    difference between a smooth avatar and a stuttering one.
 */

const FRAME_MS = 20;

class MicProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.frameSize = Math.round((sampleRate * FRAME_MS) / 1000);
    this.buffer = new Int16Array(this.frameSize);
    this.written = 0;
    this.muted = false;

    this.port.postMessage({ type: 'rate', sampleRate });

    this.port.onmessage = (event) => {
      // Used when the user mutes: we keep the graph alive (tearing down and
      // rebuilding an AudioContext mid-conversation costs hundreds of ms and
      // re-prompts for permission on some browsers) but stop emitting.
      if (event.data?.type === 'mute') this.muted = Boolean(event.data.muted);
    };
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true; // input not connected yet — stay alive

    if (this.muted) {
      this.written = 0;
      return true;
    }

    for (let i = 0; i < channel.length; i++) {
      // Clamp before scaling: a sample above 1.0 (possible with autoGainControl)
      // would otherwise wrap around and land as a loud click at the far extreme.
      const s = Math.max(-1, Math.min(1, channel[i]));
      this.buffer[this.written++] = s < 0 ? s * 0x8000 : s * 0x7fff;

      if (this.written === this.frameSize) {
        const frame = this.buffer;
        this.buffer = new Int16Array(this.frameSize);
        this.written = 0;
        this.port.postMessage({ type: 'frame', pcm: frame.buffer }, [frame.buffer]);
      }
    }
    return true;
  }
}

registerProcessor('mic-processor', MicProcessor);
