
/**
 * App default settings
 */
export const THEMES :Indexable = {
  'light': {
    'secondary': '#ffffff',
    'accent': '#f5f7f9',
    'dark': '#e1e0dd',
    'info': '#272A3E',
  },
  // 'classic': {
  //   'secondary': '#ffffff',
  //   'accent': '#f5f7f9',
  //   'dark': '#eceff1',
  //   'info': '#272A3E',
  // },
  'dark': {
    'secondary': '#272A3E',
    'accent': '#222336',
    'dark': '#141824',
    'info': '#B3BDD2',
  },
}

export const THEME_COLORS :OptionValue[] = [
  { label: 'blue', value: '#2172e0', name: 'blue' },
  { label: 'indigo', value: '#3f51b5', name: 'indigo' },
  { label: 'cyan', value: '#00bcd4', name: 'cyan' },
  { label: 'teal', value: '#009688', name: 'teal' },
  { label: 'green', value: '#4caf50', name: 'green' },
  { label: 'deepPurple', value: '#673ab7', name: 'deep-purple' }, // #673ab7, #6510AD, #7c5dc7
  { label: 'red', value: '#f44336', name: 'red' },
  { label: 'deepOrange', value: '#ff5722', name: 'deep-orange' },
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
