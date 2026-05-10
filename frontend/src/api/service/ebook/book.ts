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
import { base64ToFile, getFileSHA1, isTitleSimilar } from 'src/utils/book'
import { getErrorMessage } from 'src/utils/request'
import { globalBus } from 'src/api/event/event-bus'
import { UUID } from 'core/utils/crypto'

const { getFileUrl } = useApi()
const { openDialog } = useDialog()
const { style } = useReader()
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
} = useBook()

export const uploadBookWaiters = new Map()
export const bookMimeTypes = {
  'application/epub+zip': 'epub',
  'application/pdf': 'pdf',

  // Kindle
  'application/x-mobipocket-ebook': 'mobi',
  'application/x-azw3-ebook': 'azw3',
  'application/vnd.amazon.ebook': 'azw3', // AZW3/KF8
  'application/vnd.amazon.mobi8': 'azw3',

  // Comic
  'application/x-cbz': 'cbz',
  'application/vnd.comicbook+zip': 'cbz',

  // FictionBook
  'application/x-fictionbook+xml': 'fb2',
  'application/x-zip-compressed-fb2': 'fbz',
} as Indexable
export const bookExtensions = ['epub', 'mobi', 'azw3', 'cbz', 'fb2', 'fbz']

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
        text: data.annotation.title,
      })
      break
    case 'onClickView':
      setSelection({})
      globalBus.emit('book-view-clicked')
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
  // Relocated
  globalBus.emit('relocated', data)

  // Set progress
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

const prevSection = () => {
  setManual()
  ebookRender.prevSection()
}

const nextSection = () => {
  setManual()
  ebookRender.nextSection()
}

const isInside = (cfi: string, rangeCfi: string) => {
  return ebookRender.isInside(cfi, rangeCfi)
}

const parseCFI = (cfi: string) => {
  return ebookRender.parseCFI(cfi)
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
  // console.log('openBook', filePath)
  if (!filePath) return

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

      // console.log('openBook', cfi)
      ebookRender.open(bookElement, data,
        { cfi, userStyle: style.value })
      setManual(BookOperation.Load)
      resolve(data)
    }).catch((err: any) => {
      console.error('Failed to open file：', err)
      reject(err)
    })
  })
}

const uploadBook = async (file: File, bookData: Indexable = {}) => {
  // console.log('uploadBook', file, bookData)
  const sha1 = await getFileSHA1(file)
  return new Promise((resolve, reject) => {
    const data = {
      file,
      sha1,
      id: bookData.bookId,
      saving: 'remote',
      filePath: ''
    }
    ebookRender.open(document.body, data, { importing: true})

    // Register waiter, resolve/reject in onMetadata/onOpenFailed
    uploadBookWaiters.set(sha1, { resolve, reject, bookData })
  })

}

const onMetadata = async (metadata: any) => {
  const sha1 = metadata.sha1
  const waiter = uploadBookWaiters.get(sha1)
  try {
    // If upload to existing book, check book title
    const bookData = waiter.bookData
    if (bookData.id) {
      const title = bookData.title
      const savingTitle = metadata.title
      if (!isTitleSimilar(title, savingTitle)) {
        waiter.reject(new Error('book.warning.titleNotMatch'))
        return
      }
    }

    // saving
    // console.log('onMetadata', metadata)
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
  // console.log('savingBookRemote', metadata)
  try {
    // Book uploaded, add to shelf
    const remoteBook = await bookService.getByUuid(metadata.sha1)
    try {
      await workspaceBookService.save({bookId: remoteBook.id})
    } catch (err) {
      const message = getErrorMessage(err)
      if (message?.indexOf('UNIQUE') >= 0) {
        notifyWarning('Book already exists')
      }
    }
    return remoteBook
  } catch (err) {
    // New upload
    const book = buildBook(metadata, {
      path: metadata.sha1,
      fileName: metadata.file.name,
    })
    const coverFile = base64ToFile(metadata.cover, book.title)
    try {
      return await bookService.upload(metadata.file, coverFile, book)
    } catch (err) {
      console.error(err)
    }
  }
}

const saveBookProgress = (progress: any) => {
  // console.log('saveBookProgress', progress)
  if (!progress.cfi || !progress.percentage) return
  const params = {
    book_id: bookId.value,
    readingPosition: progress.cfi,
    readingPercentage: progress.percentage
  }
  userBookService.updateReadingProgress(params)
}

const parseTitle = (title: string) => {
  if (!title) return ''

  return title.replace(/【.*】$/, '').trim()
}

const parseAuthor = (data: any) => {
  if (!data) return 'Author'
  // console.log('parseAuthor', data)
  let author = data
  if (Array.isArray(data)) {
    // console.log('parseAuthor array', data)
    const arr = data.map(item => {
      return (typeof item === 'object') ? item['name'] : item
    })
    author = arr.join(',')
  } else if (typeof data === 'object') {
    // console.log('parseAuthor object', data)
    author = data['name'] ?? 'unknown'
  }

  return author
}

const parseBookField = (data: any) => {
  if (!data) return ''
  // console.log('parseBookField', data)
  let value = data
  if (Array.isArray(data)) {
    // console.log('parse array', data)
    const arr = data.map(item => {
      return (typeof item === 'object') ? item['name'] : item
    })
    value = arr.join(',')
  } else if (typeof data === 'object') {
    // console.log('parse object', data)
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
    id: metadata.id || UUID(),
    uuid: metadata.sha1,
    author: parseAuthor(metadata.author),
    title: parseTitle(metadata.title) || 'New book',
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
  prevSection,
  nextSection,
  changeStyle,
  search,
  clearSearch,
  isInside,
  parseCFI,
  setManual,

  openBook,
  uploadBook,
}
