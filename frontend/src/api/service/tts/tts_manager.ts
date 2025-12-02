import { createTTSPlayer, TTSMode, TTSOptions, TTSPlayer } from './index';

export class TTSManager {
  private player: TTSPlayer | null = null;
  private mode: TTSMode = 'browser';
  private options: TTSOptions = {};
  private isInitialized = false;

  constructor() {
    this.mode = 'browser';
  }

  async initialize(
    getText: () => Promise<string>,
    getNextText: (move: boolean) => Promise<string>,
    getPrevText: () => Promise<string>,
    mode?: TTSMode,
    options?: TTSOptions
  ): Promise<void> {
    if (mode) this.mode = mode;
    if (options) this.options = { ...this.options, ...options };

    this.player = createTTSPlayer(this.mode, this.options);
    await this.player.init(getText, getNextText, getPrevText);
    this.isInitialized = true;
  }

  async speak(text: string): Promise<void> {
    this.ensureInitialized();
    return this.player!.speak(text);
  }

  async play(): Promise<void> {
    this.ensureInitialized();
    return this.player!.play();

  }

  async stop(): Promise<void> {
    if (this.player) {
      return this.player.stop(true);
    }
    return Promise.resolve();
  }

  async pause(): Promise<void> {
    this.ensureInitialized();
    return this.player!.pause();
  }

  async resume(): Promise<void> {
    this.ensureInitialized();
    return this.player!.resume();
  }

  async prev(): Promise<void> {
    this.ensureInitialized();
    return this.player!.prev();
  }

  async next(): Promise<void> {
    this.ensureInitialized();
    return this.player!.next();
  }

  async restart(): Promise<void> {
    this.ensureInitialized();
    return this.player!.restart();
  }

  setMode(mode: TTSMode): void {
    this.mode = mode;
    this.isInitialized = false;
  }

  setOptions(options: TTSOptions): void {
    this.options = { ...this.options, ...options };
    this.isInitialized = false;
  }

  getMode(): TTSMode {
    return this.mode;
  }

  getOptions(): TTSOptions {
    return { ...this.options };
  }

  isPlaying(): boolean {
    return this.player && 'isPlaying' in this.player
      ? (this.player as any).isPlaying
      : false;
  }

  private ensureInitialized(): void {
    if (!this.isInitialized || !this.player) {
      throw new Error('TTSManager not initialized. Call initialize() first.');
    }
  }
}

export const ttsManager = new TTSManager();
