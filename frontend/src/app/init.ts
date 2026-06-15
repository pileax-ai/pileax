/**
 * App Init
 */
import { useRoute } from 'vue-router'
import { useApiStore } from 'stores/api'
import { useNaviStore } from 'stores/navi'
import useSetting from 'core/hooks/useSetting'
import useUpdater from 'core/hooks/useUpdater'
import useOpenFile from 'src/hooks/useOpenFile'
import { ipcService } from 'src/api/ipc'
import { getDeviceId } from 'src/utils/auth'
import { globalCrossTabBus } from 'src/api/event/event-bus'
import { router } from 'src/router'

export const initApp = () => {
  initApi()
  initMenu()
  initSetting()
  initListeners()
}

export const reloadApp = async () => {
  await initApi()
  if (process.env.MODE === 'electron') {
    await ipcService.reload(ipcService.windowId, true)
  }
}

const initMenu = () => {
  const naviStore = useNaviStore()
  naviStore.initMenu()
}

const initSetting = () => {
  const { setSetting } = useSetting()
  setSetting()
}

const initApi = async () => {
  const deviceId = getDeviceId()
  // console.log('Init device id', deviceId)

  const apiStore = useApiStore()
  try {
    apiStore.setConnected(false)
    await apiStore.resetServer()
  } catch (err) {
    console.error('initApi', err)
  }
}

const initListeners = () => {
  const route = useRoute()
  const apiStore = useApiStore()
  const { setUpdater } = useUpdater()
  const { setOpenFile } = useOpenFile()

  setUpdater('init')
  ipcService.onUpdater((event, data) => {
    setUpdater(event, data)
    if (import.meta.env.DEV) {
      console.debug('onUpdater', event, data)
    }
  })

  ipcService.onAppEvent((event, data) => {
    switch (event) {
      case 'open-file':
        setOpenFile(data)
        break
      case 'server-ready':
        apiStore.setConnected(true)
        break
    }
    if (import.meta.env.DEV) {
      console.debug('onAppEvent', event, data)
    }
  })

  if (import.meta.env.DEV) {
    console.log('WindowId', ipcService.windowId)
  }

  // Listening login event from other tabs.
  // Refresh/reload current page/window after new login
  globalCrossTabBus.on('auth:login', async () => {
    if (route.name == 'signin' || route.name == 'signup') {
      await router.push('/welcome')
    }
    await ipcService.reload(ipcService.windowId)
  })
}
