import { BrowserTTSClient } from 'src/api/service/tts/browser-tts';
import { EdgeTTSClient } from 'src/api/service/tts/edge-tts';
import { ttsManager } from './tts-manager';

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
  provider?: 'browser' | 'edge' | 'local';
  voiceName?: string;
  voiceGender?: 'male' | 'female';
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
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
  dispose(): Promise<void>;

  // events
  on(event: TTSClientEvent, handler: (...args: any[]) => void): void;
  off(event: TTSClientEvent, handler: (...args: any[]) => void): void;

  state: 'idle' | 'playing' | 'paused' | 'stopped' | 'disposed';
}


export function createTTSClient(options: TTSOptions): TTSClient {
  switch (options.provider) {
    case 'browser':
      return new BrowserTTSClient(options);
    case 'edge':
      return new EdgeTTSClient(options);
    default:
      throw new Error(`Unsupported TTS provider: ${options.provider}`);
  }
}

export {
  ttsManager
}
