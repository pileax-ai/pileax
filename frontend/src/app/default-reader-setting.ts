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
  bookCSS: '',
  hideItems: []
} as Indexable

export const defaultGlobalStyles = `
img {
    cursor: zoom-in;
}
`

export const defaultGlobalCSS = `/* Kaiti */
a,
aside,
blockquote,
blockquote *,
.annotation,
.block,
.fncontent,
.fs,
.jiazhu,
.jiaozhu,
.small,
.small1,
.tuti,
.tuzhu,
[class*="note" i],
[class*="quotation" i],
[class*="quotation" i] *,
[class*="kai" i],
[class*="kai" i] *,
[class*="kt" i],
[class*="kt" i] * {
    font-family: "STKaiti", STKai, "MKai PRC", Kai, "楷体", serif !important;
    line-height: 1.2 !important;
}

[class*="fangsong"],
[class*="fangsong"] * {
    font-family: "LXGW WenKai Lite", "FangSong_GB2312", serif !important;
    line-height: 1.5 !important;
}

.msonormal,
.yinwen,
[class*="poem"],
[class*="poem"] *,
[class*="poetry"],
[class*="poetry"] *,
[class*="shige"],
[class*="shige"] *,
[class*="shiju"],
[class*="shiju"] * {
    font-family: "FZLiuGongQuanKaiShuS", "TsangerJinKai05", "LXGW WenKai Lite", "FangSong_GB2312", serif !important;
    line-height: 1.5 !important;
    text-align: center !important;
}

/* Heading */
h1 {
    font-size: 1.5rem !important;
}
h2 {
    font-size: 1.4rem !important;
}
h3 {
    font-size: 1.2rem !important;
    font-weight: bold !important;
    text-indent: 0 !important;
    border-bottom: solid 1px rgba(0,0,0,0.08);
}
h4 {
    font-size: 1.1rem !important;
    font-weight: bold !important;
    border-bottom: solid 1px rgba(0,0,0,0.08);
}

/* Superscript */
sub,
sup,
[class*="sub" i],
[class*="sup" i] {
    font-size: 0.6rem !important;
}
`
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

export const itemCssSelectors: Indexable = {
  sub: ['sub'],
  sup: ['sup', '[class*="sup"]'],
  parentheticalCitation: ['.jiazhu', '.note'],
}

export const buildOptionalCSS = (hideItems?: string[]) => {
  if (!hideItems || !Array.isArray(hideItems) || !hideItems.length) {
    return ''
  }

  let selectors: string[] = []
  for (const item of hideItems) {
    const itemSelectors = itemCssSelectors[item] || []
    selectors = selectors.concat(itemSelectors)
  }

  return selectors.join(',') + ` { display: none; } `
}
