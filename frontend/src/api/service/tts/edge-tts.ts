import type { TTSOptions } from 'src/api/service/tts'
import { BaseTTSClient } from 'src/api/service/tts/base-tts'
import { sleep } from 'core/utils/misc'
import { generateTextId, getEdgeTTSAudio } from 'src/api/service/tts/utils/tts-util'

/**
 * TTS Client
 *
 * @version 1.0
 */
export class EdgeTTSClient extends BaseTTSClient {
  private audioContext: AudioContext | null = null
  private audioBuffer: AudioBuffer | undefined = undefined
  private sourceNode: AudioBufferSourceNode | null = null
  private startTime: number = 0
  private pauseOffset: number = 0
  private currentController: AbortController | null = null

  constructor(options: TTSOptions) {
    super(options)
    this.preloadEnabled = true
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  async preload(text: string): Promise<void> {
    console.log('preload', text)
    try {
      const id = generateTextId(text)
      const audioData = await getEdgeTTSAudio(text)
      const audioBuffer = await this.audioContext!.decodeAudioData(audioData)
      this.preloadQueue.set(id, audioBuffer)
    } catch (err) {
      console.debug('preload err')
    }
  }

  async speak(text: string): Promise<void> {
    await this.stop(false)
    this.audioBuffer = undefined

    const id = generateTextId(text)
    if (this.preloadQueue.has(id)) {
      this.audioBuffer = this.preloadQueue.get(id)
    } else {
      const audioData = await this.fetchAudio(text)
      this.audioBuffer = await this.audioContext!.decodeAudioData(audioData)
    }

    await this.playBuffer(0)
    this.preloadQueue.delete(id)

    return Promise.resolve()
  }

  private async fetchAudio(text: string): Promise<ArrayBuffer> {
    if (this.currentController) {
      this.currentController.abort()
    }

    this.currentController = new AbortController()
    return getEdgeTTSAudio(text, this.currentController)
  }

  async playBuffer(startOffset: number = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sourceNode = this.audioContext!.createBufferSource()
      this.sourceNode.buffer = this.audioBuffer || null
      this.sourceNode.connect(this.audioContext!.destination)

      this.startTime = this.audioContext!.currentTime - startOffset
      this.sourceNode.start(0, startOffset)

      this.state = 'playing'

      this.sourceNode.onended = () => {
        console.log('onended', new Date().getTime() / 1000)
        this.state = 'idle'
        resolve()
      }
    })
  }

  async stop(reset = true): Promise<void> {
    if (reset) {
      console.log('stop reset', reset, new Date().getTime() / 1000)
      this.stopContinuous()
      this.state = 'stopped'
    }

    // 1. Abort request
    if (this.currentController) {
      this.currentController.abort()
      this.currentController = null
    }

    // 2. Stop playing
    if (this.sourceNode) {
      this.sourceNode.stop()
      this.sourceNode.disconnect()
      this.sourceNode = null
    }
    this.pauseOffset = 0

    // wait for onended triggered
    await sleep(10)

    return Promise.resolve()
  }

  async pause(): Promise<void> {
    this.stopContinuous()
    this.state = 'paused'

    // 1. Abort request
    if (this.currentController) {
      this.currentController.abort()
      this.currentController = null
    }

    if (!this.sourceNode) return
    this.pauseOffset = this.audioContext!.currentTime - this.startTime
    this.sourceNode.stop()
    this.sourceNode = null
    this.state = 'paused'
  }

  async updateOptions(options: TTSOptions): Promise<TTSOptions> {
    this.options = {
      ...this.options,
      ...options
    }
    // todo
    // await this.applyOptions();
    // this.playNext();

    return this.options
  }

  async resume(): Promise<void> {
    if (this.audioBuffer) {
      await this.playBuffer(this.pauseOffset)
      this.playNext()
    } else {
      this.playResume()
    }
    this.state = 'playing'
    return Promise.resolve()
  }

  async dispose(): Promise<void> {
    this.state = 'disposed'
    this.audioContext = null
    this.audioBuffer = undefined
    this.sourceNode = null
    return Promise.resolve()
  }
}
