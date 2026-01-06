/**
 * Book
 *
 * @version 1.0
 */
import { notifyWarning } from 'core/utils/control'
import useDialog from 'core/hooks/useDialog'
import useApi from 'src/hooks/useApi'
import useReader from 'src/hooks/useReader'
import useBook from 'src/hooks/useBook'
import { ebookRender } from 'src/api/service/ebook'
import { bookService, userBookService, workspaceBookService } from 'src/api/service/remote'
import { BookOperation, ReadingMode } from 'src/types/reading'
import { base64ToFile, getFileSHA1 } from 'src/utils/book'
import { getErrorMessage } from 'src/utils/request'

const { getFileUrl } = useApi()
const { openDialog } = useDialog()
const { setQueryTimer, style } = useReader()
const {
  store,
  workspaceBookId,
  bookId,
  operation,
  setProgress,
  setSelection,
  setToc,
  setOperation,
  setSearch,
  readingMode,
} = useBook()

export const uploadBookWaiters = new Map()
export const bookMimeTypes = {
  'application/epub+zip': 'epub',
  'application/pdf': 'pdf',
  'application/x-mobipocket-ebook': 'mobi',
  'application/x-azw3-ebook': 'azw3',
  'application/vnd.amazon.ebook': 'azw3', // AZW3/KF8
  'application/x-fictionbook+xml': 'fb2',
  'application/x-cbr': 'cbz',
  'application/vnd.comicbook+zip': 'cbz',
} as Indexable
export const bookExtensions = ['epub', 'mobi', 'azw3', 'fb2', 'cbz']

// ---------------------------------------------------------
// From Ebook Render
// ---------------------------------------------------------
/**
 * Ebook postMessage
 * @param name
 * @param data
 */
export const postMessage = (name :string, data :any) => {
  // console.log('postMessage', name, data);
  switch (name) {
    case 'onAnnotationClick':
      setSelection({
        ...data,
        text: data.annotation.note,
      })
      break
    case 'onClickView':
      setSelection({})
      break
    case 'onKeydown':
      onKeydown(data)
      break
    case 'onImageClick':
      openDialog({
        type: 'image-viewer',
        message: data
      })
      break
    case 'onMetadata':
      onMetadata(data)
      break
    case 'onOpenFailed':
      onOpenFailed(data)
      break
    case 'onRelocated':
      onRelocated(data)
      break
    case 'onSetToc':
      setToc(data)
      break
    case 'onSelectionEnd':
      setSelection(data)
      break
    case 'onSearch':
      setSearch(data)
      break
    default:
      break
  }
}

const onKeydown = (data: Indexable) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'h', 'l']
  if (keys.indexOf(data.key) >= 0) {
    setManual()
  }
}

const onRelocated = (data: Indexable) => {
  if (operation.value === BookOperation.Manual) {
    setProgress(data)

    // Only save reading progress in Read mode.
    if (readingMode.value === ReadingMode.Read) {
      saveBookProgress(data)
    }
  } else if (operation.value === BookOperation.Load) {
    setProgress(data)
  }
  store.setTempProgress(data)

  // Todo: 可能没保存最终进度
  setManual(BookOperation.None)
}

// ---------------------------------------------------------
// To Ebook Render
// ---------------------------------------------------------
const changeStyle = (newStyle: Indexable) => {
  ebookRender.changeStyle(newStyle)
}

const search = (text: string, opts: Indexable) => {
  store.startSearch(text)
  ebookRender.search(text, opts)
}

const clearSearch = () => {
  store.clearSearch()
  ebookRender.clearSearch()
}

const goToHref = (href: string, manual = false) => {
  if (manual) {
    setManual()
  }
  ebookRender.goToHref(href)
}

const goToPercent = (percent: number) => {
  ebookRender.goToPercent(percent)
}

const prevPage = () => {
  setManual()
  ebookRender.prevPage()
}

const nextPage = () => {
  setManual()
  ebookRender.nextPage()
}

const setManual = (operation = BookOperation.Manual) => {
  // console.log('operation', operation)
  setOperation(operation)
}


/**
 * Open book
 *
 * @param bookElement
 * @param filePath
 * @param cfi
 */
const openBook = async (bookElement: any, filePath: string, cfi = '') => {
  const bookUrl = getFileUrl(filePath)
  return new Promise((resolve, reject) => {
    fetch(bookUrl)
      .then((res: any) => res.blob())
      .then((blob) => {

      const file = new File([blob], new URL(bookUrl, window.location.origin).pathname)
      const data = {
        saving: 'local',
        file: file,
        filePath: filePath
      }

      console.log('openBook', cfi)
      ebookRender.open(bookElement, data,
        { cfi, userStyle: style.value })
      setManual(BookOperation.Load)
      resolve(data)
    }).catch((err: any) => {
      console.error('打开文件失败：', err)
      reject(err)
    })
  })
}

const uploadBook = async (file: File) => {
  const sha1 = await getFileSHA1(file)
  return new Promise((resolve, reject) => {
    const data = {
      saving: 'remote',
      file: file,
      sha1: sha1,
      filePath: ''
    }
    ebookRender.open(document.body, data, { importing: true})

    // Register waiter, resolve/reject in onMetadata/onOpenFailed
    uploadBookWaiters.set(sha1, { resolve, reject })
  })

}

const onMetadata = async (metadata: any) => {
  const sha1 = metadata.sha1
  const waiter = uploadBookWaiters.get(sha1)
  try {
    const book = await savingBookRemote(metadata)
    if (waiter) {
      waiter.resolve(book)
      uploadBookWaiters.delete(sha1)
    }
  } catch (err) {
    if (waiter) {
      waiter.reject()
      uploadBookWaiters.delete(sha1)
    }
  }
}

const onOpenFailed = (metadata: Indexable) => {
  const sha1 = metadata.sha1
  const waiter = uploadBookWaiters.get(sha1)
  if (waiter) {
    waiter.reject(metadata.err)
    uploadBookWaiters.delete(sha1)
  }
}

const savingBookRemote = async (metadata: any) => {
  console.log('savingBookRemote', metadata)
  try {
    // Book uploaded, add to shelf
    const remoteBook = await bookService.getByUuid(metadata.sha1)
    try {
      await workspaceBookService.save({bookId: remoteBook.id})
    } catch (err) {
      const message = getErrorMessage(err)
      if (message?.indexOf('UNIQUE') >= 0) {
        notifyWarning('书已存在')
      }
    }
    return remoteBook
  } catch (err) {
    // New upload
    const coverFile = base64ToFile(metadata.cover, 'cover')
    const book = buildBook(metadata, {
      path: metadata.sha1,
      fileName: metadata.file.name,
    })
    try {
      return await bookService.upload(metadata.file, coverFile, book)
    } catch (err) {
      console.error(err)
    }
  }
}

const saveBookProgress = (progress: any) => {
  console.log('saveBookProgress', progress)
  if (!progress.cfi || !progress.percentage) return
  const params = {
    book_id: bookId.value,
    readingPosition: progress.cfi,
    readingPercentage: progress.percentage
  }
  userBookService.updateReadingProgress(params)
}

const parseAuthor = (data: any) => {
  if (!data) return 'Author'
  console.log('parseAuthor', data)
  let author = data
  if (Array.isArray(data)) {
    console.log('parseAuthor array', data)
    const arr = data.map(item => {
      return (typeof item === 'object') ? item['name'] : item
    })
    author = arr.join(',')
  } else if (typeof data === 'object') {
    console.log('parseAuthor object', data)
    author = data['name'] ?? 'unknown'
  }

  return author
}

const parseBookField = (data: any) => {
  if (!data) return ''
  console.log('parseBookField', data)
  let value = data
  if (Array.isArray(data)) {
    console.log('parse array', data)
    const arr = data.map(item => {
      return (typeof item === 'object') ? item['name'] : item
    })
    value = arr.join(',')
  } else if (typeof data === 'object') {
    console.log('parse object', data)
    value = data['name'] ?? 'unknown'
  }

  return value
}

const parseLanguage = (data: any) => {
  if (!data) return ''
  let author = data
  if (Array.isArray(data)) {
    author = data.join(',')
  }

  return author
}

const parseBookExtension = (file: File) => {
  // 1. Use file type
  if (file.type && bookMimeTypes[file.type]) {
    return bookMimeTypes[file.type]
  }

  // 2. Fallback: use file name
  const fileName = file.name
  return fileName.includes('.') ? fileName.split('.').pop() : ''
}

const buildBook = (metadata: any, fileInfo: any) => {
  return {
    ...fileInfo,
    uuid: metadata.sha1,
    author: parseAuthor(metadata.author),
    title: metadata.title || 'New book',
    extension: parseBookExtension(metadata.file),
    language: parseLanguage(metadata.language),
    publisher: parseBookField(metadata.publisher),
    published: metadata.published ?? '',
    description: metadata.description ?? '',
  }
}

export {
  goToHref,
  goToPercent,
  prevPage,
  nextPage,
  changeStyle,
  search,
  clearSearch,
  setManual,

  openBook,
  uploadBook,
}
