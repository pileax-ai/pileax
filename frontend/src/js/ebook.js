import { computePosition, flip, shift, offset, size } from '@floating-ui/dom'
import './foliate-js/view.js';
import { FootnoteHandler } from './foliate-js/footnotes.js';
import { Overlayer } from './foliate-js/overlayer.js';
import * as CFI from './foliate-js/epubcfi.js';
import {
  debounce,
  getCSS,
  getLang,
  getPosition,
  getSelectionRange,
  getRealCoverBlob,
} from './utils';
import {
  defaultSetting,
  defaultGlobalCSS,
  defaultGlobalStyles,
  defaultFootnoteGlobalStyles,
  scrollbarStyles,
  buildOptionalCSS,
} from 'src/app/default-reader-setting'
import { postMessage } from 'src/api/service/ebook/book.js';
import { getAnnotationColor } from 'src/utils/book.ts'

// --------------------------------------------------------------------------------
// Ebook Logic
// --------------------------------------------------------------------------------

// Default style
let globalReader = null;
let style = defaultSetting;
let footnoteDialogShow = false;

const setStyle = (userStyle) => {
  if (!globalReader) {
    return
  }

  if (userStyle && typeof userStyle === 'object') {
    style = userStyle;
  }

  const spread = style.maxColumnCount > 1 ? 'both' : 'none'
  reader.view.renderer.setAttribute('flow', style.flow);
  reader.view.renderer.setAttribute('top-margin', `${style.topMargin}px`);
  reader.view.renderer.setAttribute('bottom-margin', `${style.bottomMargin}px`);
  reader.view.renderer.setAttribute('margin', `${style.margin}px`);
  reader.view.renderer.setAttribute('background-color', style.backgroundColor);
  reader.view.renderer.setAttribute('gap', `${style.columnGap}%`);
  reader.view.renderer.setAttribute('max-column-count', style.maxColumnCount);
  reader.view.renderer.setAttribute('max-inline-size', `${style.maxInlineSize}px`);
  reader.view.renderer.setAttribute('spread', spread); // Todo: none, both, auto

  // zoom
  const zoom = style.zoom;
  const zoomValue = typeof zoom === 'string' ? parseFloat(zoom) : zoom;
  const isZoomedIn = typeof zoomValue === 'number' && !Number.isNaN(zoomValue) && zoomValue > 1.0;
  reader.view.renderer.style.justifyContent = isZoomedIn ? 'flex-start' : 'center';
  reader.view.renderer.setAttribute('zoom', zoom); // 1.2, fit-width, fit-page

  style.animated
    ? reader.view.renderer.setAttribute('animated', 'true')
    : reader.view.renderer.removeAttribute('animated');

  const fontSize = style.fontSize < 16 ? 22 : style.fontSize
  const newStyle = {
    fontSize: fontSize,
    fontName: style.fontName,
    fontPath: style.fontPath,
    fontColor: style.fontColor,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
    spacing: style.spacing,
    paragraphSpacing: style.paragraphSpacing,
    textIndent: style.textIndent,
    backgroundImage: style.backgroundImage,
    backgroundColor: style.backgroundColor,
    justify: style.justify,
    hyphenate: style.hyphenate,
  };

  // CSS
  const globalCSS = style.globalCSSEnabled
    ? style.globalCSS || defaultGlobalCSS
    : ''
  const bookCSS = style.bookCSS
  const optionalCSS = buildOptionalCSS(style.bookHideItems)

  const combinedCSS = getCSS(newStyle) + defaultGlobalStyles + globalCSS + bookCSS + optionalCSS;
  reader.view.renderer.setStyles?.(combinedCSS);

  // Renderer shadowRoot styles
  const renderer = reader.view.renderer;
  const scrollbarCssStyles = scrollbarStyles();
  if (renderer && renderer.shadowRoot) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      ${scrollbarCssStyles}
    `);

    renderer.shadowRoot.adoptedStyleSheets = [
      ...renderer.shadowRoot.adoptedStyleSheets,
      sheet
    ];
  }
};

const locales = 'en'
const percentFormat = new Intl.NumberFormat(locales, { style: 'percent' })
const listFormat = new Intl.ListFormat(locales, { style: 'short', type: 'conjunction' })

const formatLanguageMap = x => {
  if (!x) return ''
  if (typeof x === 'string') return x
  const keys = Object.keys(x)
  return x[keys[0]]
}

const formatOneContributor = contributor => typeof contributor === 'string'
  ? contributor : formatLanguageMap(contributor?.name)

const formatContributor = contributor => Array.isArray(contributor)
  ? listFormat.format(contributor.map(formatOneContributor))
  : formatOneContributor(contributor);

const getView = async (bookElement, file) => {
  const view = document.createElement('foliate-view');
  bookElement.append(view);

  await view.open(file);
  return view;
}

// --------------------------------------------------------------------------------
// Ebook Reader
// --------------------------------------------------------------------------------
class Ebook {
  annotations = new Map();
  annotationsByValue = new Map();
  #footnoteHandler = new FootnoteHandler();
  #doc;
  #index;
  #originalContent;
  #lastClickCoords = null

  constructor() {
    this.#footnoteHandler.addEventListener('before-render', (e) => {
      const { view } = e.detail;
      this.setView(view);
      replaceFootnote(view);
    });

    this.#footnoteHandler.addEventListener('render', (e) => {
      const { view } = e.detail

      // 1. Display
      footnoteDialog.style.display = 'block'
      footnoteDialog.style.visibility = 'hidden'

      // 2. Footnote position
      if (this.#lastClickCoords) {
        const virtualElement = {
          getBoundingClientRect: () => ({
            ...this.#lastClickCoords,
            width: this.#lastClickCoords.width || 1,
            height: this.#lastClickCoords.height || 1
          })
        }

        computePosition(virtualElement, footnoteDialog, {
          placement: 'bottom',
          middleware: [
            offset(16),
            flip(),
            shift({ padding: 16 }),
            size({
              apply({ availableWidth, availableHeight }) {
                Object.assign(footnoteDialog.style, {
                  maxWidth: `${Math.min(availableWidth - 32, 640)}px`,
                  maxHeight: `${Math.min(availableHeight - 40, 480)}px`
                })
              }
            })
          ],
        }).then(({ x, y }) => {
          Object.assign(footnoteDialog.style, {
            left: `50%`,
            top: `${y}px`,
            transformOrigin: 'top center',
            transform: 'translate(-50%, 0)',
            margin: '0',
            visibility: 'visible'
          })
          footnoteDialog.classList.add('is-open')
          footnoteDialogShow = true
        })
      } else {
        Object.assign(footnoteDialog.style, {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          margin: '0',
          visibility: 'visible'
        })
        footnoteDialog.classList.add('is-open')
      }
    })
    this.#originalContent = null
  }

  get doc() {
    return this.#doc
  }

  async open(bookElement, file,
             { cfi = '', importing = false, userStyle }) {
    this.view = await getView(bookElement, file);
    if (importing) return;

    // Fixed-layout spread
    const renderer = this.view.renderer;
    const isFixedLayout = renderer?.tagName === 'FOLIATE-FXL';
    const spread = style.maxColumnCount > 1 ? 'both' : 'none';
    if (isFixedLayout && renderer.book && spread === 'none') {
      renderer.book.rendition.spread = spread;
      await renderer.open(renderer.book);
    }

    // events
    this.view.addEventListener('load', this.#onLoad.bind(this));
    this.view.addEventListener('relocate', this.#onRelocate.bind(this));
    this.view.addEventListener('click-view', this.#onClickView.bind(this));
    document.addEventListener('keydown', this.#handleKeydown.bind(this));

    setStyle(userStyle);
    if (cfi) {
      await this.view.init({ lastLocation: cfi });
    } else {
      this.view.renderer.next();
    }
    await this.setView(this.view);
  }

  async setView(view) {
    const { book } = view;

    // load and show highlights embedded in the file by Calibre
    const bookmarks = await book.getCalibreBookmarks?.()
    if (bookmarks) {
      const { fromCalibreHighlight } = await import('./foliate-js/epubcfi.js')
      for (const obj of bookmarks) {
        if (obj.type === 'highlight') {
          const value = fromCalibreHighlight(obj)
          const color = obj.style.which
          const note = obj.notes
          const annotation = { value, color, note }
          const list = this.annotations.get(obj.spine_index)
          if (list) list.push(annotation)
          else this.annotations.set(obj.spine_index, [annotation])
          this.annotationsByValue.set(value, annotation)
        }
      }
    }

    // event listeners
    view.addEventListener('create-overlay', e => {
      const { index } = e.detail
      const list = this.annotations.get(index)
      if (list) for (const annotation of list)
        view.addAnnotation(annotation)
    });
    view.addEventListener('draw-annotation', e => {
      const { draw, annotation } = e.detail
      const { color, style } = annotation
      let overlay
      switch (style) {
        case 'underline':
          overlay = Overlayer.underline
          break
        case 'squiggly':
          overlay = Overlayer.squiggly
          break
        case 'strikethrough':
          overlay = Overlayer.strikethrough
          break
        default:
          overlay = Overlayer.highlight
          break
      }

      draw(overlay, { color: getAnnotationColor(color) })
    });
    view.addEventListener('show-annotation', e => {
      const annotation = this.annotationsByValue.get(e.detail.value);
      const pos = getPosition(e.detail.range);
      if (annotation.title) {
        onAnnotationClick(annotation, pos);
      }
    });
    view.addEventListener('external-link', (e) => {
      e.preventDefault();
      postMessage('onExternalLink', e.detail);
    });

    view.addEventListener('link', (e) => {
      this.#footnoteHandler.handle(this.view.book, e)?.catch((err) => {
        console.warn(err)
        this.view.goTo(e.detail.href)
      })
    })

    view.history.addEventListener('pushstate', (e) => {
      postMessage('onPushState', {
        canGoBack: view.history.canGoBack,
        canGoForward: view.history.canGoForward,
      });
    });
    view.addEventListener('click-image', async (e) => {
      const blobUrl = e.detail.img.src;
      const blob = await fetch(blobUrl).then((r) => r.blob());
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      postMessage('onImageClick', base64);
    });
  }

  addAnnotation(annotation) {
    if (!annotation.value) {
      return
    }

    const { value } = annotation;
    const spineCode = (value.split('/')[2].split('!')[0] - 2) / 2;

    const list = this.annotations.get(spineCode);
    if (list) list.push(annotation);
    else this.annotations.set(spineCode, [annotation]);

    this.annotationsByValue.set(value, annotation);

    this.view?.addAnnotation(annotation);
  }

  removeAnnotation(cfi) {
    const annotation = this.annotationsByValue.get(cfi)
    if (!annotation) return

    const { value } = annotation
    const spineCode = (value.split('/')[2].split('!')[0] - 2) / 2

    const list = this.annotations.get(spineCode)
    if (list) {
      const index = list.findIndex(a => a.id === annotation.id)
      if (index !== -1) list.splice(index, 1)
    }

    this.annotationsByValue.delete(value)
    this.view.addAnnotation(annotation, true)
  }

  renderAnnotations(list) {
    for (const item of list) {
      const { id, value, type, style, color, title } = item;
      const annotation = {
        id,
        value,
        type,
        style,
        color,
        title,
      }

      this.addAnnotation(annotation);
    }
  }

  #handleKeydown(event) {
    postMessage('onKeydown', event);
  }

  #handleWheel(event) {
    postMessage('onWheel', event);
  }

  #onLoad({ detail: { doc, index } }) {
    this.#doc = doc;
    this.#index = index;
    this.#originalContent = doc.cloneNode(true);
    doc.addEventListener('keydown', this.#handleKeydown.bind(this));
    doc.addEventListener('wheel', this.#handleWheel.bind(this), { passive: false });

    doc.addEventListener('pointerdown', (event) => {
      const renderer = this.view?.renderer
      const target = event.composedPath?.()?.[0] || event.target

      if (target && renderer) {
        const rect = target.getBoundingClientRect()
        const containerRect = renderer.getBoundingClientRect()

        this.#lastClickCoords = {
          left: event.clientX,
          right: event.clientX,
          x: event.clientX,

          top: containerRect.top + rect.top,
          bottom: containerRect.top + rect.bottom,
          y: containerRect.top + rect.top,

          width: rect.width,
          height: rect.height
        }
      } else {
        this.#lastClickCoords = {
          width: 0,
          height: 0,
          top: event.clientY,
          bottom: event.clientY,
          left: event.clientX,
          right: event.clientX,
          x: event.clientX,
          y: event.clientY
        }
      }
    }, { passive: true })

    setSelectionHandler(this.view, doc, index);
  }

  #onRelocate({ detail }) {
    // Fixed Layout Ebook
    const isFixedLayout = this.view?.isFixedLayout;
    if (isFixedLayout) {
      onRelocated(detail);
      return;
    }

    // Other Ebooks
    const cfi = detail.cfi;
    const parts = CFI.parse(cfi);
    if (Array.isArray(parts)) {
      // console.log('Ignore non-range CFI', parts, cfi);
      return;
    }
    onRelocated(detail);
  }

  #onClickView({ detail: { x, y } }) {
    if (this.#lastClickCoords) {
      this.#lastClickCoords = {
        ...this.#lastClickCoords,
        left: x,
        right: x,
        x: x,
      }
    }

    const coordinatesX = x / window.innerWidth;
    const coordinatesY = y / window.innerHeight;
    onClickView(coordinatesX, coordinatesY);
    footnoteDialog.close();
  }
}

const openBook = async (bookElement, data,
                        { cfi = '', importing = false, userStyle }) => {
  const reader = new Ebook();
  globalThis.reader = reader;
  globalReader = reader

  try {
    await reader.open(bookElement, data.file,
      { cfi, importing, userStyle });
  } catch (err) {
    console.log('openBook', err)
    postMessage('onOpenFailed', {
      ...data,
      err: err
    })
    return
  }

  if (!importing) {
    onSetToc();
    initFootDialog();
  } else {
    getMetadata(data);
  }
}

const getMetadata = async (data) => {
  const coverBlob = await reader.view.book.getCover();
  // console.log('cover', coverBlob)
  if (coverBlob) {
    const realCoverBlob = await getRealCoverBlob(coverBlob, reader.view.book)
    // cover is a blob, so we need to convert it to base64
    const fileReader = new FileReader();
    fileReader.readAsDataURL(realCoverBlob);
    fileReader.onloadend = () => {
      postMessage('onMetadata', {
        ...reader.view.book.metadata,
        ...data,
        cover: fileReader.result,
      });
    };
  } else {
    postMessage('onMetadata', {
      ...reader.view.book.metadata,
      ...data,
      cover: null,
    });
  }
};

const setSelectionHandler = (view, doc, index) => {
  // doc.addEventListener('pointerdown', () => isSelecting = true);
  // if windows
  if (navigator.platform.includes('Win')
    || navigator.platform.includes('Mac')
    || navigator.platform.includes('Linux')) {
    doc.addEventListener('pointerup', () => handleSelection(view, doc, index));
  }
  // doc.addEventListener('selectionchange', () => handleSelection(view, doc, index));

  if (!view.isFixedLayout)
    // go to the next page when selecting to the end of a page
    // this makes it possible to select across pages
    doc.addEventListener(
      'selectionchange',
      debounce(() => {
        //            if (!isSelecting) return
        if (view.renderer.getAttribute('flow') !== 'paginated') return;
        const { lastLocation } = view;
        if (!lastLocation) return;
        const selRange = getSelectionRange(doc.getSelection());
        if (!selRange) return;
        if (
          selRange.compareBoundaryPoints(
            Range.END_TO_END,
            lastLocation.range
          ) >= 0
        ) {
          view.next();
        }
      }, 1000)
    );
};

const handleSelection = (view, doc, index) => {
  const sel = doc.getSelection();
  const range = getSelectionRange(sel);
  if (!range) return;
  const pos = getPosition(range);
  const cfi = view.getCFI(index, range);
  const lang = getLang(range.commonAncestorContainer);
  let text = sel.toString();
  if (!text) {
    const newSel = range.startContainer.ownerDocument.getSelection();
    newSel.removeAllRanges();
    newSel.addRange(range);
    text = newSel.toString();
  }

  onSelectionEnd({ index, range, lang, cfi, pos, text });
};

const onAnnotationClick = (annotation, pos) => {
  postMessage('onAnnotationClick', {annotation, pos});
}

const initFootDialog = () => {
  const footnoteDialog = document.getElementById('footnote-dialog');

  footnoteDialog.close = () => {
    footnoteDialog.style.display = 'none';
    footnoteDialogShow = false;
    postMessage('onFootnoteClose', null);
  };

  footnoteDialog.addEventListener('click', (e) =>
    e.target === footnoteDialog ? footnoteDialog.close() : null
  );

  globalThis.footnoteDialog = footnoteDialog;
}

const replaceFootnote = (view) => {
  clearSelection()
  const mainContainer = footnoteDialog.querySelector('main')
  mainContainer.replaceChildren(view)

  view.addEventListener('load', (e) => {
    const { doc, index } = e.detail
    globalThis.footnoteSelection = () => handleSelection(view, doc, index)
    setSelectionHandler(view, doc, index)

    // Content height
    requestAnimationFrame(() => {
      if (doc && doc.body) {
        doc.body.style.margin = '0'
        doc.body.style.padding = '0'
        const contentHeight = doc.body.scrollHeight
        const finalHeight = contentHeight + 30
        const boundedHeight = Math.max(60, Math.min(finalHeight, 480))
        footnoteDialog.style.height = `${boundedHeight}px`
      }
    })
  })

  const { renderer } = view;
  renderer.setAttribute('flow', 'scrolled');
  renderer.setAttribute('gap', '5%');
  const footNoteStyle = {
    fontSize: style.fontSize,
    fontName: style.fontName,
    fontPath: style.fontPath,
    letterSpacing: style.letterSpacing,
    spacing: style.spacing,
    textIndent: style.textIndent,
    fontColor: style.fontColor,
    backgroundColor: 'transparent',
    justify: true,
    hyphenate: true,
  };

  const combinedCSS = getCSS(footNoteStyle) + defaultFootnoteGlobalStyles
  renderer.setStyles(combinedCSS);
}

const closeFootnote = () => {

}

// --------------------------------------------------------------------------------
// postMessage API
// --------------------------------------------------------------------------------
const onClickView = (x, y) => {
  postMessage('onClickView', { x, y });
}

const onRelocated = (detail) => {
  postMessage('onRelocated', detail);
}

const onSelectionEnd = (selection) => {
  if (footnoteDialogShow) {
    postMessage('onSelectionEnd', { ...selection, footnote: true });
  } else {
    postMessage('onSelectionEnd', { ...selection, footnote: false });
  }
};

const onSetToc = () => postMessage('onSetToc',
  reader.view.book.toc);

const changeStyle = (newStyle) => {
  style = {
    ...style,
    ...newStyle
  }
  setStyle();
}

/// Search
const search = async (text, opts) => {
  opts == null && (opts = {
    'scope': 'book',
    'matchCase': false,
    'matchDiacritics': false,
    'matchWholeWords': false,
  });
  const query = text.trim();
  if (!query) return;

  const index = opts.scope === 'section' ? reader.index : null;

  for await (const result of reader.view.search({ ...opts, query, index })) {
    if (result === 'done') {
      postMessage('onSearch', { progress: 1.0 });
    }
    else if ('progress' in result)
      postMessage('onSearch', { progress: result.progress });
    else {
      postMessage('onSearch', result);
    }
  }
}
const clearSearch = () => reader.view.clearSearch();

const isInside = (cfi, rangeCfi) => {
  try {
    if (cfi.split('!')[0] !== rangeCfi.split('!')[0]) {
      return false;
    }

    // Page range
    const pageStart = CFI.collapse(rangeCfi, false);
    const pageEnd = CFI.collapse(rangeCfi, true);

    // Check cfi inside [pageStart, pageEnd]
    const isAfterStart = CFI.compare(cfi, pageStart) >= 0;
    const isBeforeEnd = CFI.compare(cfi, pageEnd) <= 0;

    return isAfterStart && isBeforeEnd;
  } catch (e) {
    return false;
  }
}

const parseCFI = (cfi) => {
  const start = CFI.collapse(cfi, false);
  const end = CFI.collapse(cfi, true);

  return { start, end }
}

// --------------------------------------------------------------------------------
// Ebook API
// --------------------------------------------------------------------------------
const goToHref = (href) => reader.view.goTo(href);
const goToPercent = (percent) => reader.view.goToFraction(percent);
const nextPage = () => reader.view.next();
const prevPage = () => reader.view.prev();
const nextSection = () => reader.view.renderer.nextSection();
const prevSection = () => reader.view.renderer.prevSection();
const addAnnotation = (annotation) =>
  reader.addAnnotation(annotation);
const removeAnnotation = (cfi) =>
  reader.removeAnnotation(cfi);
const renderAnnotations = (annotations) =>
  reader.renderAnnotations(annotations);
const clearSelection = () =>
  reader.view.deselect();

// TTS
const initTTS = () => reader.view.initTTS('sentence');
const ttsStart = async () => {
  // Init
  await initTTS();

  // Read from selection or the last location
  const sel = reader.doc.getSelection();
  let range = getSelectionRange(sel);
  if (!range) {
    range = reader.view.lastLocation.range
  }
  return reader.view.tts.from(range);
};
const ttsResume = () => reader.view.tts.resume();
const ttsStop = () => reader.view.initTTS('sentence');
const ttsCurrentDetails = async () => {
  await initTts();
  return reader.view.tts.currentDetail();
}
const ttsCollectDetails = async (count = 1, includeCurrent = false, offset = 1) => {
  await initTts();
  return reader.view.tts.collectDetails(count, { includeCurrent, offset });
}

const ttsNext = async (move = true) => {
  const result = reader.view.tts.next(true, move);
  if (result || !move) return result;
  return await ttsNextSection();
};
const ttsPrev = () => {
  const result = reader.view.tts.prev(true);
  if (result) return result;
  return ttsPrevSection(true);
};

const ttsNextSection = async () => {
  await nextSection();
  await initTTS();
  return ttsNext();
};
const ttsPrevSection = async (last) => {
  await prevSection();
  await initTTS();
  return last ? reader.view.tts.end() : ttsNext();
};

window.ebook = {
  open: openBook,
  nextPage: nextPage,
  prevPage: prevPage,
  nextSection: nextSection,
  prevSection: prevSection,
  goToHref: goToHref,
  goToPercent: goToPercent,
  goBack: () => reader.view.history.back(),
  goForward: () => reader.view.history.forward(),
  clearHistory: () => reader.view.history.clear(),
  canGoBack: () => reader.view.history.canGoBack,
  canGoForward: () => reader.view.history.canGoForward,
  addAnnotation: addAnnotation,
  removeAnnotation: removeAnnotation,
  renderAnnotations: renderAnnotations,
  changeStyle: changeStyle,
  search: search,
  clearSearch: clearSearch,
  ttsStart: ttsStart,
  ttsResume: ttsResume,
  ttsStop: ttsStop,
  ttsNext: ttsNext,
  ttsPrev: ttsPrev,
  ttsNextSection: ttsNextSection,
  ttsPrevSection: ttsPrevSection,
  isInside,
  parseCFI,
}
