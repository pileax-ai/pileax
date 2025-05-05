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
import { contextBridge, ipcRenderer } from 'electron';
import type { OpenDialogOptions } from 'electron';
import { dialog } from '@electron/remote';
import { closeWindow, isWindowMaximized, maximizeWindow, minimizeWindow } from 'app/src-electron/app/window'

// Electron API
const electronAPI = {
  hi: (message: string) => {
    console.log('hi', message);
  },
  showDialog: async (options: OpenDialogOptions) => {
    return dialog.showOpenDialog(options);
  },
  getServerInfo: async (): Promise<Indexable> =>
    ipcRenderer.invoke('get-server-info'),
  openNewWindow: async (id: string, url: string, titleBarHeight = 40) =>
    ipcRenderer.invoke('open-new-window', id, url, titleBarHeight),
  minimizeWindow: async () =>
    ipcRenderer.invoke('window-minimize'),
  maximizeWindow: async () =>
    ipcRenderer.invoke('window-maximize'),
  closeWindow: async () =>
    ipcRenderer.invoke('window-close'),
  isWindowMaximized: async () =>
    ipcRenderer.invoke('window-is-maximized'),
  readFile: async (filePath: string) =>
    ipcRenderer.invoke('read-file', filePath),
  readImage: async (filePath: string) =>
    ipcRenderer.invoke('read-image', filePath),
  readBookFile: async (filePath: string) =>
    ipcRenderer.invoke('read-book-file', filePath),
  readBookCover: async (filePath: string) =>
    ipcRenderer.invoke('read-book-cover', filePath),
  saveBookFiles: async (metadata: any) =>
    ipcRenderer.invoke('save-book-files', metadata),
  saveImageFile: async (metadata: any) =>
    ipcRenderer.invoke('save-image-file', metadata),
  setTheme: async (theme: 'system' | 'light' | 'dark') =>
    ipcRenderer.invoke('set-theme', theme),
  dbExecute: async (entity: string, method: string, params: any) =>
    ipcRenderer.invoke('db-execute', entity, method, params),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
