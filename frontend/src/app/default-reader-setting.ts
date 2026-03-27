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
  zoom: 'fit-page',
}

export const scrollbarStyles = `
  :host::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
  }
  :host::-webkit-scrollbar-track {
    background: transparent !important;
  }
  :host::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2) !important;
    border-radius: 10px !important;
  }
  :host::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.4) !important;
  }
`
