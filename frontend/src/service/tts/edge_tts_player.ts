import { TTSOptions } from 'src/service/tts/tts_player'
import { BaseTTSPlayer } from 'src/service/tts/base_tts_player';

/**
 * TTS Player
 *
 * @version 1.0
 */
export class EdgeTTSPlayer extends BaseTTSPlayer {
  private audioContext: AudioContext;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private pauseOffset: number = 0;
  private startTime: number = 0;

  constructor(options: TTSOptions) {
    super(options);
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async speak(text: string): Promise<void> {
    await this.stop();
    const audioData = await this.fetchAudio(text);
    this.audioBuffer = await this.audioContext.decodeAudioData(audioData);
    return this.play();
  }

  private async fetchAudio(content: string): Promise<ArrayBuffer> {
    // 实现 Edge TTS 的 API 调用逻辑
    // 示例代码，需替换为实际 API 调用
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

  async play(startOffset: number = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
      this.startTime = this.audioContext.currentTime - startOffset;
      this.sourceNode.start(0, startOffset);

      this.sourceNode.onended = () => resolve();
    });
  }

  async stop(): Promise<void> {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
      this.pauseOffset = 0;
    }
    return Promise.resolve();
  }

  async pause(): Promise<void> {
    if (this.sourceNode) {
      this.pauseOffset = this.audioContext.currentTime - this.startTime;
      this.sourceNode.stop();
      this.sourceNode = null;
    }
  }

  async resume(): Promise<void> {
    if (this.audioBuffer) {
      return this.play(this.pauseOffset);
    }
    return Promise.resolve();
  }
}
