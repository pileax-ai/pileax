import { useAppStoreWithOut } from 'stores/app'
import { THEMES } from 'core/constants/setting'

/**
 * Reader default settings
 */
export const defaultSetting = {
  fontSize: 1.2,
  font: 'book',
  fontName: 'book',
  letterSpacing: 0,
  spacing: 1.7,
  paragraphSpacing: 0,
  textIndent: 0,
  fontColor: '#000000',
  backgroundColor: '#ffffff',
  backgroundImage: '',
  topMargin: 0,
  bottomMargin: 0,
  sideMargin: 1,
  justify: true,
  hyphenate: true,
  pageTurnStyle: 'slide',
  maxColumnCount: 1,
  maxInlineSize: 720,
  viewMargin: true,
  spread: 'none',
  zoom: 'fit-width',
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
