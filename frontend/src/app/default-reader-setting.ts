import { useAppStoreWithOut } from 'stores/app'
import { THEMES } from 'core/constants/setting'

/**
 * Reader default settings
 */
export const defaultSetting = {
  // background
  backgroundColor: 'transparent',
  backgroundImage: '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '',
  backgroundPosition: '',
  backgroundBlur: 0,
  backgroundOpacity: 1.0,

  // font
  fontSize: 22,
  font: 'book',
  fontName: 'book',
  fontColor: '#000000',
  fontWeight: 400,

  // typography
  letterSpacing: 0,
  spacing: 1.7,
  paragraphSpacing: 0,
  textIndent: 0,
  justify: true,
  hyphenate: true,

  // page
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

  // pagination
  flow: 'paginated', // scrolled, paginated
  pageAnimation: true,
  wheelPageNavigation: true,

  // annotation
  annStyle: 'highlight',
  annColor: 'green',

  // css
  globalCSSEnabled: false,
  globalCSS: '',
  bookCSS: ''
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

export const defaultGlobalCSS = `/* Kaiti */
aside,
table,
.block,
.calibre3,
.calibre10,
.small,
.small1,
.note,
.note5,
.msonormal,
.img,
.jiazhu,
.fnote,
.fnoteright,
.fs,
.quotation,
.quotation span,
[class*="kaiti"],
[class*="Kai"],
[class*="kt"] {
    font-family: "STKaiti", serif !important;
    line-height: 1.2 !important;
    opacity: 0.8;
}

[class*="fangsong"] {
    font-family: "LXGW WenKai Lite", "FangSong_GB2312", serif !important;
    line-height: 1.5 !important;
    opacity: 1;
}

[class*="poem"],
[class*="shiju"] {
    font-family: "FZLiuGongQuanKaiShuS", "TsangerJinKai05", "LXGW WenKai Lite", "FangSong_GB2312", serif !important;
    line-height: 1.5 !important;
    opacity: 1;
}

/* Heading */
h1 {
    font-size: 1.8rem !important;
}
h2 {
    font-size: 1.6rem !important;
}
h3 {
    font-size: 1.4rem !important;
    font-weight: bold !important;
    text-indent: 0 !important;
    border-bottom: solid 1px rgba(0,0,0,0.08);
}
h4 {
    font-size: 1.2rem !important;
    font-weight: bold !important;
    border-bottom: solid 1px rgba(0,0,0,0.08);
}
`
