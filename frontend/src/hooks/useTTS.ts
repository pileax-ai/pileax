// src/composables/useTTS.ts
import { ref, reactive } from 'vue';
import { ttsManager, TTSMode, TTSOptions } from 'src/api/service/tts';

export function useTTS() {
  const isPlaying = ref(false);
  const isPaused = ref(false);
  const currentMode = ref<TTSMode>('browser');
  const options = reactive<TTSOptions>({
    lang: 'zh-CN',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  });

  const initialize = async (
    getText: () => Promise<string>,
    getNextText: () => Promise<string>,
    getPrevText: () => Promise<string>,
    mode?: TTSMode,
    customOptions?: TTSOptions
  ) => {
    if (mode) currentMode.value = mode;
    if (customOptions) Object.assign(options, customOptions);

    await ttsManager.initialize(
      getText,
      getNextText,
      getPrevText,
      currentMode.value,
      options
    );
  };

  const speak = async (text: string) => {
    try {
      isPlaying.value = true;
      isPaused.value = false;
      await ttsManager.speak(text);
    } catch (error) {
      console.error('TTS speak error:', error);
      throw error;
    } finally {
      isPlaying.value = false;
    }
  };

  const play = async () => {
    isPlaying.value = true;
    isPaused.value = false;
    await ttsManager.play();
    isPlaying.value = false;
  };

  const stop = async () => {
    isPlaying.value = false;
    isPaused.value = false;
    await ttsManager.stop();
  };

  const pause = async () => {
    isPaused.value = true;
    await ttsManager.pause();
  };

  const resume = async () => {
    isPaused.value = false;
    await ttsManager.resume();
  };

  const togglePlayPause = async () => {
    if (isPlaying.value && !isPaused.value) {
      await pause();
    } else if (isPlaying.value && isPaused.value) {
      await resume();
    } else {
      await play();
    }
  };

  const ttsState = {
    isPlaying,
    isPaused,
    currentMode,
    options,
  }

  const ttsMethod = {
    initialize,
    speak,
    play,
    stop,
    pause,
    resume,
    togglePlayPause,
    prev: ttsManager.prev.bind(ttsManager),
    next: ttsManager.next.bind(ttsManager),
    restart: ttsManager.restart.bind(ttsManager),
    setMode: ttsManager.setMode.bind(ttsManager),
    setOptions: ttsManager.setOptions.bind(ttsManager),
  }

  const ttsPlayer = {
    ...ttsState,
    ...ttsMethod
  }

  return {
    ttsPlayer
  };
}
