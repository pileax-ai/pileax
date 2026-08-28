
import { useBookStoreWithOut } from 'stores/book'
import { computed } from 'vue'
import type { BookOperation, BookTocItem } from 'src/types/reading'
import { findBookAnnotation } from 'src/api/service/ebook/book-annotation'

export default function () {
  const store = useBookStoreWithOut()

  const toc = computed(() => {
    return store.toc
  })
  const windowId = computed(() => {
    return store.windowId
  })
  const book = computed(() => {
    return store.book
  })
  const bookExtension = computed(() => {
    return store.book.extension
  })
  const bookId = computed(() => {
    return store.bookId
  })
  const bookCss = computed(() => {
    return store.bookCss
  })
  const bookHideItems = computed(() => {
    return store.bookHideItems
  })
  const isPhysical = computed(() => {
    const media = book.value.media as Indexable[]
    const physical = media?.find(item => item.type === 'physical')
    return !!physical && book.value.fileUrl === ''
  })
  const workspaceBookId = computed(() => {
    return store.workspaceBookId
  })
  const tocItem = computed(() => {
    return store.tocItem
  })
  const previousTocItem = computed(() => {
    const idx = tocItem.value.id
    return idx > 0 ? toc.value[idx - 1] : null
  })
  const nextTocItem = computed(() => {
    const idx = tocItem.value.id
    return idx < toc.value.length - 1 ? toc.value[idx + 1] : null
  })
  const progress = computed(() => {
    return store.progress
  })
  const tempProgress = computed(() => {
    return store.tempProgress
  })
  const selection = computed(() => {
    return store.selection
  })
  const keyword = computed(() => {
    return store.keyword
  })
  const annotations = computed(() => {
    return store.annotations
  })
  const annotationTimer = computed(() => {
    return store.annotationTimer
  })
  const operation = computed(() => {
    return store.operation
  })
  const readingMode = computed(() => {
    return store.readingMode
  })
  const search = computed(() => {
    return store.search
  })
  const isFixedLayout = computed(() => {
    return bookExtension.value && ['pdf', 'cbz'].includes(bookExtension.value)
  })

  function setWindowId(value: string) {
    store.setWindowId(value)
  }

  function setBookOptions(options: Indexable) {
    const itemSet = new Set([] as string[])
    for (let [key, value] of Object.entries(options)) {
      switch (key) {
        case 'instantSearch':
          break
        default:
          if (value) {
            itemSet.add(key)
          }
          break
      }
    }
    setBookHideItems(Array.from(itemSet))
  }

  function setBook(value: Indexable) {
    // Options
    setBookOptions(value.userExtra?.options || {})

    // Book details
    store.setBook(value)
  }

  function setBookId(value: string) {
    store.setBookId(value)
  }

  function setBookItem(key: string, value: any) {
    store.setBookItem(key, value)
  }

  function setBookCss(value: string) {
    store.setBookCss(value)
  }

  function setBookHideItems(value: string[]) {
    store.setBookHideItems(value)
  }

  function setWorkspaceBookId(value: string) {
    store.setWorkspaceBookId(value)
  }

  function setTocItem(item :BookTocItem) {
    store.setTocItem(item)
  }

  function setKeyword(keyword :string) {
    store.setKeyword(keyword)
  }

  function setProgress(data :any) {
    store.setProgress(data)
  }

  function setSelection(data :any) {
    store.setSelection(data)
  }

  function setToc(data :any) {
    store.setToc(data)
  }

  function initAnnotationData() {
    findBookAnnotation(bookId.value).then(res => {
      store.setAnnotations(res)
    })
  }

  function setAnnotationTimer(value: number) {
    store.setAnnotationTimer(value)
  }

  function setAnnotationId(value: number) {
    store.setAnnotationId(value)
  }

  function setOperation(value: BookOperation) {
    store.setOperation(value)
  }

  function setSearch(data: Indexable) {
    if ('progress' in data) {
      store.setSearchItem('progress', data.progress)
    } else {
      store.setSearchResult(data)
    }
  }

  function clearSearch() {
    store.clearSearch()
  }

  function resetPlayStatus() {
    const playStatus = store.tts.playStatus
    if (playStatus === 'pause' || playStatus === 'error') {
      store.setTTSItem('playStatus', 'stop')
    }
  }

  return {
    store,
    book,
    bookId,
    bookCss,
    bookHideItems,
    isPhysical,
    workspaceBookId,
    progress,
    tempProgress,
    selection,
    toc,
    tocItem,
    previousTocItem,
    nextTocItem,
    keyword,
    annotations,
    annotationTimer,
    operation,
    readingMode,
    search,
    windowId,
    isFixedLayout,

    setBook,
    setBookId,
    setBookItem,
    setBookCss,
    setBookHideItems,
    setBookOptions,
    setWorkspaceBookId,
    setTocItem,
    setKeyword,
    setProgress,
    setSelection,
    setToc,
    initAnnotationData,
    setAnnotationTimer,
    setAnnotationId,
    setOperation,
    setSearch,
    clearSearch,
    setWindowId,
    resetPlayStatus,
  }
}
