import { TTSOptions, TTSPlayer } from 'src/api/service/tts'

/**
 * TTS Player
 *
 * @version 1.0
 */
export interface TTSPlayerEventMap {
  start: [text: string];
  end: [text: string];
  error: [error: any];
  pause: [];
  resume: [];
  stop: [];
  statechange: [state: 'idle' | 'playing' | 'paused' | 'stopped'];
  sentence: [sentence: string]; // 可选
}
export type TTSPlayerEvent = keyof TTSPlayerEventMap;
export type TTSPlayerEventHandler<K extends TTSPlayerEvent> =
  (...args: TTSPlayerEventMap[K]) => void;

export abstract class BaseTTSPlayer implements TTSPlayer {
  public options: TTSOptions;
  public state: 'idle' | 'playing' | 'paused' | 'stopped' = 'idle';

  protected getText!: () => Promise<string>;
  protected getNextText!: (move: boolean) => Promise<string>;
  protected getPrevText!: () => Promise<string>;

  private events: Partial<{
    [K in TTSPlayerEvent]: Set<TTSPlayerEventHandler<any>>
  }> = {};
  private continuous = false;

  constructor(options: TTSOptions) {
    this.options = options;
  }

  async init(
    getText: () => Promise<string>,
    getNextText: (move: boolean) => Promise<string>,
    getPrevText: () => Promise<string>
  ): Promise<void> {
    this.getText = getText;
    this.getNextText = getNextText;
    this.getPrevText = getPrevText;
  }

  // Events
  on<K extends keyof TTSPlayerEventMap>(
    event: K,
    handler: TTSPlayerEventHandler<K>
  ) {
    if (!this.events[event]) {
      this.events[event] = new Set();
    }
    this.events[event]!.add(handler);
  }

  off<K extends keyof TTSPlayerEventMap>(
    event: K,
    handler: TTSPlayerEventHandler<K>
  ) {
    this.events[event]?.delete(handler);
  }

  protected emit<K extends keyof TTSPlayerEventMap>(
    event: K,
    ...args: TTSPlayerEventMap[K]
  ) {
    this.events[event]?.forEach(handler => handler(...args));
  }

  // Play logic
  async play(): Promise<void> {
    this.continuous = true;
    this.state = 'playing';

    let current = await this.getText();
    while (this.continuous) {
      try {
        this.emit('start', current);
        await this.speak(current);
        this.emit('end', current);

        const next = await this.getNextText(true);
        if (!next) {
          this.continuous = false;
          break;
        }
        current = next;
      } catch (err) {
        console.log('hOHOHOHOOOH')
        // console.error(err)
        this.state = 'idle';
        // this.emit('error', err);
        // throw err;
      }
    }
  }

  stopContinuous() {
    this.continuous = false;
  }

  abstract speak(text: string): Promise<void>;
  abstract stop(): Promise<void>;
  abstract pause(): Promise<void>;
  abstract resume(): Promise<void>;

  async prev(): Promise<void> {
    await this.stop();
    const text = await this.getPrevText();
    await this.speak(text);
  }

  async next(): Promise<void> {
    await this.stop();
    const text = await this.getNextText(true);
    await this.speak(text);
  }

  async restart(): Promise<void> {
    await this.stop();
    const text = await this.getText();
    await this.speak(text);
  }
}
