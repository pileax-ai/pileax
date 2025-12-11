import { edgeService } from 'src/api/service/remote/edge'
import { SHA1 } from 'core/utils/crypto'

const requestQueue = new Map<string, AbortController>()


export const getPlainText = (text: string) => {
  return text.replace(/<[^>]+>/g, "")
}

export const generateTextId = (text: string) => {
  return SHA1(text)
}

export const getEdgeTTSAudio = async (text: string, controller?: AbortController): Promise<ArrayBuffer> => {
  const requestId = generateTextId(text)

  if (!controller) {
    if (requestQueue.has(requestId)) {
      controller = requestQueue.get(requestId)
    } else {
      controller = new AbortController()
    }
  }

  const body = {
    text: getPlainText(text),
    voice: 'zh-CN-XiaoyiNeural',
    rate: '+0%'
  }

  try {
    const res = await edgeService.tts(body, 'arraybuffer', controller)
    return res.data
  } finally {
    requestQueue.delete(requestId)
  }
}
