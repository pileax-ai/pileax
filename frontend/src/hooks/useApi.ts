
import { useApiStore } from 'stores/api'
import { computed } from 'vue'

export default function() {
  const apiStore = useApiStore()

  const apiBase = computed(() => {
    return apiStore.apiBase
  })

  const appBase = computed(() => {
    return new URL(apiStore.apiBase || '').origin
  })

  function getBookUrl(book: Indexable) {
    const path = `${book.path}/${book.fileName}`
    return getFileUrl(path)
  }

  function getCoverUrl(book: Indexable) {
    const path = `${book.path}/${book.coverName}`
    return getFileUrl(path)
  }

  function getFileUrl(path: string) {
    path = path.startsWith('/') ? path.slice(1) : path
    return `${appBase.value}/${path}`
  }

  return {
    apiBase,
    appBase,

    getBookUrl,
    getCoverUrl,
    getFileUrl,
  }
}
