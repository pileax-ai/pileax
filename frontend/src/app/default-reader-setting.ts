import { useAppStoreWithOut } from 'stores/app'
import { THEMES } from 'core/constants/setting'

/**
 * Reader default settings
 */
export const defaultSetting = {
  // font and background
  fontSize: 1.2,
  font: 'book',
  fontName: 'book',
  fontColor: '#000000',
  backgroundColor: '#ffffff',
  backgroundImage: '',

  // typography
  letterSpacing: 0,
  spacing: 1.7,
  paragraphSpacing: 0,
  textIndent: 0,
  justify: true,
  hyphenate: true,

  // page
  pageTurnStyle: 'slide',
  columnGap: 5,
  maxColumnCount: 1,
  maxInlineSize: 720,
  topMargin: 0,
  bottomMargin: 0,
  margin: 0,
  verticalMargin: 40,
  horizontalMargin: 0,
  spread: 'both',
  zoom: 'fit-width',

  // annotation
  annStyle: 'highlight',
  annColor: 'green',
} as Indexable

export const scrollbarStyles = () => {
  const appStore = useAppStoreWithOut()
  const theme = appStore.setting.theme
  const themeData = THEMES[theme.name] || THEMES['light']
  const dark = themeData['dark']
  const accent = themeData['accent']

  return `
  :host::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
  }
  :host::-webkit-scrollbar-track {
    background: transparent !important;
  }
  :host::-webkit-scrollbar-thumb {
    background: ${dark} !important;
    border-radius: 10px !important;
  }
  :host::-webkit-scrollbar-thumb:hover {
    background: ${accent} !important;
  }
`
}
