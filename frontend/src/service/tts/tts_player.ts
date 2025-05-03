/**
 * TTS Player
 *
 * @version 1.0
 */
export type TTSMode = 'browser' | 'edge';

export interface TTSOptions {
  lang?: string;
  voiceName?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface TTSPlayer {
  options: TTSOptions;
  init(getText: () => Promise<string>, getNextText: () => Promise<string>, getPrevText: () => Promise<string>): Promise<void>;
  speak(text: string): Promise<void>;
  play(): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  prev(): Promise<void>;
  next(): Promise<void>;
  restart(): Promise<void>;
}
