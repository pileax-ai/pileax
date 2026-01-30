import { Lang } from 'quasar'

const langMap = {
  'en': () => import('quasar/lang/en-US'),
  'en-US': () => import('quasar/lang/en-US'),
  'zh': () => import('quasar/lang/zh-CN'),
  'zh-Hans': () => import('quasar/lang/zh-CN'),
}

export  const setQuasarLang = async (lang: keyof typeof langMap) => {
  const langModule = await langMap[lang]()
  Lang.set(langModule.default)
}
