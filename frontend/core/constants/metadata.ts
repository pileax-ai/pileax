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
