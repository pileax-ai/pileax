
import { useBookStoreWithOut } from 'stores/book'
import { computed } from 'vue'
import type { BookOperation, BookTocItem } from 'src/types/reading'

export default function () {
  const store = useBookStoreWithOut()

  const toc = computed(() => {
    return store.toc
  })
  const book = computed(() => {
    return store.book
  })
  const bookId = computed(() => {
    return store.bookId
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
  const selection = computed(() => {
    return store.selection
  })
  const keyword = computed(() => {
    return store.keyword
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

  function setBook(value: any) {
    store.setBook(value)
  }

  function setBookId(value: string) {
    store.setBookId(value)
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

  return {
    store,
    book,
    bookId,
    workspaceBookId,
    progress,
    selection,
    toc,
    tocItem,
    previousTocItem,
    nextTocItem,
    keyword,
    annotationTimer,
    operation,
    readingMode,
    search,

    setBook,
    setBookId,
    setWorkspaceBookId,
    setTocItem,
    setKeyword,
    setProgress,
    setSelection,
    setToc,
    setAnnotationTimer,
    setAnnotationId,
    setOperation,
    setSearch,
    clearSearch
  }
}
