// AudioWorkletProcessor to capture raw audio chunks from the microphone

class MicProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048; // Chunk size
    this.buffer = new Float32Array(this.bufferSize);
    this.bytesWritten = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      
      for (let i = 0; i < channelData.length; i++) {
        this.buffer[this.bytesWritten] = channelData[i];
        this.bytesWritten++;

        if (this.bytesWritten >= this.bufferSize) {
          // Send full buffer to the main thread
          this.port.postMessage(this.buffer);
          
          // Reset buffer
          this.buffer = new Float32Array(this.bufferSize);
          this.bytesWritten = 0;
        }
      }
    }
    return true; // Keep processor alive
  }
}

registerProcessor('mic-processor', MicProcessor);
