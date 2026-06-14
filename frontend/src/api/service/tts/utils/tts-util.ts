import { edgeService, ttsService } from 'src/api/service/remote'
import { SHA1 } from 'core/utils/crypto'
import { useReaderStoreWithOut } from 'stores/reader'

const readerStore = useReaderStoreWithOut()
const requestQueue = new Map<string, AbortController>()

// Define regex as constants outside the function to avoid re-compilation
// Match HTML tags (e.g., <div>, <br />)
const RE_HTML_TAGS = /<[^>]+>/g

// Match Markdown links to extract the label (e.g., [Google](https://google.com))
const RE_MARKDOWN_LINK = /\[([^\]]+)\]\([^)]+\)/g

// Match Markdown formatting symbols (e.g., #, **, _, ~)
const RE_MARKDOWN_SYMBOLS = /([#*_~`>]+)/g

// Match numeric footnotes inside brackets or parentheses (e.g., [2], (2))
const RE_FOOTNOTES = /\[\d+\]|\(\d+\)/g

// Match full URLs starting with http or https (e.g., https://example.com)
const RE_URLS = /https?:\/\/\S+/gi

// Match various emoji characters (e.g., 😀, 🚀, 🌲)
const RE_EMOJI = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu

// Match spaces, tabs, and newline characters (e.g., \n, \r, \u00a0)
const RE_WHITESPACE = /[\u00a0\s\r\n]+/g

export const sanitizeForNarration = (text: string) => {
  if (!text) return ''

  return text
    // 1. Remove HTML tags
    .replace(RE_HTML_TAGS, '')
    // 2. Convert Markdown links to plain text (keep the label, discard the URL)
    .replace(RE_MARKDOWN_LINK, '$1')
    // 3. Strip Markdown syntax symbols
    .replace(RE_MARKDOWN_SYMBOLS, '')
    // 4. Remove reference footnotes like [1] or [^1]
    .replace(RE_FOOTNOTES, '')
    // 5. Remove full URLs to prevent TTS from spelling out "h-t-t-p-s..."
    .replace(RE_URLS, '')
    // 6. Remove Emojis which might cause glitches in some TTS engines
    .replace(RE_EMOJI, '')
    // 7. Standardize whitespace and remove redundant line breaks
    .replace(RE_WHITESPACE, ' ')
    .trim()
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
    text: sanitizeForNarration(text),
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

  const ttsModel = readerStore.ttsModel
  console.log('ttsModel', ttsModel)
  const body = {
    model_provider: ttsModel.modelProvider,
    model_name: ttsModel.modelName,
    model_type: ttsModel.modelType,
    message: sanitizeForNarration(text),
    ...readerStore.tts
  }

  try {
    const res = await ttsService.llm(body, 'arraybuffer', controller)
    return res.data
  } finally {
    requestQueue.delete(requestId)
  }
}
