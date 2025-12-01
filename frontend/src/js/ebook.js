import './foliate-js/view.js';
import { FootnoteHandler } from './foliate-js/footnotes.js';
import { Overlayer } from './foliate-js/overlayer.js';
import * as CFI from './foliate-js/epubcfi.js';
import {
  debounce,
  getCSS,
  getLang,
  getPosition,
  getSelectionRange
} from './utils';
import defaultSetting from 'src/app/default-reader-setting';
import { postMessage } from 'src/api/service/ebook/book.js';

// --------------------------------------------------------------------------------
// Ebook Logic
// --------------------------------------------------------------------------------

// Default style
let style = defaultSetting;

const setStyle = (userStyle) => {
  if (userStyle && typeof userStyle === 'object') {
    style = userStyle;
  }
  const turn = {
    scroll: false,
    animated: true,
  };

  switch (style.pageTurnStyle) {
    case 'slide':
      turn.scroll = false;
      turn.animated = true;
      break;
    case 'scroll':
      turn.scroll = true;
      turn.animated = true;
      break;
    case 'noAnimation':
      turn.scroll = false;
      turn.animated = false;
      break;
  }

  reader.view.renderer.setAttribute(
    'flow',
    turn.scroll ? 'scrolled' : 'paginated'
  );
  reader.view.renderer.setAttribute('top-margin', `${style.topMargin}px`);
  reader.view.renderer.setAttribute('bottom-margin', `${style.bottomMargin}px`);
  reader.view.renderer.setAttribute('gap', `${style.sideMargin}%`);
  reader.view.renderer.setAttribute('background-color', style.backgroundColor);
  reader.view.renderer.setAttribute('max-column-count', style.maxColumnCount);
  reader.view.renderer.setAttribute('max-inline-size', `${style.maxInlineSize}px`);

  turn.animated
    ? reader.view.renderer.setAttribute('animated', 'true')
    : reader.view.renderer.removeAttribute('animated');

  const newStyle = {
    fontSize: style.fontSize,
    fontName: style.fontName,
    fontPath: style.fontPath,
    letterSpacing: style.letterSpacing,
    spacing: style.spacing,
    paragraphSpacing: style.paragraphSpacing,
    textIndent: style.textIndent,
    fontColor: style.fontColor,
    backgroundImage: style.backgroundImage,
    backgroundColor: style.backgroundColor,
    justify: style.justify,
    hyphenate: style.hyphenate,
  };
  reader.view.renderer.setStyles?.(getCSS(newStyle));
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

  constructor() {
    this.#footnoteHandler.addEventListener('before-render', (e) => {
      const { view } = e.detail;
      this.setView(view);
      replaceFootnote(view);
      console.log('before-render footnote');
    });
    this.#footnoteHandler.addEventListener('render', (e) => {
      const { view } = e.detail;
      footnoteDialog.show();
      footnoteDialog.dispatchEvent(new Event('footnote-dialog-shown'));
      console.log('render footnote');
    });
    this.#originalContent = null;
  }

  async open(bookElement, file,
             { cfi = '', importing = false, userStyle }) {
    this.view = await getView(bookElement, file);
    if (importing) return;

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
      const { color } = annotation
      draw(Overlayer.highlight, { color })
    });
    view.addEventListener('show-annotation', e => {
      const annotation = this.annotationsByValue.get(e.detail.value);
      const pos = getPosition(e.detail.range);
      if (annotation.note) {
        onAnnotationClick(annotation, pos);
      }
    });
    view.addEventListener('external-link', (e) => {
      e.preventDefault();
      // onExternalLink(e.detail); // todo
    });
    view.addEventListener('link', (e) =>
      this.#footnoteHandler.handle(this.view.book, e)?.catch((err) => {
        console.warn(err);
        this.view.goTo(e.detail.href);
      })
    );

    view.history.addEventListener('pushstate', (e) => {
      postMessage('onPushState', {
        canGoBack: view.history.canGoBack,
        canGoForward: view.history.canGoForward,
      });
    });
    view.addEventListener('click-image', async (e) => {
      console.log('click-image', e.detail.img.src);
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
    const { value } = annotation;
    const spineCode = (value.split('/')[2].split('!')[0] - 2) / 2;

    const list = this.annotations.get(spineCode);
    if (list) list.push(annotation);
    else this.annotations.set(spineCode, [annotation]);

    this.annotationsByValue.set(value, annotation);

    this.view.addAnnotation(annotation);
  }

  removeAnnotation(cfi) {
    const annotation = this.annotationsByValue.get(cfi)
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
      const { id, value, type, color, note } = item;
      const annotation = {
        id,
        value,
        type,
        color,
        note
      }

      this.addAnnotation(annotation);
    }
  }

  #handleKeydown(event) {
    const k = event.key
    if (k === 'ArrowLeft' || k === 'h') this.view.goLeft()
    else if(k === 'ArrowRight' || k === 'l') this.view.goRight()
    postMessage('onKeydown', {
      key: k,
      event: event
    });
  }
  #onLoad({ detail: { doc, index } }) {
    this.#doc = doc;
    this.#index = index;
    this.#originalContent = doc.cloneNode(true);
    doc.addEventListener('keydown', this.#handleKeydown.bind(this));

    setSelectionHandler(this.view, doc, index);
  }
  #onRelocate({ detail }) {
    const cfi = detail.cfi;
    const parts = CFI.parse(cfi);
    if (Array.isArray(parts)) {
      console.log('Ignore non-range CFI');
      return;
    }
    onRelocated(detail);
  }
  #onClickView({ detail: { x, y } }) {
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

  try {
    await reader.open(bookElement, data.file,
      { cfi, importing, userStyle });
  } catch (err) {
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
  const cover = await reader.view.book.getCover();
  if (cover) {
    // cover is a blob, so we need to convert it to base64
    const fileReader = new FileReader();
    fileReader.readAsDataURL(cover);
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
      sha1: data.sha1,
      filePath: data.filePath,
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
  //    isSelecting = false;
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
  // onSelectionEnd({ index, range, lang, cfi, pos, text });
  // return
  onSelectionEnd({ index, range, lang, cfi, pos, text });
};

const onAnnotationClick = (annotation, pos) => {
  postMessage('onAnnotationClick', {annotation, pos});
}

const initFootDialog = () => {
  const footnoteDialog = document.getElementById('footnote-dialog');
  // console.log('footnoteDialog', footnoteDialog);

  footnoteDialog.addEventListener('close', () => {
    postMessage('onFootnoteClose', null);
  });
  footnoteDialog.addEventListener('click', (e) =>
    e.target === footnoteDialog ? footnoteDialog.close() : null
  );

  globalThis.footnoteDialog = footnoteDialog;
}

const replaceFootnote = (view) => {
  clearSelection();
  footnoteDialog.querySelector('main').replaceChildren(view);

  view.addEventListener('load', (e) => {
    const { doc, index } = e.detail;
    globalThis.footnoteSelection = () => handleSelection(view, doc, index);
    setSelectionHandler(view, doc, index);
  });

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
  renderer.setStyles(getCSS(footNoteStyle));
  // set background color of dialog
  // if #rrggbbaa, replace aa to ee
  footnoteDialog.style.backgroundColor =
    style.backgroundColor.slice(0, 7) + 'ee';
};

// --------------------------------------------------------------------------------
// postMessage API
// --------------------------------------------------------------------------------
const onClickView = (x, y) => {
  postMessage('onClickView', { x, y });
}

const onRelocated = (detail) => {
  postMessage('onRelocated', {
    tocItem: detail.tocItem,
    location: detail.location,
    chapterLocation: detail.chapterLocation,
    section: detail.section,
    cfi: detail.cfi,
    percentage: detail.fraction
  });
}

const onSelectionEnd = (selection) => {
  if (footnoteDialog.open) {
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

// --------------------------------------------------------------------------------
// Ebook API
// --------------------------------------------------------------------------------
const goToHref = (href) => reader.view.goTo(href);
const goToPercent = (percent) => reader.view.goToFraction(percent);
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
const initTTS = () => reader.view.initTTS();
const ttsStart = async () => {
  await initTTS();
  return reader.view.tts.from(reader.view.lastLocation.range);
};
const ttsStop = () => reader.view.initTTS(true);
const ttsPrepare = () => reader.view.tts.prepare();

const ttsNext = async () => {
  const result = reader.view.tts.next(true);
  if (result) return result;
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
  nextPage: () => reader.view.next(),
  prevPage: () => reader.view.prev(),
  goToHref: goToHref,
  goToPercent: goToPercent,
  addAnnotation: addAnnotation,
  removeAnnotation: removeAnnotation,
  renderAnnotations: renderAnnotations,
  changeStyle: changeStyle,
  search: search,
  clearSearch: clearSearch,
  ttsStart: ttsStart,
  ttsStop: ttsStop,
  ttsPrepare: ttsPrepare,
  ttsNext: ttsNext,
  ttsPrev: ttsPrev,
  ttsNextSection: ttsNextSection,
  ttsPrevSection: ttsPrevSection,
}
