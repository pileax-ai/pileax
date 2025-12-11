import { TTSOptions } from 'src/api/service/tts'
import { BaseTTSClient } from 'src/api/service/tts/base-tts';
import { prepareTextForVoice, recommendVoices } from 'src/api/service/tts/utils/utterance-util'

/**
 * TTS Client
 *
 * @version 1.0
 */
export class BrowserTTSClient extends BaseTTSClient {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor(options: TTSOptions) {
    super(options);
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  override async init(...args: Parameters<BaseTTSClient['init']>): Promise<void> {
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
    await this.stop(false);

    return new Promise((resolve, reject) => {
      this.state = 'playing';

      const u = this.prepareUtterance(text);
      this.utterance = u;

      u.onstart = () => this.emit('start', text);
      u.onend = () => {
        this.state = 'idle';
        resolve();
      };
      u.onerror = (err) => {
        this.state = 'idle';
        reject(err);
      };

      this.synthesis.speak(this.utterance);
    });
  }

  async preload(text: string): Promise<void> {
    return Promise.resolve();
  }

  async stop(reset = true): Promise<void> {
    if (reset) {
      this.stopContinuous();
      this.state = 'stopped';
    }
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    return Promise.resolve();
  }

  async pause(): Promise<void> {
    this.state = 'paused';
    this.synthesis.pause();
    return Promise.resolve();
  }

  async resume(): Promise<void> {
    this.state = 'playing';

    if (!this.synthesis.speaking && !this.synthesis.pending) {
      this.playResume();
    } else {
      this.synthesis.resume();
    }
    return Promise.resolve();
  }

  async updateOptions(options: TTSOptions): Promise<TTSOptions> {
    this.options = {
      ...this.options,
      ...options
    }
    await this.applyOptions();
    this.playNext();

    return this.options;
  }

  async dispose(): Promise<void> {
    this.state = 'disposed';
    this.synthesis.cancel();
    this.utterance = null;
    return Promise.resolve();
  }

  private loadVoices() {
    const load = () => {
      this.voices = this.synthesis.getVoices();
    };

    load();
    if (this.voices.length === 0) {
      this.synthesis.addEventListener('voiceschanged', load);
    }
  }

  private getVoice() {
    const voices = recommendVoices(this.voices);
    let voice = voices.find(v =>
      v.name === this.options.voiceName || v.lang === this.options.lang
    );
    if (!voice) {
      voice = this.voices.find(v =>
        v.name === this.options.voiceName || v.lang === this.options.lang
      );
    }
    return voice;
  }

  private prepareUtterance(text: string) {
    // voice
    const voice = this.getVoice()
    text = prepareTextForVoice(text, voice);
    // console.log('text', text)

    // utterance
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.options.lang || 'en-US';
    u.rate = parseFloat(this.options.rate || '1');
    u.pitch = parseFloat(this.options.pitch || '1');
    u.volume = Math.min(Math.max(parseFloat(this.options.volume ?? '1'), 0), 1);
    if (voice) u.voice = voice;

    return u;
  }

  private async applyOptions() {
    if (this.synthesis.speaking && this.utterance) {
      this.synthesis.cancel();
      const currentText = this.utterance?.text;
      if (currentText) {
        await this.speak(currentText);
      }
    }
    return Promise.resolve();
  }
}
