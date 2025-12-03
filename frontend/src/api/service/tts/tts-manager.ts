import { createTTSClient, TTSMode, TTSOptions, TTSClient } from './index';

export class TTSManager {
  public client: TTSClient | null = null;

  private options: TTSOptions = {};
  private isInitialized = false;

  constructor() {
    this.mode = 'browser';
  }

  async initialize(
    getText: () => Promise<string>,
    getResumeText: () => Promise<string>,
    getNextText: (move: boolean) => Promise<string>,
    getPrevText: () => Promise<string>,
    options?: TTSOptions,
    reset?: boolean
  ): Promise<void> {
    // reset
    if (reset && this.client) {
      await this.client.dispose();
      this.client = null;
      this.isInitialized = false;
    }

    // initialize
    if (options) this.options = { ...this.options, ...options };
    this.client = createTTSClient(this.options);
    await this.client.init(getText, getResumeText, getNextText, getPrevText);
    this.isInitialized = true;
  }

  async speak(text: string): Promise<void> {
    this.ensureInitialized();
    return this.client!.speak(text);
  }

  async play(): Promise<void> {
    this.ensureInitialized();
    return this.client!.play();

  }

  async stop(): Promise<void> {
    if (this.client) {
      return this.client.stop(true);
    }
    return Promise.resolve();
  }

  async pause(): Promise<void> {
    this.ensureInitialized();
    return this.client!.pause();
  }

  async resume(): Promise<void> {
    this.ensureInitialized();
    return this.client!.resume();
  }

  async prev(): Promise<void> {
    this.ensureInitialized();
    return this.client!.prev();
  }

  async next(): Promise<void> {
    this.ensureInitialized();
    return this.client!.next();
  }

  async restart(): Promise<void> {
    this.ensureInitialized();
    return this.client!.restart();
  }


  async setOptions(options: TTSOptions): Promise<TTSOptions> {
    this.options = { ...this.options, ...options };
    this.options = await this.client!.updateOptions(options);
    return this.options;
  }


  getOptions(): TTSOptions {
    return { ...this.options };
  }

  isPlaying(): boolean {
    return this.client && 'isPlaying' in this.client
      ? (this.client as any).isPlaying
      : false;
  }

  private ensureInitialized(): void {
    if (!this.isInitialized || !this.client) {
      throw new Error('TTSManager not initialized. Call initialize() first.');
    }
  }
}

export const ttsManager = new TTSManager();
