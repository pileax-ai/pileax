import { TTSMode, TTSOptions, TTSPlayer } from 'src/service/tts/tts_player'
import { BrowserTTSPlayer } from 'src/service/tts/browser_tts_player'
import { EdgeTTSPlayer } from 'src/service/tts/edge_tts_player'

/**
 * Create TTS Player
 *
 * @version 1.0
 */
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
