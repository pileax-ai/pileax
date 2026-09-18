import { computed } from 'vue'
import { READER_TITLE_BAR_HEIGHT } from 'core/constants/style'
import { useReadingStoreWithOut } from 'stores/reading'
import useApi from 'src/hooks/useApi'
import { formatFileSize } from 'core/utils/format'

export default function () {
  const store = useReadingStoreWithOut()
  const { openNewWindow } = useApi()

  const library = computed(() => {
    return store.library
  })
  const collection = computed(() => {
    return store.collection
  })
  const bookUploading = computed(() => {
    return store.bookUploading
  })

  function setLibraryItem(key: string, value: any) {
    store.setLibraryItem(key, value)
  }

  function getLibrarySort(source = '') {
    const sortDirection = library.value.orderDesc ? 'desc' : 'asc'
    let sortField = ''
    switch (library.value.orderBy) {
      case 'recentAdd':
        sortField = source === 'book-add' ? 'book.update_time' : 'workspacebook.update_time'
        break
      case 'recentRead':
        sortField = source === 'book-add' ? 'book.update_time' : 'userbook.update_time'
        break
      case 'title':
        sortField = 'book.title_pinyin'
        break
    }
    return { [sortField]: sortDirection }
  }

  function getLibraryFilter() {
    return {
      title__icontains: library.value.title || '',
      extension__in: library.value.extension,
      reading_status: library.value.readingStatus,
    } as Indexable
  }

  function setCollectionItem(key: string, value: any) {
    store.setCollectionItem(key, value)
  }

  function setBookUploading(value: boolean) {
    store.setBookUploading(value)
  }

  function openBook(book: any) {
    openNewWindow(book.bookId, `/reader/book?id=${book.bookId}`,
      READER_TITLE_BAR_HEIGHT)
  }

  function openBookAnnotation(annotation: any) {
    openNewWindow(annotation.id, `/reader/annotation?id=${annotation.id}`,
      READER_TITLE_BAR_HEIGHT)
  }

  function bookSize(book: Indexable) {
    const media = book.media
    const extension = book.extension
    let size = ''
    if (media && extension) {
      if (Array.isArray(media)) {
        const item = media.find(e => e.format === extension)
        if (item && item.size) {
          // Todo: Intl.NumberFormat
          size = formatFileSize(item.size)
        }
      }
    }

    return size
  }

  return {
    library,
    collection,
    bookUploading,
    setLibraryItem,
    getLibraryFilter,
    getLibrarySort,
    setCollectionItem,
    setBookUploading,
    openBook,
    openBookAnnotation,
    bookSize
  }
}
