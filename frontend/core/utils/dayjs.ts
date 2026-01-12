/**
 * dayjs
 *
 * @author Xman
 * @version 1.0
 */
import useSetting from 'core/hooks/useSetting'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
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

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export const setDayjsLocale = async (lang: string) => {
  const language = languages.find(item => item.value === lang)
  const locale = language ? language.locale || 'en' : 'en'

  dayjs.locale(locale)
}

export const timeMulti = (time :string, format = 'YYYY/MM/DD HH:mm:ss') => {
  const { locale, timezone } = useSetting()

  const d = () => {
    console.log('timezones abc', timezone.value)
    // return dayjs.utc(time).local()
    return dayjs.utc(time).tz(timezone.value)
  }

  return {
    fromNow: () => {
      return d().locale(locale.value).fromNow()
    },
    timestamp: () => {
      return d().locale(locale.value).format(format)
    }
  }
}

export const getUtcTime = (format = 'YYYY/MM/DD HH:mm:ss') => {
  return dayjs().utc().format(format)
}
