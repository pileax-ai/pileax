import { TTSOptions, TTSPlayer } from 'src/service/tts/tts_player'

/**
 * TTS Player
 *
 * @version 1.0
 */
export abstract class BaseTTSPlayer implements TTSPlayer {
  public options: TTSOptions;
  protected getText!: () => Promise<string>;
  protected getNextText!: () => Promise<string>;
  protected getPrevText!: () => Promise<string>;

  constructor(options: TTSOptions) {
    this.options = options;
  }

  async init(
    getText: () => Promise<string>,
    getNextText: () => Promise<string>,
    getPrevText: () => Promise<string>
  ): Promise<void> {
    this.getText = getText;
    this.getNextText = getNextText;
    this.getPrevText = getPrevText;
  }

  abstract speak(text: string): Promise<void>;
  abstract play(): Promise<void>;
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
    const text = await this.getNextText();
    await this.speak(text);
  }

  async restart(): Promise<void> {
    await this.stop();
    const text = await this.getText();
    await this.speak(text);
  }
}
