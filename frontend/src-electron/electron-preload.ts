/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge, ipcRenderer } from 'electron'
import type { OpenDialogOptions } from 'electron'

// WindowId
const windowIdArg = process.argv.find(arg => arg.startsWith('--window-id='))
const windowId = windowIdArg ? windowIdArg.split('=')[1] : 'unknown'

// Electron API
const electronIpcAPI = {
  windowId,
  hi: (message: string) => {
    return message
  },
  closeMainWindow: async () =>
    ipcRenderer.invoke('window-close-main'),
  closeWindow: async (id: string) =>
    ipcRenderer.invoke('window-close', id),
  getOpenFile: async () =>
    ipcRenderer.invoke('get-open-file'),
  getPath: async (key: string) =>
    ipcRenderer.invoke('get-path', key),
  getServerInfo: async (): Promise<Indexable> =>
    ipcRenderer.invoke('get-server-info'),
  getSystemFonts: async (): Promise<Indexable> =>
    ipcRenderer.invoke('get-system-fonts'),
  inspect: async () =>
    ipcRenderer.send('window-control:toggle-devtools'),
  openNewWindow: async (id: string, url: string, titleBarHeight = 40) =>
    ipcRenderer.invoke('open-new-window', id, url, titleBarHeight),
  openPath: async (path: string, type = 'book') =>
    ipcRenderer.invoke('open-path', path, type),
  isWindowMaximized: async () =>
    ipcRenderer.invoke('window-is-maximized'),
  logInit: async (maxLines = 100): Promise<string> =>
    ipcRenderer.invoke('log:init', maxLines),
  logStart: async (maxLines = 100): Promise<void> =>
    ipcRenderer.invoke('log:start', maxLines),
  logStop: async (): Promise<void> =>
    ipcRenderer.invoke('log:stop'),
  onLogUpdate: (callback: (data: string) => void) => {
    ipcRenderer.on('log:update', (_, data: string) => callback(data))
  },
  maximizeWindow: async () =>
    ipcRenderer.invoke('window-maximize'),
  minimizeWindow: async () =>
    ipcRenderer.invoke('window-minimize'),
  migrateLibrary: async (options: any) =>
    ipcRenderer.invoke('migrate-library', options),
  publicPath: async (path: string) =>
    ipcRenderer.invoke('public-path', path),
  readBookCover: async (filePath: string) =>
    ipcRenderer.invoke('read-book-cover', filePath),
  readBookFile: async (filePath: string) =>
    ipcRenderer.invoke('read-book-file', filePath),
  readFile: async (filePath: string) =>
    ipcRenderer.invoke('read-file', filePath),
  readImage: async (filePath: string) =>
    ipcRenderer.invoke('read-image', filePath),
  reload: async (id: string, force: boolean) =>
    ipcRenderer.invoke('reload', id, force),
  restart: async () =>
    ipcRenderer.invoke('restart'),
  saveBookFiles: async (metadata: any) =>
    ipcRenderer.invoke('save-book-files', metadata),
  saveImageFile: async (metadata: any) =>
    ipcRenderer.invoke('save-image-file', metadata),
  getAppMode: async (): Promise<string> =>
    ipcRenderer.invoke('get-app-mode'),
  setAppMode: async (mode: 'standalone' | 'cloud') =>
    ipcRenderer.invoke('set-app-mode', mode),
  setTheme: async (theme: AppTheme) =>
    ipcRenderer.invoke('set-theme', theme),
  setWindowButton: async (layout: string, id?: string) =>
    ipcRenderer.invoke('set-window-button', layout, id),
  secureGet: async (key: any): Promise<string|null> =>
    ipcRenderer.invoke('secure-get', key),
  secureSet: async (key: any, value: string) =>
    ipcRenderer.invoke('secure-set', key, value),
  showDialog: async (options: OpenDialogOptions) =>
    ipcRenderer.invoke('show-dialog', options),
  updateTrayMenu: async (options: any) =>
    ipcRenderer.invoke('update-tray-menu', options),
  updater: async (options: Indexable) =>
    ipcRenderer.invoke('updater', options),
  onUpdater: (callback: (event: string, data?: any) => void) => {
    ipcRenderer.on('updater', (_, event: string, data?: any) => callback(event, data))
  },
  onAppEvent: (callback: (event: string, data?: any) => void) => {
    ipcRenderer.on('app-event', (_, event: string, data?: any) => callback(event, data))
  },
}

contextBridge.exposeInMainWorld('electronIpcAPI', electronIpcAPI)
