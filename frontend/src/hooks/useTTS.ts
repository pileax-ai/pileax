import { ref, reactive, computed } from 'vue'
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
    getResumeText: () => Promise<string>,
    getNextText: (move: boolean) => Promise<string>,
    getPrevText: () => Promise<string>,
    mode?: TTSMode,
    customOptions?: TTSOptions
  ) => {
    if (mode) currentMode.value = mode;
    if (customOptions) Object.assign(options, customOptions);

    await ttsManager.initialize(
      getText,
      getResumeText,
      getNextText,
      getPrevText,
      currentMode.value,
      options
    );
  };

  const reload = () => {
    if (ttsClient.value.state === 'playing') {
      isPlaying.value = true;
    } else if (ttsClient.value.state === 'paused' || ttsClient.value.state === 'idle') {
      isPlaying.value = true;
      isPaused.value = true;
    }
  }

  const play = async () => {
    isPlaying.value = true;
    isPaused.value = false;
    await ttsManager.play();
    // isPlaying.value = false;
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
    try {
      if (isPlaying.value && !isPaused.value) {
        await pause();
      } else if (isPlaying.value && isPaused.value) {
        await resume();
      } else {
        await play();
      }
    } catch (err) {
      console.debug('togglePlayPause err')
    }
    console.log('after toggle', ttsClient.value?.state)
  };

  const ttsClient = computed(() => ttsManager.client)

  const ttsState = reactive({
    isPlaying,
    isPaused,
    currentMode,
    options,
  })

  const ttsController = {
    initialize,
    reload,
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

  return {
    ttsClient,
    ttsController,
    ttsState,
  };
}
