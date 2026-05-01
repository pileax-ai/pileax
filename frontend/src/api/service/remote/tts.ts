/**
 * Remote service
 *
 * @version 1.0
 */
import { GET } from 'src/hooks/useRequest'
import { api as request } from 'boot/axios'

export class TTSService {
  private apiName = 'tts'

  getVoices(): Promise<any> {
    return GET({ name: this.apiName, path: '/voices', })
  }

  llm(body: Indexable, responseType = 'arraybuffer', controller?: AbortController): Promise<any> {
    return request({
      url: '/tts/llm',
      method: 'POST',
      data: body,
      signal: controller?.signal,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'stream'
      },
      responseType: responseType as 'arraybuffer'
    })
  }

}

export const ttsService = new TTSService()
