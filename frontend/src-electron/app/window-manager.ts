import { BrowserWindow } from 'electron'
import log from 'electron-log'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spaServer } from '../server/spa-server'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export class WindowManager {
  private windows: Record<string, BrowserWindow>
  private static mainWindow: BrowserWindow | undefined = undefined

  constructor() {
    this.windows = {}
  }

  static setMainWindow(win: BrowserWindow) {
    this.mainWindow = win
  }

  static getMainWindow() {
    return this.mainWindow
  }

  static minimizeWindow() {
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
  }

  static maximizeWindow()  {
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  }

  static closeMainWindow() {
    try {
      const win = WindowManager.getMainWindow()
      if (win) {
        if (process.platform === 'darwin') {
          win.close()
        } else {
          win.hide()
        }
      }
    } catch (e) {
      log.error('❌ Close Error:', e)
    }
  }

  closeWindow(id: string) {
    try {
      const win = this.windows[id]
      if (win) {
        win.close()
      }
    } catch (e) {
      log.error('❌ Close Error:', e)
    }
  }

  static isWindowMaximized() {
    const win = BrowserWindow.getFocusedWindow()
    return win?.isMaximized() ?? false
  }

  // Open new window with id
  async openNewWindow (id: string, url: string, titleBarHeight = 40) {
    // Focus window if exists.
    const w = this.windows[id]
    if (w && !w.isDestroyed()) {
      w.focus()
      return
    }

    // Create new window.
    const newWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      useContentSize: true,
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 12, y: 12 },
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: path.resolve(
          currentDir,
          path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER ?? '', 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
        ),
      },
    })

    if (process.env.DEV) {
      const newUrl = `${process.env.APP_URL}#${url}`
      await newWindow.loadURL(newUrl)
    } else {
      // await newWindow.loadFile('index.html', {
      //   hash: url
      // })
      await newWindow.loadURL(`${spaServer.serverInfo.url}#${url}`)
    }

    newWindow.on('closed', () => {
      if (this.windows[id]) {
        delete this.windows[id]
      }
    })

    this.windows[id] = newWindow
  }
}

export const windowManager = new WindowManager()
