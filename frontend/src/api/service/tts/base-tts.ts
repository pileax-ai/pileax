import { TTSOptions, TTSClient } from 'src/api/service/tts'

/**
 * TTS Client
 *
 * @version 1.0
 */
export interface TTSClientEventMap {
  start: [text: string];
  end: [text: string];
  error: [error: any];
  pause: [];
  resume: [];
  stop: [];
  statechange: [state: 'idle' | 'playing' | 'paused' | 'stopped'];
  sentence: [sentence: string]; // 可选
}
export type TTSClientEvent = keyof TTSClientEventMap;
export type TTSClientEventHandler<K extends TTSClientEvent> =
  (...args: TTSClientEventMap[K]) => void;

export abstract class BaseTTSClient implements TTSClient {
  public options: TTSOptions;
  public state: 'idle' | 'playing' | 'paused' | 'stopped' = 'idle';

  protected getText!: () => Promise<string>;
  protected getResumeText!: () => Promise<string>;
  protected getNextText!: (move: boolean) => Promise<string>;
  protected getPrevText!: () => Promise<string>;
  protected preloadEnabled: boolean = false;
  protected preloadQueue: Map<string, AudioBuffer> = new Map();

  private events: Partial<{
    [K in TTSClientEvent]: Set<TTSClientEventHandler<any>>
  }> = {};
  private continuous = false;

  protected constructor(options: TTSOptions) {
    this.options = options;
  }

  async init(
    getText: () => Promise<string>,
    getResumeText: () => Promise<string>,
    getNextText: (move: boolean) => Promise<string>,
    getPrevText: () => Promise<string>
  ): Promise<void> {
    this.getText = getText;
    this.getResumeText = getResumeText;
    this.getNextText = getNextText;
    this.getPrevText = getPrevText;
  }

  // Events
  on<K extends keyof TTSClientEventMap>(
    event: K,
    handler: TTSClientEventHandler<K>
  ) {
    if (!this.events[event]) {
      this.events[event] = new Set();
    }
    this.events[event]!.add(handler);
  }

  off<K extends keyof TTSClientEventMap>(
    event: K,
    handler: TTSClientEventHandler<K>
  ) {
    this.events[event]?.delete(handler);
  }

  protected emit<K extends keyof TTSClientEventMap>(
    event: K,
    ...args: TTSClientEventMap[K]
  ) {
    this.events[event]?.forEach(handler => handler(...args));
  }

  // Play logic
  async play(): Promise<void> {
    const text = await this.getText();
    await this.playContinuous(text);
  }

  async playResume(): Promise<void> {
    const text = await this.getResumeText();
    console.log('playResume', text)
    await this.playContinuous(text);
  }

  async playNext(): Promise<void> {
    const text = await this.getNextText(true);
    await this.playContinuous(text);
  }

  async playContinuous(text: string): Promise<void> {
    // console.log('playContinuous call')
    this.continuous = true;
    this.state = 'playing';

    let current = text;
    while (this.continuous) {
      console.log('playContinuous')
      try {
        if (this.preloadEnabled) {
          this.preloadNext();
        }

        this.emit('start', current);
        await this.speak(current);
        this.emit('end', current);

        if (this.continuous) {
          const next = await this.getNextText(true);
          if (!next) {
            this.continuous = false;
            break;
          }
          current = next;
        } else {
          break;
        }
      } catch (err) {
        this.state = 'idle';
        this.emit('error', err);
        throw err;
      }
    }
  }

  private async preloadNext() {
    const nextText = await this.getNextText(false);
    this.preload(nextText);
  }

  stopContinuous() {
    this.continuous = false;
  }

  abstract speak(text: string): Promise<void>;
  abstract preload(text: string): Promise<void>;
  abstract stop(reset = true): Promise<void>;
  abstract pause(): Promise<void>;
  abstract resume(): Promise<void>;
  abstract dispose(): Promise<void>;

  async prev(): Promise<void> {
    try {
      await this.stop();
      const text = await this.getPrevText();
      await this.playContinuous(text);
    } catch (err) {
      console.debug('prev err')
    }
  }

  async next(): Promise<void> {
    try {
      await this.stop();

      const text = await this.getNextText(true);
      await this.playContinuous(text);
    } catch (err) {
      console.debug('next err')
    }
  }

  async restart(): Promise<void> {
    try {
      await this.stop();
      const text = await this.getText();
      await this.playContinuous(text);
    } catch (err) {
      console.debug('restart err')
    }
  }
}
