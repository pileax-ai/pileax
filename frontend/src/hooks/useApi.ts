
import { useAccountStore } from 'stores/account'
import { useApiStore } from 'stores/api'
import { useWorkspaceStore } from 'stores/workspace'
import { computed } from 'vue'
import { ipcProvider, ipcService } from 'src/api/ipc'
import { saveItem } from 'core/utils/storage'

export default function() {
  const apiStore = useApiStore()
  const workspaceStore = useWorkspaceStore()

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

  const connecting = computed(() => {
    // return true
    return !connected.value && ipcProvider !== 'web'
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

  function openNewWindowFromWorkspace(workspace: string, id: string, path: string, titleBarHeight?: number) {
    const accountStore = useAccountStore()
    // Create child window
    // Update parent window's workspace immediately
    // Used to init child window's workspace
    accountStore.setParentWorkspace(workspace)
    ipcService.openNewWindow(id, path, titleBarHeight)
  }

  function openNewWindow(id: string, path: string, titleBarHeight?: number) {
    const currentWorkspaceId = workspaceStore.workspaceId
    openNewWindowFromWorkspace(currentWorkspaceId, id, path, titleBarHeight)
  }

  return {
    apiStore,
    appMode,
    apiBase,
    appBase,
    collabEnabled,
    collabProvider,
    connected,
    connecting,

    setAppMode,
    setApiBase,
    setCollab,
    setCollabProvider,
    getBookUrl,
    getCoverUrl,
    getFileUrl,
    startCheckConnectivity,
    stopCheckConnectivity,
    openNewWindow,
    openNewWindowFromWorkspace
  }
}
