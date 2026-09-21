// Utility functions for PCM audio conversion

/**
 * Downsamples Float32Audio from the browser's sample rate to the target rate (16000 Hz).
 * Simple decimation (for demonstration) - ideally use a proper low-pass filter in production.
 */
export function resampleAudio(audioBuffer: Float32Array, inputRate: number, outputRate: number): Float32Array {
  if (inputRate === outputRate) return audioBuffer;

  const ratio = inputRate / outputRate;
  const newLength = Math.round(audioBuffer.length / ratio);
  const result = new Float32Array(newLength);
  
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    
    // Simple average of samples
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < audioBuffer.length; i++) {
      accum += audioBuffer[i];
      count++;
    }
    
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  
  return result;
}

/**
 * Converts Float32Array audio data to Int16Array (PCM 16-bit).
 */
export function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Array;
}

/**
 * Converts Int16Array (PCM 16-bit) to Float32Array for Web Audio API playback.
 */
export function int16ToFloat32(int16Array: Int16Array): Float32Array {
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    const s = int16Array[i];
    float32Array[i] = s < 0 ? s / 0x8000 : s / 0x7FFF;
  }
  return float32Array;
}

/**
 * Calculates the RMS (Root Mean Square) volume level of a Float32Array [0.0 - 1.0].
 */
export function getRmsLevel(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

/**
 * Determines if mic input should be suppressed to prevent echo.
 * Returns true when the speaker output level suggests the model would
 * hear its own voice being played back through the microphone.
 */
export function isEchoCancellable(micRms: number, speakerRms: number): boolean {
  // If speaker is producing audio and is louder than a threshold,
  // the mic is likely picking up speaker bleed
  return speakerRms > 0.02 && speakerRms > micRms * 0.8;
}
