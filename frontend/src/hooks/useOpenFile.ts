import { computed } from 'vue'

import { useAppStore } from 'stores/app'
import { useReadingStoreWithOut } from 'stores/reading'
import { ipcService } from 'src/api/ipc'
import { router } from 'src/router'
import { globalBus } from 'src/api/event/event-bus'

export default function () {
  const appStore = useAppStore()
  const readingStore = useReadingStoreWithOut()

  const openFile = computed(() => {
    return appStore.openFile
  })

  async function setOpenFile(value: Indexable, persist = true) {
    // Save book
    const fileData = value.file
    if (fileData) {
      const { uploadBook } = await import('src/api/service/ebook/book')
      const file = new File([fileData.content], fileData.name, {
        type: fileData.type,
        lastModified: fileData.lastModified
      })
      readingStore.setBookUploading(true)
      uploadBook(file).then(res => {
        appStore.resetOpenFile()

        // navigate to book library and refresh
        router.push({ name: 'book-library' })
        globalBus.emit('library-need-refresh', res, true)
      }).catch(err => {
        console.error(err)
        // Failed
        if (persist) {
          appStore.setOpenFile(value)
        }
      }).finally(() => {
        readingStore.setBookUploading(false)
      })
    }
  }

  function initOpenFile() {
    const openFile = appStore.openFile
    if (openFile.path) {
      setOpenFile(openFile, false)
    } else {
      ipcService.getOpenFile()
    }
  }


  return {
    openFile,
    setOpenFile,
    initOpenFile,
  }
}
