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

export const StandardColors = [
  { label: 'red', value: 'red', color: 'red', hex: '#f44336' },
  { label: 'pink', value: 'pink', color: 'pink', hex: '#e91e63' },
  { label: 'purple', value: 'purple', color: 'purple', hex: '#9c27b0' },
  { label: 'deep-purple', value: 'deep-purple', color: 'deep-purple', hex: '#673ab7' },
  { label: 'indigo', value: 'indigo', color: 'indigo', hex: '#3f51b5' },
  { label: 'blue', value: 'blue', color: 'blue', hex: '#2196f3' },
  { label: 'light-blue', value: 'light-blue', color: 'light-blue', hex: '#03a9f4' },
  { label: 'cyan', value: 'cyan', color: 'cyan', hex: '#00bcd4' },
  { label: 'teal', value: 'teal', color: 'teal', hex: '#009688' },
  { label: 'green', value: 'green', color: 'green', hex: '#4caf50' },
  { label: 'light-green', value: 'light-green', color: 'light-green', hex: '#8bc34a' },
  { label: 'lime', value: 'lime', color: 'lime', hex: '#cddc39' },
  { label: 'yellow', value: 'yellow', color: 'yellow', hex: '#ffeb3b' },
  { label: 'amber', value: 'amber', color: 'amber', hex: '#ffc107' },
  { label: 'orange', value: 'orange', color: 'orange', hex: '#ff9800' },
  { label: 'deep-orange', value: 'deep-orange', color: 'deep-orange', hex: '#ff5722' },
  { label: 'brown', value: 'brown', color: 'brown', hex: '#795548' },
  { label: 'grey', value: 'grey', color: 'grey', hex: '#9e9e9e' },
  { label: 'blue-grey', value: 'blue-grey', color: 'blue-grey', hex: '#607d8b' },
]
