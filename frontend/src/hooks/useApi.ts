
import { useApiStore } from 'stores/api'
import { computed } from 'vue'

export default function() {
  const apiStore = useApiStore()

  const appBase = computed(() => {
    return apiStore.appBase
  })

  function getBookUrl(book: Indexable) {
    return `${appBase.value}/book/${book.path}/${book.fileName}`
  }

  function getBookByPath(filePath: string) {
    return `${appBase.value}/book/${filePath}`
  }

  function getCoverUrl(book: Indexable) {
    return `${appBase.value}/book/${book.path}/${book.coverName}`
  }

  function getFileUrl(path: string) {
    return `${appBase.value}/${path}`
  }

  return {
    appBase,

    getBookUrl,
    getBookByPath,
    getCoverUrl,
    getFileUrl,
  }
}
