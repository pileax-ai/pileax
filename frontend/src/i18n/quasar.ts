import { Lang } from 'quasar'

const langMap = {
  'en': () => import('quasar/lang/en-US'),
  'en-US': () => import('quasar/lang/en-US'),
  'es-US': () => import('quasar/lang/es'),
  'de-DE': () => import('quasar/lang/de'),
  'fr-FR': () => import('quasar/lang/fr'),
  'id-ID': () => import('quasar/lang/id'),
  'it-IT': () => import('quasar/lang/it'),
  'ja-JP': () => import('quasar/lang/ja'),
  'ko-KR': () => import('quasar/lang/ko-KR'),
  'pl-PL': () => import('quasar/lang/pl'),
  'pt-BR': () => import('quasar/lang/pt-BR'),
  'ro-RO': () => import('quasar/lang/ro'),
  'ru-RU': () => import('quasar/lang/ru'),
  'vi-VN': () => import('quasar/lang/vi'),
  'zh': () => import('quasar/lang/zh-CN'),
  'zh-Hans': () => import('quasar/lang/zh-CN'),
  'zh-Hant': () => import('quasar/lang/zh-TW'),
}

type LangKey = keyof typeof langMap

export  const setQuasarLang = async (lang: keyof typeof langMap) => {
  const key: LangKey = lang && langMap[lang] ? lang : 'en-US'
  const langModule = await langMap[key]()
  Lang.set(langModule.default)
}
