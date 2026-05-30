import { ref, reactive, computed } from 'vue'
import type { TTSOptions } from 'src/api/service/tts'
import { ttsManager } from 'src/api/service/tts'
import { useBookStoreWithOut } from 'stores/book'
import { useReaderStoreWithOut } from 'stores/reader'
import { debounce } from 'quasar'

export default function useTTS() {
  const store = useReaderStoreWithOut()
  const bookStore = useBookStoreWithOut()

  const options = reactive<TTSOptions>({
    lang: 'zh-CN',
    rate: '1.0',
    pitch: '1.0',
    volume: '1.0',
  })

  const initialize = async (
    getText: () => Promise<string>,
    getResumeText: () => Promise<string>,
    getNextText: (move: boolean) => Promise<string>,
    getPrevText: () => Promise<string>,
    customOptions?: TTSOptions,
    reset = false
  ) => {
    if (customOptions) Object.assign(options, customOptions)

    await ttsManager.initialize(
      getText,
      getResumeText,
      getNextText,
      getPrevText,
      options,
      reset
    )
  }

  const reload = () => {
    if (ttsClient.value?.state === 'playing') {
      setPlayStatus('play')
    } else if (ttsClient.value?.state === 'paused' || ttsClient.value?.state === 'idle') {
      setPlayStatus('pause')
    }
  }

  const play = async () => {
    setPlayStatus('play')
    await ttsManager.play()
  }

  const stop = async () => {
    setPlayStatus('stop')
    await ttsManager.stop()
  }

  const pause = async () => {
    setPlayStatus('pause')
    await ttsManager.pause()
  }

  const resume = async () => {
    setPlayStatus('play')
    await ttsManager.resume()
  }

  const updateOption = debounce(() => {
    ttsManager.setOptions(ttsOptions.value)
  }, 1000)

  const togglePlayPause = async () => {
    try {
      switch (ttsPlayerStatus.value) {
        case 'stop':
        case 'error':
          await play()
          break
        case 'play':
          await pause()
          break
        case 'pause':
          await resume()
          break
        case 'resume':
          break
      }
    } catch (err) {
      console.debug('togglePlayPause err', err)
      if ((err as any)?.error !== 'interrupted') {
        setPlayStatus('error')
      }
    }
    // console.log('after toggle', ttsClient.value?.state)
  }

  const setProvider = (value: any) => {
    store.setTTSItem('provider', value)
  }

  const setRate = (value: any) => {
    store.setTTSItem('rate', value)
    updateOption()
  }

  const setPitch = (value: any) => {
    store.setTTSItem('pitch', value)
  }

  const setVolume = (value: any) => {
    store.setTTSItem('volume', value)
  }

  const setPlayStatus = (value: any) => {
    bookStore.setTTSItem('playStatus', value)
  }

  const ttsClient = computed(() => ttsManager.client)
  const ttsOptions = computed(() => store.tts)
  const ttsDrawer = computed(() => store.rightDrawer)
  const ttsPlayerWidth = computed(() => ttsDrawer.value.width)
  const ttsPlayerStatus = computed(() => bookStore.tts.playStatus)

  const ttsState = reactive({
    options,
  })

  const tts = reactive({
    options: ttsOptions,
    drawer: ttsDrawer,
    playerWidth: ttsPlayerWidth,
    setProvider,
    setRate,
    setPitch,
    setVolume
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
    setOptions: ttsManager.setOptions.bind(ttsManager),
  }

  return {
    tts,
    ttsClient,
    ttsController,
    ttsState,
    ttsPlayerStatus
  }
}
