/**
 * dayjs
 *
 * @author Xman
 * @version 1.0
 */
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/de'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import 'dayjs/locale/ru'
import 'dayjs/locale/it'
import 'dayjs/locale/th'
import 'dayjs/locale/uk'
import 'dayjs/locale/vi'
import 'dayjs/locale/ro'
import 'dayjs/locale/pl'
import 'dayjs/locale/hi'
import 'dayjs/locale/tr'
import 'dayjs/locale/fa'
import 'dayjs/locale/sl'
import 'dayjs/locale/id'

import languages from 'src/i18n/generate/config/languages.json'

export const setDayjsLocale = async (lang: string) => {
  const language = languages.find(item => item.value === lang)
  const locale = language ? language.locale || 'en' : 'en'

  dayjs.locale(locale)
}

export const timeMulti = (time :string, format = 'YYYY/MM/DD HH:mm:ss') => {
  const { locale } = useI18n()

  const d = () => dayjs(time).utc().local()

  return {
    fromNow: () => {
      locale.value
      return d().fromNow()
    },
    timestamp: () => {
      locale.value
      return d().format(format)
    }
  }
}
