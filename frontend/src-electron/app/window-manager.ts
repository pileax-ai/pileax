import { BrowserWindow, shell } from 'electron'
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

  // ----------------------------------------------------------------------
  // Main Window
  // ----------------------------------------------------------------------
  static async createMainWindow(source = '') {
    log.info('createMainWindow', source)
    if (WindowManager.mainWindow) {
      log.error('Avoid create again.')
      return
    }

    /**
     * Initial window options
     *
     * @see https://www.electronjs.org/docs/latest/api/browser-window
     */
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      useContentSize: true,
      frame: true,
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 8, y: 12 },
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
        preload: path.resolve(
          currentDir,
          path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER ?? '', 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
        ),
      },
    })

    win.maximize()
    if (process.env.DEV) {
      await win.loadURL(process.env.APP_URL)
    } else {
      // await mainWindow.loadURL(VIRTUAL_URL)
      await win.loadURL(spaServer.serverInfo.url)
    }

    if (process.env.DEBUGGING) {
      // if on DEV or Production with debug enabled
      // mainWindow.webContents.openDevTools();
    } else {
      // we're on production; no access to devtools pls
      win.webContents.on('devtools-opened', () => {
        // mainWindow?.webContents.closeDevTools(); // Todo: uncomment in production
      })
    }

    // Open url in system browser
    win.webContents.on('will-navigate', (event, url) => {
      // Only process in production mode
      if (process.env.NODE_ENV === 'production' && url.startsWith('http')) {
        event.preventDefault()
        shell.openExternal(url)
      }
    })
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http')) {
        shell.openExternal(url)
      }
      return { action: 'deny' }
    })

    win.on('closed', () => {
      WindowManager.setMainWindow(undefined)
    })

    WindowManager.setMainWindow(win)
  }

  static setMainWindow(win?: BrowserWindow) {
    this.mainWindow = win
  }

  static getMainWindow() {
    return this.mainWindow
  }

  // ----------------------------------------------------------------------
  // Window Events
  // ----------------------------------------------------------------------
  static closeMainWindow() {
    try {
      const win = WindowManager.getMainWindow()
      if (win && !win.isDestroyed()) {
        setImmediate(() => {
          if (!win.isDestroyed()) {
            win.close()
          }
        })
      }
    } catch (e) {
      log.error('❌ Close Error:', e)
    }
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

  static isWindowMaximized() {
    const win = BrowserWindow.getFocusedWindow()
    return win?.isMaximized() ?? false
  }

  // ----------------------------------------------------------------------
  // New Window
  // ----------------------------------------------------------------------
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
        webviewTag: true,
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

  closeWindow(id: string) {
    try {
      const win = this.windows[id]
      if (win && !win.isDestroyed()) {
        setImmediate(() => {
          if (!win.isDestroyed()) {
            win.close()
          }
        })
      }
    } catch (e) {
      log.error('❌ Close Error:', e)
    }
  }

}

export const windowManager = new WindowManager()
