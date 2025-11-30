import { TTSOptions } from 'src/api/service/tts/tts_player'
import { BaseTTSPlayer } from 'src/api/service/tts/base_tts_player';

/**
 * TTS Player
 *
 * @version 1.0
 */
export class BrowserTTSPlayer extends BaseTTSPlayer {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  public isContinuous = false;

  constructor(options: TTSOptions) {
    super(options);
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
    if (this.voices.length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        this.voices = this.synthesis.getVoices();
      });
    }
  }

  override async init(...args: Parameters<BaseTTSPlayer['init']>): Promise<void> {
    await super.init(...args);
    if (this.voices.length === 0) {
      await new Promise<void>(resolve => {
        this.synthesis.addEventListener('voiceschanged', () => {
          this.voices = this.synthesis.getVoices();
          resolve();
        }, { once: true });
      });
    }
  }

  async speak(text: string): Promise<void> {
    await this.stop();
    return new Promise((resolve, reject) => {
      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.lang = this.options.lang || 'en-US';
      this.utterance.rate = this.options.rate || 1;
      this.utterance.pitch = this.options.pitch || 1;
      this.utterance.volume = Math.min(Math.max(this.options.volume ?? 1, 0), 1);

      const voice = this.voices.find(v =>
        v.name === this.options.voiceName || v.lang === this.options.lang
      );
      if (voice) this.utterance.voice = voice;

      this.utterance.onend = () => resolve();
      this.utterance.onerror = (e) => reject(e);
      this.synthesis.speak(this.utterance);
    });
  }

  async play(): Promise<void> {
    this.isContinuous = true;
    let text = await this.getText();
    while (this.isContinuous) {
      try {
        await this.speak(text);
        const nextText = await this.getNextText();
        if (!nextText) {
          this.isContinuous = false;
          return;
        }
        text = nextText;
      } catch (err) {
        this.isContinuous = false;
        throw err;
      }
    }
  }

  async stop(): Promise<void> {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    return Promise.resolve();
  }

  async pause(): Promise<void> {
    this.synthesis.pause();
    return Promise.resolve();
  }

  async resume(): Promise<void> {
    this.synthesis.resume();
    return Promise.resolve();
  }
}
