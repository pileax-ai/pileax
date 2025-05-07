/**
 * Book
 *
 * @version 1.0
 */
import 'src/js/reader.js';
import { notifyWarning } from 'core/utils/control';
import useDialog from 'core/hooks/useDialog';
import useApi from 'src/hooks/useApi';
import useReader from 'src/hooks/useReader';
import useBook from 'src/hooks/useBook';
import { bookService } from 'src/service/remote/book';
import { BookOperation, ReadingMode } from 'src/types/reading';
import { base64ToFile, getFileSHA1 } from 'src/utils/book';

const { getBookByPath } = useApi();
const { openDialog } = useDialog();
const { setQueryTimer, style } = useReader();
const {
  store,
  bookId,
  operation,
  setProgress,
  setSelection,
  setToc,
  setOperation,
  setSearch,
  readingMode,
} = useBook();

// ---------------------------------------------------------
// From Reader
// ---------------------------------------------------------
/**
 * Reader postMessage
 * @param name
 * @param data
 */
export const postMessage = (name :string, data :any) => {
  console.log('postMessage', name, data);
  switch (name) {
    case 'onAnnotationClick':
      setSelection({
        ...data,
        text: data.annotation.note,
      });
      break;
    case 'onClickView':
      setSelection({});
      break;
    case 'onKeydown':
      onKeydown(data);
      break;
    case 'onImageClick':
      openDialog({
        type: 'image-viewer',
        message: data
      });
      break;
    case 'onMetadata':
      onMetadata(data);
      break;
    case 'onRelocated':
      onRelocated(data);
      break;
    case 'onSetToc':
      setToc(data);
      break;
    case 'onSelectionEnd':
      setSelection(data);
      break;
    case 'onSearch':
      setSearch(data);
      break;
    default:
      break;
  }
}

const onKeydown = (data: Indexable) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'h', 'l'];
  if (keys.indexOf(data.key) >= 0) {
    setManual();
  }
}

const onRelocated = (data: Indexable) => {
  if (operation.value === BookOperation.Manual) {
    setProgress(data);

    // Only save reading progress in Read mode.
    if (readingMode.value === ReadingMode.Read) {
      saveBookProgress(data);
    }
  } else if (operation.value === BookOperation.Load) {
    setProgress(data);
  }
  store.setTempProgress(data);

  // Todo: 可能没保存最终进度
  setManual(BookOperation.None);
}

// ---------------------------------------------------------
// To Reader
// ---------------------------------------------------------
const changeStyle = (newStyle: Indexable) => {
  window.ebook.changeStyle(newStyle);
}

const search = (text: string, opts: Indexable) => {
  store.startSearch(text);
  window.ebook.search(text, opts);
}

const clearSearch = () => {
  store.clearSearch();
  window.ebook.clearSearch();
}

const goToHref = (href: string, manual = false) => {
  if (manual) {
    setManual();
  }
  window.ebook.goToHref(href);
}

const goToPercent = (percent: number) => {
  window.ebook.goToPercent(percent);
}

const prevPage = () => {
  setManual();
  window.ebook.prevPage();
}

const nextPage = () => {
  setManual();
  window.ebook.nextPage();
}

const ttsStart = () => window.ebook.ttsStart();
const ttsStop = () => window.ebook.ttsStop();
const ttsPrepare = () => window.ebook.ttsPrepare();
const ttsNext = () => window.ebook.ttsNext();
const ttsPrev = () => window.ebook.ttsPrev();

const setManual = (operation = BookOperation.Manual) => {
  // console.log('operation', operation)
  setOperation(operation);
}

// --------------------------------------------------------------------------------
// Electron
// --------------------------------------------------------------------------------
const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const importBooks = async (filePaths: string[]) => {
  for (const filePath of filePaths) {
    await openBook(document.body, filePath, '', true);
    await sleep(500);
  }
}

/**
 * Open book
 *
 * @param bookElement
 * @param filePath
 * @param cfi
 * @param importing
 */
const openBook = async (bookElement: any, filePath: string, cfi = '', importing = false) => {
  return new Promise((resolve, reject) => {
    window.electronAPI.readBookFile(filePath).then((res: any) => {
      const fileName = filePath.split('/').pop() ?? '';
      const file = new File([res.buffer], fileName);
      const data = {
        saving: 'local',
        file: file,
        sha1: res.sha1,
        filePath: filePath
      };

      console.log('openBook', cfi)
      window.ebook.open(bookElement, data,
        { cfi, importing, userStyle: style.value });
      setManual(BookOperation.Load);
      resolve(data);
    }).catch((err: any) => {
      console.error('打开文件失败：', err);
      reject(err);
    })
  });
}

/**
 * Open book
 *
 * @param bookElement
 * @param filePath
 * @param cfi
 */
const openBookRemote = async (bookElement: any, filePath: string, cfi = '') => {
  const bookUrl = getBookByPath(filePath);
  return new Promise((resolve, reject) => {
    fetch(bookUrl)
      .then((res: any) => res.blob())
      .then((blob) => {

      const file = new File([blob], new URL(bookUrl, window.location.origin).pathname);
      const data = {
        saving: 'local',
        file: file,
        filePath: filePath
      };

      console.log('openBook', cfi)
      window.ebook.open(bookElement, data,
        { cfi, userStyle: style.value });
      setManual(BookOperation.Load);
      resolve(data);
    }).catch((err: any) => {
      console.error('打开文件失败：', err);
      reject(err);
    })
  });
}

const uploadBook = async (file: File) => {
  const data = {
    saving: 'remote',
    file: file,
    sha1: await getFileSHA1(file),
    filePath: ''
  }
  window.ebook.open(document.body, data, { importing: true});
}

const onMetadata = async (metadata: any) => {
  if (metadata.saving === 'remote') {
    await savingBookRemote(metadata);
  } else {
    await savingBook(metadata);
  }
}

const savingBookRemote = async (metadata: any) => {
  console.log('savingBookRemote', metadata);
  bookService.getBookByUuid(metadata.sha1).then(res => {
    notifyWarning('书已存在');
  }).catch(err => {
    const coverFile = base64ToFile(metadata.cover, 'cover');
    console.log('cover', coverFile)
    const book = buildBook(metadata, {
      path: metadata.sha1,
      fileName: metadata.file.name
    });
    // Save book files and metadata
    bookService.uploadBook(metadata.file, coverFile, book).then(res => {
      console.log('upload', res);
      setQueryTimer(Date.now());
    })
  })
}

const savingBook = async (metadata: any) => {
  console.log('savingBook', metadata);
  bookService.getBookByUuid(metadata.sha1).then(res => {
    notifyWarning('书已存在');
  }).catch(err => {
    // Save book files
    const { sha1, filePath, cover } = metadata;
    window.electronAPI.saveBookFiles({ sha1, filePath, cover }).then((res: any) => {
      const book = buildBook(metadata, res);
      console.log('saveBookFile', book);

      // Save to database
      saveBook(book);
    }).catch((err: any) => {
      console.error('保存文件失败', err);
    })
  })
}

const saveBookProgress = (progress: any) => {
  console.log('saveBookProgress', progress);
  if (!progress.cfi || !progress.percentage) return;
  const params = {
    id: bookId.value,
    readingPosition: progress.cfi,
    readingPercentage: progress.percentage
  }
  saveBook(params);
}

/**
 * Save book to database
 * @param book Book
 */
const saveBook = async (book: any) => {
  bookService.saveBook(book).then((res: any) => {
    setQueryTimer(Date.now());
  }).catch((err: any) => {
    console.error('保存数据库失败', err);
  })
}

const parseAuthor = (data: any) => {
  if (!data) return 'Author';
  console.log('parseAuthor', data);
  let author = data;
  if (Array.isArray(data)) {
    console.log('parseAuthor array', data);
    const arr = data.map(item => {
      return (typeof item === 'object') ? item['name'] : item;
    });
    author = arr.join(',');
  } else if (typeof data === 'object') {
    console.log('parseAuthor object', data);
    author = data['name'] ?? 'unknown';
  }

  return author;
}

const parseBookField = (data: any) => {
  if (!data) return '';
  console.log('parseBookField', data);
  let value = data;
  if (Array.isArray(data)) {
    console.log('parse array', data);
    const arr = data.map(item => {
      return (typeof item === 'object') ? item['name'] : item;
    });
    value = arr.join(',');
  } else if (typeof data === 'object') {
    console.log('parse object', data);
    value = data['name'] ?? 'unknown';
  }

  return value;
}

const parseLanguage = (data: any) => {
  if (!data) return '';
  let author = data;
  if (Array.isArray(data)) {
    author = data.join(',');
  }

  return author;
}

const parseFileExtension = (filePath: string) => {
  return filePath.includes('.') ? filePath.split('.').pop() : '';
}

const buildBook = (metadata: any, fileInfo: any) => {
  return {
    ...fileInfo,
    uuid: metadata.sha1,
    author: parseAuthor(metadata.author),
    title: metadata.title,
    extension: parseFileExtension(fileInfo.fileName),
    language: parseLanguage(metadata.language),
    publisher: parseBookField(metadata.publisher),
    published: metadata.published ?? '',
    description: metadata.description ?? '',
  };
}

/**
 * Pagination query
 *
 * @param title Book title
 */
const queryBook = async (title = '') => {
  const query = {
    pageIndex: 1,
    pageSize: 100,
    condition: {
      title: title
    }
  };
  return new Promise((resolve, reject) => {
    window.electronAPI.dbExecute('Book', 'query', query).then((res: any) => {
      resolve(res);
    }).catch((err: any) => {
      reject(err);
    })
  });
}

const getBook = async (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    bookService.getBook(id).then((res: any) => {
      resolve(res);
    }).catch((err: any) => {
      reject(err);
    })
  });
}

const removeBook = async (id: string) => {
  return new Promise((resolve, reject) => {
    bookService.deleteBook(id).then((res: any) => {
      resolve(res);
    }).catch((err: any) => {
      reject(err);
    })
  });
}

export {
  goToHref,
  goToPercent,
  prevPage,
  nextPage,
  changeStyle,
  search,
  clearSearch,
  ttsStart,
  ttsStop,
  ttsPrepare,
  ttsNext,
  ttsPrev,
  setManual,

  importBooks,
  getBook,
  openBook,
  openBookRemote,
  uploadBook,
  savingBook,
  saveBook,
  queryBook,
  removeBook
}
