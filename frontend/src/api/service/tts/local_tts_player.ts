import { TTSOptions, TTSPlayer } from 'src/api/service/tts'
import { BaseTTSPlayer } from './base_tts_player';

/**
 * Local TTS Player - 调用FastAPI后端服务
 */
export class LocalTTSPlayer extends BaseTTSPlayer {
  private audioContext: AudioContext;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private pauseOffset: number = 0;
  private startTime: number = 0;
  private isPlaying: boolean = false;
  private currentText: string = '';

  constructor(options: TTSOptions) {
    super(options);
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private async callTTSApi(text: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          lang: this.options.lang || 'zh-CN',
          rate: this.options.rate || 1.0,
          pitch: this.options.pitch || 1.0,
          volume: this.options.volume || 1.0,
          voice: this.options.voiceName,
          gender: this.options.voiceGender,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('TTS API call failed:', error);
      throw new Error('Failed to generate speech');
    }
  }

  async speak(text: string): Promise<void> {
    await this.stop();
    this.currentText = text;

    try {
      const audioData = await this.callTTSApi(text);
      this.audioBuffer = await this.audioContext.decodeAudioData(audioData);
      await this.playAudio();
    } catch (error) {
      console.error('Failed to speak:', error);
      throw error;
    }
  }

  private async playAudio(startOffset: number = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audioBuffer) {
        reject(new Error('No audio buffer to play'));
        return;
      }

      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);

      this.startTime = this.audioContext.currentTime - startOffset;
      this.sourceNode.start(0, startOffset);
      this.isPlaying = true;

      this.sourceNode.onended = () => {
        this.isPlaying = false;
        this.sourceNode = null;
        resolve();
      };
    });
  }

  override async play(): Promise<void> {
    this.isPlaying = true;

    while (this.isPlaying) {
      try {
        const text = await this.getText();
        if (!text) break;

        await this.speak(text);

        // 自动播放下一个
        const nextText = await this.getNextText();
        if (!nextText) break;

        // 更新getText函数，使其返回下一个文本
        const originalGetText = this.getText;
        this.getText = async () => nextText;
        this.getNextText = async () => await originalGetText();

      } catch (error) {
        console.error('Playback error:', error);
        this.isPlaying = false;
        throw error;
      }
    }
  }

  async stop(reset = true): Promise<void> {
    if (reset) {
      this.stopContinuous()
    }

    this.isPlaying = false;

    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }

    this.pauseOffset = 0;
    return Promise.resolve();
  }

  async pause(): Promise<void> {
    if (this.sourceNode && this.isPlaying) {
      this.pauseOffset = this.audioContext.currentTime - this.startTime;
      this.sourceNode.stop();
      this.sourceNode = null;
      this.isPlaying = false;
    }
    return Promise.resolve();
  }

  async resume(): Promise<void> {
    if (this.audioBuffer && this.pauseOffset > 0) {
      return this.playAudio(this.pauseOffset);
    }
    return Promise.resolve();
  }

  async getVoices(): Promise<any[]> {
    try {
      const response = await fetch('http://localhost:8000/api/tts/voices');
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      return [];
    }
  }
}
