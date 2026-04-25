import { electronIpc } from 'src/api/ipc/electron'
import { webIpc } from 'src/api/ipc/web'
import { tauriIpc } from 'src/api/ipc/tauri'

export type IpcApi = {
  hi: (message: string) => void;
  closeMainWindow: () => Promise<any>;
  closeWindow: (id: string) => Promise<any>;
  getOpenFile: () => Promise<void>;
  getPath: (key: string) => Promise<string>;
  getServerInfo: () => Promise<Indexable>;
  inspect: () => Promise<void>;
  isWindowMaximized: () => Promise<boolean>;
  logInit: (maxLines?: number) => Promise<string>;
  logStart: (maxLines?: number) => Promise<void>;
  logStop: () => Promise<void>;
  onLogUpdate: (callback: (data: string) => void) => void;
  maximizeWindow: () => Promise<any>;
  migrateLibrary: (options: any) => Promise<any>;
  minimizeWindow: () => Promise<any>;
  openNewWindow: (id: string, url: string, titleBarHeight?: number) => Promise<any>;
  openPath: (path: string, type?: string) => Promise<any>;
  publicPath: (path: string) => Promise<any>;
  reload: (force?: boolean) => Promise<any>;
  restart: () => Promise<any>;
  saveImageFile: (metadata: any) => Promise<any>;
  getAppMode: () => Promise<string>;
  setAppMode: (mode: 'standalone' | 'cloud') => Promise<any>;
  setTheme: (theme: 'system' | 'light' | 'dark') => Promise<any>;
  secureGet: (key: any) => Promise<string|null>;
  secureSet: (key: any, value: string) => Promise<boolean>;
  showDialog: (options: Indexable) => Promise<any>;
  updateTrayMenu: (options: any) => Promise<any>;
  updater: (options: Indexable) => Promise<any>;
  onUpdater: (callback: (event: string, data?: any) => void) => void;
  onAppEvent: (callback: (event: string, data?: any) => void) => void;
}

export const ipcServiceKeys = [
  'hi',
  'closeMainWindow',
  'closeWindow',
  'getOpenFile',
  'getPath',
  'getServerInfo',
  'inspect',
  'isWindowMaximized',
  'logInit',
  'logStart',
  'logStop',
  'onLogUpdate',
  'maximizeWindow',
  'migrateLibrary',
  'minimizeWindow',
  'openNewWindow',
  'openPath',
  'publicPath',
  'reload',
  'restart',
  'saveImageFile',
  'getAppMode',
  'setAppMode',
  'setTheme',
  'secureGet',
  'secureSet',
  'showDialog',
  'updateTrayMenu',
  'updater',
  'onUpdater',
  'onAppEvent',
] as const

export type IpcService = Pick<IpcApi, typeof ipcServiceKeys[number]>;

export const ipcMethod = <K extends keyof IpcService>(
  instance: IpcService,
  method: K,
  ...args: IpcService[K] extends (...a: any) => any ? Parameters<IpcService[K]> : never
): IpcService[K] extends (...a: any) => any ? ReturnType<IpcService[K]> : never => {
  const fn = instance[method]
  if (typeof fn === "function") {
    return (fn as (...args: any[]) => any)(...args)
  }
  throw new Error(`Method "${method}" not found`)
}

export const createIpcService = (): { ipcProvider: 'electron' | 'tauri' | 'web', ipcService: IpcService } => {
  if (process.env.MODE === 'electron') {
    return {
      ipcProvider: 'electron',
      ipcService: electronIpc
    }
  } else if (window.__TAURI_INTERNALS__) {
    return {
      ipcProvider: 'tauri',
      ipcService: tauriIpc
    }
  } else {
    return {
      ipcProvider: 'web',
      ipcService: webIpc
    }
  }
}

export const { ipcProvider, ipcService } = createIpcService()
