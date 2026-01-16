import { computed } from 'vue'
import { ipcService } from 'src/api/ipc'
import { READER_TITLE_BAR_HEIGHT } from 'core/constants/style'

export default function () {

  function openBook(book: any) {
    ipcService.openNewWindow(book.bookId, `/reader/book?id=${book.bookId}`,
      READER_TITLE_BAR_HEIGHT)
  }

  function openBookAnnotation(annotation: any) {
    ipcService.openNewWindow(annotation.id, `/reader/annotation?id=${annotation.id}`,
      READER_TITLE_BAR_HEIGHT)
  }

  return {
    openBook,
    openBookAnnotation
  }
}
