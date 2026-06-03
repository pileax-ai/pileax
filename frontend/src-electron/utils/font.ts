import fontList from 'font-list'

interface FontItem {
  name: string
  familyName: string
  postScriptName: string
  weight: string
  style: string
  width: string
  monospace: boolean
}

interface CategorizedFonts {
  mono: Indexable[]
  serif: Indexable[]
  sansSerif: Indexable[]
  more: Indexable[]
}

const SERIF_KEYWORDS = ['song', 'kai', 'fangsong', 'serif', 'georgia', 'times', 'mincho', 'clarendon']
const SANS_KEYWORDS = ['hei', 'yahei', 'pingfang', 'dengxian', 'sans', 'arial', 'helvetica', 'gothic', 'roboto', 'yozai']
const CJK_KEYWORDS = [
  // Region
  'cjk', 'sc', 'tc', 'hans', 'hant', 'chs', 'cht', 'ja', 'jp', 'ko', 'kr',
  // Chinese
  'yahei', 'pingfang', 'songti', 'simsun', 'simhei', 'kai', 'kaiti', 'fangsong', 'dengxian',
  // Japanese
  'mincho', 'gothic', 'maru', 'kyokasho', 'ms-mincho', 'ms-gothic',
  // Korean
  'batang', 'dotum', 'gulim', 'gungsuh', 'malgun',
  // Custom
  'yozai'
]

const isCJKCharacters = (str: string): boolean => {
  return /[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(str)
}

const isCJKFont = (font: Indexable): boolean => {
  if (isCJKCharacters(font.name) || isCJKCharacters(font.familyName)) {
    return true
  }

  const nameLower = font.name.toLowerCase()
  const psLower = font.postScriptName ? font.postScriptName.toLowerCase() : ''

  return CJK_KEYWORDS.some(key => nameLower.includes(key) || psLower.includes(key))
}

export const getSystemFonts = async (): Promise<Indexable> => {
  const result: CategorizedFonts = {
    mono: [],
    serif: [],
    sansSerif: [],
    more: []
  }

  try {
    const fonts = await fontList.getFonts2()
    for (const font of fonts) {
      const cjk  = isCJKFont(font)

      // 1. Mono
      if (font.monospace) {
        result.mono.push({...font, cjk})
        continue
      }

      const nameLower = font.name.toLowerCase()
      const psLower = font.postScriptName.toLowerCase()

      // 2. Serif
      if (
        SERIF_KEYWORDS.some(key => nameLower.includes(key) || psLower.includes(key))
      ) {
        result.serif.push({...font, cjk})
        continue
      }

      // 3. Sans-serif
      if (
        SANS_KEYWORDS.some(key => nameLower.includes(key) || psLower.includes(key))
      ) {
        result.sansSerif.push({...font, cjk})
        continue
      }

      // 4. More
      result.more.push({...font, cjk})
    }

    return result
  } catch (error) {
    console.error('Failed to fetch system fonts:', error)
    return []
  }
}
