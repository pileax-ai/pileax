/**
 * Book
 *
 * @version 1.0
 */
import 'src/js/reader.js';
import { notifyWarning } from 'core/utils/control';
import useDialog from 'core/hooks/useDialog';
import useReader from 'src/hooks/useReader';
import useBook from 'src/hooks/useBook';

const { openDialog } = useDialog();
const { setQueryTimer } = useReader();
const { bookId, setProgress, setSelection, setToc } = useBook();

// --------------------------------------------------------------------------------
// Reader
// --------------------------------------------------------------------------------
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
    case 'onImageClick':
      openDialog({
        type: 'image-viewer',
        message: data
      });
      break;
    case 'onMetadata':
      savingBook(data);
      break;
    case 'onRelocated':
      setProgress(data);
      saveBookProgress(data);
      break;
    case 'onSetToc':
      setToc(data);
      break;
    case 'onSelectionEnd':
      setSelection(data);
      break;
    default:
      break;
  }
}

const changeStyle = (newStyle: Indexable) => {
  window.ebook.changeStyle(newStyle);
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
        file: file,
        sha1: res.sha1,
        filePath: filePath
      };

      window.ebook.open(bookElement, data, cfi, importing);
      resolve(data);
    }).catch((err: any) => {
      console.error('打开文件失败：', err);
      reject(err);
    })
  });
}

const savingBook = async (metadata: any) => {
  console.log('savingBook', metadata);
  // Check duplication
  const existBook = await window.electronAPI.dbExecute('Book', 'findByUuid', metadata.sha1);
  console.log('existBook', existBook);
  if (existBook) {
    notifyWarning('书已存在');
    return;
  }

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

const saveBook = async (book: any) => {
  window.electronAPI.dbExecute('Book', 'save', book).then((res: any) => {
    console.log('saveBook to DB', res);
    setQueryTimer(Date.now());
  }).catch((err: any) => {
    console.error('保存数据库失败', err);
  })
}

const parseAuthor = (data: any) => {
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

const parseLanguage = (data: any) => {
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
    publisher: metadata.publisher ?? '',
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

const getBook = async (id: string) => {
  return new Promise((resolve, reject) => {
    window.electronAPI.dbExecute('Book', 'findById', id).then((res: any) => {
      resolve(res);
    }).catch((err: any) => {
      reject(err);
    })
  });
}

const removeBook = async (id: string) => {
  return new Promise((resolve, reject) => {
    window.electronAPI.dbExecute('Book', 'removeBookAndFiles', id).then((res: any) => {
      resolve(res);
    }).catch((err: any) => {
      reject(err);
    })
  });
}

export {
  changeStyle,

  importBooks,
  getBook,
  openBook,
  savingBook,
  saveBook,
  queryBook,
  removeBook
}
