import { BrowserTTSClient } from 'src/api/service/tts/browser-tts'
import { EdgeTTSClient } from 'src/api/service/tts/edge-tts'
import { ttsManager } from './tts-manager'

/**
 * TTS Client
 *
 * @version 1.0
 */

export type TTSClientEvent =
  | 'start'
  | 'end'
  | 'error'
  | 'pause'
  | 'resume'
  | 'stop'
  | 'sentence'
  | 'statechange'

export interface TTSOptions {
  /**
   * The underlying speech synthesis engine or service to use.
   * - `'browser'`: Uses the browser's built-in Web Speech API (`window.speechSynthesis`).
   * - `'edge'`: Uses the Microsoft Edge Neural TTS cloud service.
   * - `'local'`: (Planned) Uses a local TTS engine, e.g., Piper.
   */
  provider?: 'browser' | 'edge' | 'local';

  /**
   * The specific name of the voice to use.
   * - For `provider: 'edge'`: Use a voice name string like `'zh-CN-XiaoxiaoNeural'`.
   * - For `provider: 'browser'`: Use the `voice.name` property from `speechSynthesis.getVoices()`.
   * This option typically takes precedence over `voiceGender`.
   */
  voiceName?: string;

  /**
   * A preferred gender for the voice when a specific `voiceName` is not provided.
   * Used as a filter hint to select a suitable voice from the available list.
   */
  voiceGender?: 'male' | 'female';

  /**
   * The language for speech synthesis, in BCP-47 format (e.g., 'en-US', 'zh-CN').
   * Acts as a filter for voice selection. Some providers may ignore this if a specific `voiceName` is set.
   */
  lang?: string;

  /**
   * The speech rate (speed).
   * - A multiplier where `1.0` is the normal/native rate for the voice.
   * - Values typically range from `0.1` (slowest) to `10.0` (fastest).
   */
  rate?: string;

  /**
   * The pitch of the voice.
   * - A multiplier where `1.0` is the normal/native pitch for the voice.
   * - The standard effective range is between `0.0` (lowest) and `2.0` (highest).
   */
  pitch?: string;

  /**
   * The volume for speech output.
   * - A value between `0.0` (silent) and `1.0` (maximum volume).
   * - Default is usually `1.0` if not specified.
   */
  volume?: string;
}

export interface TTSClient {
  options: TTSOptions;

  init(
    getText: () => Promise<string>,
    getResumeText: () => Promise<string>,
    getNextText: (move: boolean) => Promise<string>,
    getPrevText: () => Promise<string>
  ): Promise<void>;

  play(): Promise<void>;
  stop(reset: boolean): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  speak(text: string): Promise<void>;
  preload(text: string): Promise<void>;

  prev(): Promise<void>;
  next(): Promise<void>;
  restart(): Promise<void>;
  updateOptions(options: TTSOptions): Promise<TTSOptions>;
  dispose(): Promise<void>;

  // events
  on(event: TTSClientEvent, handler: (...args: any[]) => void): void;
  off(event: TTSClientEvent, handler: (...args: any[]) => void): void;

  state: 'idle' | 'playing' | 'paused' | 'stopped' | 'disposed';
}


export function createTTSClient(options: TTSOptions): TTSClient {
  switch (options.provider) {
    case 'browser':
      return new BrowserTTSClient(options)
    case 'edge':
      return new EdgeTTSClient(options)
    default:
      throw new Error(`Unsupported TTS provider: ${options.provider}`)
  }
}

export {
  ttsManager
}
