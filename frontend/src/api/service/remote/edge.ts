/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest'
import { api as request } from 'boot/axios'

export class EdgeService {
  private apiName = 'edge'

  getVoices(): Promise<any> {
    return GET({ name: this.apiName, path: '/voices', })
  }

  tts(body: Indexable, responseType = 'arraybuffer', controller?: AbortController): Promise<any> {
    return request({
      url: '/edge/tts',
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

export const edgeService = new EdgeService()
