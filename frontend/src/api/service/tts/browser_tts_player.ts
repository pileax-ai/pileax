import { TTSOptions } from 'src/api/service/tts'
import { BaseTTSPlayer } from 'src/api/service/tts/base_tts_player';
import { prepareTextForVoice, recommendVoices } from 'src/api/service/tts/utils/utterance_util'

/**
 * TTS Player
 *
 * @version 1.0
 */
export class BrowserTTSPlayer extends BaseTTSPlayer {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor(options: TTSOptions) {
    super(options);
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
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

  async stop(reset = true): Promise<void> {
    if (reset) {
      this.stopContinuous()
    }
    this.state = 'stopped';
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
    this.synthesis.resume();
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
    console.log('text', text)

    // utterance
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.options.lang || 'en-US';
    u.rate = this.options.rate || 1;
    u.pitch = this.options.pitch || 1;
    u.volume = Math.min(Math.max(this.options.volume ?? 1, 0), 1);
    if (voice) u.voice = voice;

    return u;
  }
}
