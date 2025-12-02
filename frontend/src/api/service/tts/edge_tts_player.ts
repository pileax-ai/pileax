import { TTSOptions } from 'src/api/service/tts'
import { BaseTTSPlayer } from 'src/api/service/tts/base_tts_player';
import { edgeService } from 'src/api/service/remote/edge'
import { sleep } from 'core/utils/misc'

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
  private currentController: AbortController | null = null;

  constructor(options: TTSOptions) {
    super(options);
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async preload(text: string): Promise<void> {
    const audioData = await this.fetchAudio(text);
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    this.preloadQueue.set(text, audioBuffer);
  }

  async speak(text: string): Promise<void> {
    await this.stop(false);

    this.audioBuffer = null;
    const audioData = await this.fetchAudio(text);
    this.audioBuffer = await this.audioContext.decodeAudioData(audioData);

    await this.playBuffer(0);
    return Promise.resolve();
  }

  private async fetchAudio(text: string): Promise<ArrayBuffer> {
    if (this.currentController) {
      this.currentController.abort();
    }

    this.currentController = new AbortController();
    const body = {
      text: text.replace(/<[^>]+>/g, ""),
      voice: 'zh-CN-XiaoxiaoNeural',
      rate: '+0%'
    };
    const res = await edgeService.tts(body, 'arraybuffer', this.currentController);
    return res.data;
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
        console.log('onended', this.continuous, new Date().getTime() / 1000)
        this.state = 'idle';
        resolve();
      };
    });
  }

  async stop(reset = true): Promise<void> {
    if (reset) {
      console.log('stop reset', reset, new Date().getTime() / 1000)
      this.stopContinuous()
    }

    // 1. Abort request
    if (this.currentController) {
      await this.currentController.abort();
      this.currentController = null;
    }

    // 2. Stop playing
    if (this.sourceNode) {
      await this.sourceNode.stop();
      await this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    this.pauseOffset = 0;

    // wait for onended triggered
    await sleep(10);

    return Promise.resolve();
  }

  async pause(): Promise<void> {
    this.stopContinuous();

    // 1. Abort request
    if (this.currentController) {
      this.currentController.abort();
      this.currentController = null;
    }

    if (!this.sourceNode) return;
    this.pauseOffset = this.audioContext.currentTime - this.startTime;
    this.sourceNode.stop();
    this.sourceNode = null;
    this.state = 'paused';
  }

  async resume(): Promise<void> {
    if (this.audioBuffer) {
      this.state = 'playing';
      await this.playBuffer(this.pauseOffset);
      this.playNext();
    } else {
      this.playResume();
    }
    return Promise.resolve();
  }
}
