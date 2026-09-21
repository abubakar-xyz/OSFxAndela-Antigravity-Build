/* WAZI Civic — PCM conversion helpers.
 *
 * The live pipeline does not resample in JavaScript on any mainstream browser:
 * capture runs in an AudioContext opened at 16kHz and playback in one opened at
 * 24kHz, so the browser's native resampler handles both ends. What remains here
 * is the fallback for a browser that ignores a requested sample rate, plus the
 * format conversions used across the app.
 */

/**
 * Linear-interpolating resampler for Int16 PCM.
 *
 * The previous implementation averaged each output sample over a bucket of
 * input samples, which divided by zero whenever a bucket came out empty
 * (upsampling, or any ratio below 1) and wrote NaN into the stream — silence at
 * best, a burst of noise at worst. Interpolation has neither failure mode and
 * is cheaper.
 *
 * This is not band-limited, so it is a fallback rather than the main path:
 * downsampling without a low-pass filter folds high frequencies back down as
 * aliasing. Acceptable for speech at 3:1; not something to route audio through
 * by choice.
 */
export function resampleInt16(
  input: Int16Array<ArrayBuffer>,
  inputRate: number,
  outputRate: number
): Int16Array<ArrayBuffer> {
  if (inputRate === outputRate || input.length === 0) return input;

  const ratio = inputRate / outputRate;
  const outLength = Math.max(1, Math.floor(input.length / ratio));
  const output = new Int16Array(new ArrayBuffer(outLength * 2));

  for (let i = 0; i < outLength; i++) {
    const position = i * ratio;
    const lower = Math.floor(position);
    const upper = Math.min(lower + 1, input.length - 1);
    const fraction = position - lower;
    output[i] = Math.round(input[lower] * (1 - fraction) + input[upper] * fraction);
  }
  return output;
}

/** Float32 [-1,1] → Int16 PCM. */
export function float32ToInt16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

/** Int16 PCM → Float32 [-1,1]. */
export function int16ToFloat32(input: Int16Array): Float32Array {
  const output = new Float32Array(input.length);
  for (let i = 0; i < input.length; i++) {
    output[i] = input[i] < 0 ? input[i] / 0x8000 : input[i] / 0x7fff;
  }
  return output;
}

/** RMS level of a Float32 buffer, 0..1. */
export function getRmsLevel(buffer: Float32Array): number {
  if (buffer.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
  return Math.sqrt(sum / buffer.length);
}
