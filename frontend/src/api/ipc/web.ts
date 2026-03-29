import type { IpcService} from 'src/api/ipc/index'
import { ipcServiceKeys } from 'src/api/ipc/index'
import { refresh } from 'core/hooks/useRouter'

const mock = (args?: any) => {
  return new Promise((resolve, reject) => {
    // console.debug('mock', args)
    resolve(args)
  })
}

const openNewWindow = (id: string, url: string, titleBarHeight: number) => {
  return new Promise((resolve, reject) => {
    window.open(url, '_blank', 'noopener')
    resolve(id)
  })
}

const reload = (force: boolean = false): Promise<any> => {
  if (force) {
    window.location.reload()
    return new Promise((resolve, reject) => {
      window.location.reload()
      resolve(force)
    })
  } else {
    return refresh()
  }
}

const restart = (force: boolean = false): Promise<any> => {
  return reload(true)
}

const onLoadUpdate = (callback: (data: string) => void) => {

}

const onUpdater = (callback: (event: string, data?: any) => void) => {

}

const onAppEvent = (callback: (event: string, data?: any) => void) => {

}

window.webIpcAPI = {
  hi: mock as any,
  closeMainWindow: mock as any,
  closeWindow: mock as any,
  getOpenFile: mock as any,
  getPath: mock as any,
  getServerInfo: mock as any,
  isWindowMaximized: mock as any,
  logInit: mock as any,
  logStart: mock as any,
  logStop: mock as any,
  onLogUpdate: onLoadUpdate as any,
  maximizeWindow: mock as any,
  migrateLibrary: mock as any,
  minimizeWindow: mock as any,
  openNewWindow: openNewWindow as any,
  publicPath: mock as any,
  reload: reload as any,
  restart: restart as any,
  saveImageFile: mock as any,
  getAppMode: mock as any,
  setAppMode: mock as any,
  setTheme: mock as any,
  secureGet: mock as any,
  secureSet: mock as any,
  showDialog: mock as any,
  updateTrayMenu: mock as any,
  updater: mock as any,
  onUpdater: onUpdater as any,
  onAppEvent: onAppEvent as any,
}

export const createWebIpc = (): IpcService => {
  const api = window.webIpcAPI

  const handler: ProxyHandler<any> = {
    get: (_, prop: string) => {
      if (ipcServiceKeys.includes(prop as any)) {
        const fn = api[prop as keyof typeof api]
        return typeof fn === "function" ? fn.bind(api) : fn
      }
      throw new Error(`IPC method ${prop} not found`)
    }
  }

  return new Proxy({}, handler) as IpcService
}

export const webIpc = createWebIpc()
