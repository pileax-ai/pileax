/**
 * Metadata
 *
 * @version 1.0
 */
import languages from 'src/i18n/generate/config/languages.json'

export const IconSets = [
  { label: 'Material Icons', value: 'material-icons', url: 'https://fonts.google.com/icons' },
  { label: 'MDI v6', value: 'mdi-v6', url: 'https://pictogrammers.com/library/mdi' },
]

// Locale
export const Locales = languages
// export const Locales = languages.filter(item => item.supported)

export const Languages = languages.map(item => {
  return {
    label: item.label,
    value: item.value,
    subLabel: item.prompt_name
  }
})

export const Timezones = [
  { label: 'Sydney', value: 'Australia/Sydney' },
  { label: 'São Paulo', value: 'America/Sao_Paulo' },
  { label: 'Toronto', value: 'America/Toronto' },
  { label: 'New York', value: 'America/New_York' },
  { label: 'Los Angeles', value: 'America/Los_Angeles' },
  { label: 'Anchorage', value: 'America/Anchorage' },
  { label: 'Chicago', value: 'America/Chicago' },
  { label: 'Denver', value: 'America/Denver' },
  { label: 'Cairo', value: 'Africa/Cairo' },
  { label: 'Dubai', value: 'Asia/Dubai' },
  { label: 'Shanghai', value: 'Asia/Shanghai' },
  { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
  { label: 'Bangkok', value: 'Asia/Bangkok' },
  { label: 'Jakarta', value: 'Asia/Jakarta' },
  { label: 'Karachi', value: 'Asia/Karachi' },
  { label: 'Dhaka', value: 'Asia/Dhaka' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
  { label: 'Seoul', value: 'Asia/Seoul' },
  { label: 'Hanoi', value: 'Asia/Ho_Chi_Minh' },
  { label: 'Tehran', value: 'Asia/Tehran' },
  { label: 'Jerusalem', value: 'Asia/Jerusalem' },
  { label: 'Kolkata', value: 'Asia/Kolkata' },
  { label: 'Istanbul', value: 'Europe/Istanbul' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Paris', value: 'Europe/Paris' },
  { label: 'Berlin', value: 'Europe/Berlin' },
  { label: 'Rome', value: 'Europe/Rome' },
  { label: 'Madrid', value: 'Europe/Madrid' },
  { label: 'Warsaw', value: 'Europe/Warsaw' },
  { label: 'Bucharest', value: 'Europe/Bucharest' },
  { label: 'Kiev', value: 'Europe/Kiev' },
  { label: 'Moscow', value: 'Europe/Moscow' },
  { label: 'Ljubljana', value: 'Europe/Ljubljana' }
]
