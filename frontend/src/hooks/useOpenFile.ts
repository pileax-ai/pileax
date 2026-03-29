import { computed } from 'vue'

import { useAppStore } from 'stores/app'
import { useReaderStore } from 'stores/reader'
import { ipcService } from 'src/api/ipc'
import { router } from 'src/router'

export default function () {
  const appStore = useAppStore()
  const readerStore = useReaderStore()

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
      uploadBook(file).then(res => {
        console.log('uploadBook', res)
        appStore.resetOpenFile()

        // navigate to book library and refresh
        router.push({ name: 'book-library' })
        readerStore.setQueryTimer(Date.now())
      }).catch(err => {
        console.error(err)
        // Failed
        if (persist) {
          appStore.setOpenFile(value)
        }
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
