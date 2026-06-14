import { BrowserWindow, shell } from 'electron'
import log from 'electron-log'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { configManager } from './config-manager'
import { spaServer } from '../server/spa-server'

import { THEMES } from 'core/constants/setting'

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
    const layout = configManager.getLayout()
    const theme = configManager.getTheme()
    log.info('🖥️ createMainWindow', source, layout, theme)
    if (WindowManager.mainWindow) {
      log.error('Avoid create again.')
      return
    }

    /**
     * Initial window options
     *
     * @see https://www.electronjs.org/docs/latest/api/browser-window
     */
    const position = WindowManager.getPosition(layout)
    const themeData = WindowManager.getThemeData(theme)
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      useContentSize: true,
      frame: true,
      titleBarStyle: 'hidden',
      trafficLightPosition: position,
      backgroundColor: themeData['secondary'],
      webPreferences: {
        devTools: true,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        additionalArguments: ['--window-id=main'],
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

    win.webContents.on('before-input-event', (event, input) => {
      // Windows/Linux: Ctrl+Shift+I, macOS: Cmd+Option+I
      if (
        (input.control || input.meta) &&
        input.shift &&
        input.key.toLowerCase() === 'i'
      ) {
        win.webContents.toggleDevTools()
      }
    })

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

    win.webContents.on('did-finish-load', () => {
      win.webContents.focus()
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
    const theme = configManager.getTheme()
    const themeData = WindowManager.getThemeData(theme)
    const newWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      useContentSize: true,
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 12, y: 12 },
      backgroundColor: themeData['secondary'],
      webPreferences: {
        webviewTag: true,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        additionalArguments: [`--window-id=${id}`],
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

    // Open url in system browser
    newWindow.webContents.on('will-navigate', (event, url) => {
      // Only process in production mode
      if (process.env.NODE_ENV === 'production' && url.startsWith('http')) {
        event.preventDefault()
        shell.openExternal(url)
      }
    })
    newWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http')) {
        shell.openExternal(url)
      }
      return { action: 'deny' }
    })

    newWindow.on('closed', () => {
      if (this.windows[id]) {
        delete this.windows[id]
      }
    })

    this.windows[id] = newWindow
  }

  getWindow(id: string) {
    const win = this.windows[id]
    if (win && !win.isDestroyed()) {
      return win
    }
    return null
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

  setWindowButton(layout: string, id?: string) {
    const win = id ? this.windows[id] : WindowManager.mainWindow
    const position = WindowManager.getPosition(layout)
    win?.setWindowButtonPosition(position)
    log.info('🦋 setWindowButton', layout, position)
  }

  static getPosition(layout: string) {
    switch (layout) {
      case 'tab':
        return  { x: 8, y: 12 }
      case 'group':
        return { x: 8, y: 16 }
      default:
        return  { x: 8, y: 12 }
    }
  }

  static getThemeData(theme: string) {
    return THEMES[theme] ?? THEMES['light']
  }
}

export const windowManager = new WindowManager()
