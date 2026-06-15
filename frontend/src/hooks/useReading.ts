import { computed } from 'vue'
import { READER_TITLE_BAR_HEIGHT } from 'core/constants/style'
import { useReadingStoreWithOut } from 'stores/reading'
import useApi from 'src/hooks/useApi'

export default function () {
  const store = useReadingStoreWithOut()
  const { openNewWindow } = useApi()

  const library = computed(() => {
    return store.library
  })
  const collection = computed(() => {
    return store.collection
  })

  function setLibraryItem(key: string, value: any) {
    store.setLibraryItem(key, value)
  }

  function setCollectionItem(key: string, value: any) {
    store.setCollectionItem(key, value)
  }

  function openBook(book: any) {
    openNewWindow(book.bookId, `/reader/book?id=${book.bookId}`,
      READER_TITLE_BAR_HEIGHT)
  }

  function openBookAnnotation(annotation: any) {
    openNewWindow(annotation.id, `/reader/annotation?id=${annotation.id}`,
      READER_TITLE_BAR_HEIGHT)
  }

  return {
    library,
    collection,
    setLibraryItem,
    setCollectionItem,
    openBook,
    openBookAnnotation
  }
}
