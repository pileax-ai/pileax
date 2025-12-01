import { TTSOptions } from 'src/api/service/tts'
import { BaseTTSPlayer } from 'src/api/service/tts/base_tts_player';

/**
 * TTS Player
 *
 * @version 1.0
 */
export class EdgeTTSPlayer extends BaseTTSPlayer {
  private audioContext: AudioContext;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private startTime: number = 0;
  private pauseOffset: number = 0;

  constructor(options: TTSOptions) {
    super(options);
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async speak(text: string): Promise<void> {
    await this.stop();

    const audioData = await this.fetchAudio(text);
    this.audioBuffer = await this.audioContext.decodeAudioData(audioData);

    return this.playBuffer(0);
  }

  private async fetchAudio(content: string): Promise<ArrayBuffer> {
    const response = await fetch('EDGE_TTS_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: content,
        ...this.options
      })
    });

    return response.arrayBuffer();
  }

  async playBuffer(startOffset: number = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);

      this.startTime = this.audioContext.currentTime - startOffset;
      this.sourceNode.start(0, startOffset);

      this.state = 'playing';

      this.sourceNode.onended = () => {
        this.state = 'idle';
        resolve();
      };
    });
  }

  async stop(): Promise<void> {
    this.stopContinuous();

    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    this.pauseOffset = 0;
  }

  async pause(): Promise<void> {
    if (!this.sourceNode) return;
    this.pauseOffset = this.audioContext.currentTime - this.startTime;
    this.sourceNode.stop();
    this.sourceNode = null;
    this.state = 'paused';
  }

  async resume(): Promise<void> {
    if (!this.audioBuffer) return;
    this.state = 'playing';
    return this.playBuffer(this.pauseOffset);
  }
}
