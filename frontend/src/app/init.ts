/**
 * App Init
 */
import { useApiStore } from 'stores/api'
import { useNaviStore } from 'stores/navi'
import useSetting from 'core/hooks/useSetting'
import useUpdater from 'core/hooks/useUpdater'
import useOpenFile from 'src/hooks/useOpenFile'
import { ipcService } from 'src/api/ipc'
import { getDeviceId } from 'src/utils/auth'

export const initApp = () => {
  initApi()
  initMenu()
  initSetting()
  initListeners()
}

export const reloadApp = async () => {
  await initApi()
  if (process.env.MODE === 'electron') {
    await ipcService.reload(true)
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
    await apiStore.resetServer()
  } catch (err) {
    console.error('initApi', err)
  }
}

const initListeners = () => {
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
    }
  })
}
