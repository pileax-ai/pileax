
import { useApiStore } from 'stores/api'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export default function() {
  const apiStore = useApiStore()

  const appMode = computed(() => {
    return apiStore.appMode
  })

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

  function setAppMode(mode: string) {
    apiStore.setAppMode(mode)
  }

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
    return getFileUrl(book.fileUrl)
  }

  function getCoverUrl(book: Indexable) {
    if (book.coverUrl && (book.coverUrl.includes('xhtml') || book.coverUrl.includes('xml'))) {
      return '/images/ui/page/page-bg.svg'
    }
    return getFileUrl(book.coverUrl)
  }

  function getFileUrl(path: string) {
    if (!path) {
      return ''
    }

    path = path?.startsWith('/') ? path.slice(1) : path
    return `${appBase.value}/${path}`
  }

  async function startCheckConnectivity() {
    await apiStore.startCheckConnectivity()
  }

  function stopCheckConnectivity() {
    apiStore.stopCheckConnectivity()
  }

  return {
    apiStore,
    appMode,
    apiBase,
    appBase,
    collabEnabled,
    collabProvider,
    connected,

    setAppMode,
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
