import { edgeService, ttsService } from 'src/api/service/remote'
import { SHA1 } from 'core/utils/crypto'
import { useReaderStoreWithOut } from 'stores/reader'

const readerStore = useReaderStoreWithOut()
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

export const getLLMTTSAudio = async (text: string, controller?: AbortController): Promise<ArrayBuffer> => {
  const requestId = generateTextId(text)

  if (!controller) {
    if (requestQueue.has(requestId)) {
      controller = requestQueue.get(requestId)
    } else {
      controller = new AbortController()
    }
  }

  const body = {
    model_provider: 'Tongyi',
    model_name: 'sambert-zhide-v1',
    model_type: 'tts',
    message: getPlainText(text),
    ...readerStore.tts
  }

  try {
    const res = await ttsService.llm(body, 'arraybuffer', controller)
    return res.data
  } finally {
    requestQueue.delete(requestId)
  }
}
