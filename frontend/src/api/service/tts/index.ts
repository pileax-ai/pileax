import { BrowserTTSPlayer } from 'src/api/service/tts/browser_tts_player';
import { EdgeTTSPlayer } from 'src/api/service/tts/edge_tts_player';
import { ttsManager } from './tts_manager';

/**
 * TTS Player
 *
 * @version 1.0
 */
export type TTSMode = 'browser' | 'edge' | 'local';

export type TTSPlayerEvent =
  | 'start'       
  | 'end'
  | 'error'
  | 'pause'
  | 'resume'
  | 'stop'
  | 'sentence'
  | 'statechange'

export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
  voiceGender?: 'male' | 'female';
  provider?: 'browser' | 'edge' | 'local';
}

export interface TTSPlayer {
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

  // events
  on(event: TTSPlayerEvent, handler: (...args: any[]) => void): void;
  off(event: TTSPlayerEvent, handler: (...args: any[]) => void): void;

  state: 'idle' | 'playing' | 'paused' | 'stopped';
}


export function createTTSPlayer(mode: TTSMode, options: TTSOptions): TTSPlayer {
  switch (mode) {
    case 'browser':
      return new BrowserTTSPlayer(options);
    case 'edge':
      return new EdgeTTSPlayer(options);
    default:
      throw new Error(`Unsupported TTS mode: ${mode as string}`);
  }
}

export {
  ttsManager
}
