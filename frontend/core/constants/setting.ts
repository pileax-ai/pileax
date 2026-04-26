
/**
 * App default settings
 */
export const THEMES :Indexable = {
  'light': {
    'secondary': '#ffffff',
    'accent': '#f0f2f5',
    'dark': '#dde1e7',
    'dark-page': '#ffffff',
    'info': '#272A3E',
  },
  'dark': {
    'secondary': '#1E1F22',
    'accent': '#2B2D30',
    'dark': '#373a3e',
    'dark-page': '#1E1F22',
    'info': '#f2f2f7',
  },
  'darkBlue': {
    'secondary': '#1A1C26',
    'accent': '#242736',
    'dark': '#32364D',
    'dark-page': '#1A1C26',
    'info': '#E2E2F0',
  },
}

export const THEME_COLORS :OptionValue[] = [
  { label: 'blue', value: '#2563eb', name: 'blue' },
  { label: 'blueGrey', value: '#475569', name: 'blueGrey' },
  { label: 'indigo', value: '#5850ec', name: 'indigo' },
  { label: 'cyan', value: '#0891b2', name: 'cyan' },
  { label: 'teal', value: '#0d9488', name: 'teal' },
  { label: 'green', value: '#16a34a', name: 'green' },
  { label: 'purple', value: '#7c6df0', name: 'purple' }, // #673ab7, #6510AD, #7c5dc7
  { label: 'red', value: '#dc2626', name: 'red' },
  { label: 'amber', value: '#f59e0b', name: 'amber' },
]

export const NAVI_LAYOUTS :OptionValue[] = [
  { label: 'Group', value: 'group' },
  { label: 'Tab', value: 'tab' },
]

export const TAB_BAR_POSITIONS :OptionValue[] = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
]

export const TAB_BAR_STYLES :OptionValue[] = [
  { label: 'Square', value: 'square' },
  { label: 'Card', value: 'card' },
  { label: 'Modern', value: 'modern' },
]

export const BREADCRUMB_STYLES :OptionValue[] = [
  { label: 'Default', value: 'default' },
  { label: 'Tag', value: 'tag' },
]

export const PAGE_TRANSITIONS :OptionValue[] = [
  { label: 'Fade', value: 'fade' },
  { label: 'Fade Slide', value: 'fade-slide' },
  { label: 'Fade Scale', value: 'fade-scale' },
  { label: 'Fade Top', value: 'fade-top' },
  { label: 'Fade Bottom', value: 'fade-bottom' },
]
