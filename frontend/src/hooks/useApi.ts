
import { useApiStore } from 'stores/api'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export default function() {
  const apiStore = useApiStore()

  const apiBase = computed(() => {
    return apiStore.apiBase
  })

  const appBase = computed(() => {
    return new URL(apiStore.apiBase || '').origin
  })

  const collabEnabled = computed(() => {
    return apiStore.collab
  })

  const collabProvider = computed(() => {
    return apiStore.collabProvider
  })

  const connected = computed(() => {
    return apiStore.connected
  })

  function setApiBase(url: string) {
    apiStore.setApiBase(url)
  }

  function setCollab(collab: boolean) {
    apiStore.setCollab(collab)
  }

  function setCollabProvider(url: string) {
    apiStore.setCollabProvider(url)
  }

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

  async function startCheckConnectivity(interval = 20000) {
    await apiStore.startCheckConnectivity(interval)
  }

  function stopCheckConnectivity() {
    apiStore.stopCheckConnectivity()
  }

  return {
    apiStore,
    apiBase,
    appBase,
    collabEnabled,
    collabProvider,
    connected,

    setApiBase,
    setCollab,
    setCollabProvider,
    getBookUrl,
    getCoverUrl,
    getFileUrl,
    startCheckConnectivity,
    stopCheckConnectivity,
  }
}
