import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
  type OpenDialogOptions
} from 'electron'
import log from 'electron-log'
import fs from 'node:fs'
import path from 'node:path'

import {
  readFile,
  readImage,
  saveImageFile
} from '../utils/file'
import { initAppListener } from './app-listener'
import { configManager } from './config-manager'
import { logManager } from './log-manager'
import { openFileManager } from './open-file-manager'
import { TrayManager } from './tray-manager'
import { updaterManager } from './updater-manager'
import { server } from '../server/fastapi'
import { WindowManager, windowManager } from './window-manager'
import { PROTOCOL_SCHEME, VIRTUAL_HOST } from './constant'
import { joinPath } from '../utils/path'
import { storageManager } from './storage-manager'

let trayManager: TrayManager

export class Application {
  static initialize() {
    Application.initApp()
    initAppListener()

    Application.initPath()
    Application.initLog()
    Application.initIpcMain()
  }

  static reload() {
    Application.initPath()
  }

  static initApp() {
    app.setName('PileaX')
    app.disableHardwareAcceleration()
  }

  static initUpdater() {
    log.info('🔄 Init and auto check update')
    updaterManager.check()
  }

  static initPath() {
    const publicPath = configManager.appPublicPath()
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true })
      console.log(`📁 Create public dir: ${publicPath}`)
    } else {
      console.log(`✅ Public dir is ready: ${publicPath}`)
    }
  }

  static initLog() {
    logManager.init()
  }

  static initTray(activate?: () => void) {
    trayManager = new TrayManager(activate)
  }

  static initIpcMain() {
    ipcMain.handle('get-open-file',
      (event) => {
        openFileManager.getFile()
      })

    ipcMain.handle('get-path',
      (event, key: string) => {
        return configManager.getPath(key)
      })

    ipcMain.handle('get-server-info', () => {
      return server.serverInfo
    })

    ipcMain.handle("log:init", (event, maxLines = 100) => {
      return logManager.readLastLines(maxLines)
    })
    ipcMain.handle("log:start", (_, maxLines = 100) =>
      logManager.startWatch(maxLines))
    ipcMain.handle("log:stop", () => logManager.stopWatch())


    ipcMain.handle('public-path',
      (event, p: string) => {
      return process.env.NODE_ENV === 'production'
        // ? path.join('file://', process.resourcesPath, 'app.asar', p)
        ? `${PROTOCOL_SCHEME}://` + joinPath(VIRTUAL_HOST, p)
        : p
      })

    ipcMain.handle('migrate-library',
      async (event, options) => {
        const  result = await configManager.migrateLibrary(options)
        if (result.success) {
          await server.restart(true)
          configManager.cleanOldLibrary()
        }
        return result
      })


    ipcMain.handle('read-file',
      async (event, filePath) => {
        return await readFile(filePath)
      })

    ipcMain.handle('read-image',
      async (event, filePath) => {
        return await readImage(filePath)
      })

    ipcMain.handle('reload',
      async (event, force: boolean) => {
        const mainWindow = WindowManager.getMainWindow()
        if (force) {
          mainWindow?.webContents.reloadIgnoringCache()
        } else {
          mainWindow?.reload()
        }
      })

    ipcMain.handle('restart',
      async (event) => {
        // Set the relaunch arguments (optional) and relaunch
        app.relaunch()

        // Exit the current instance immediately to allow the new one to start
        app.exit(0)
      })


    ipcMain.handle('save-image-file',
      async (event, metadata) => {
        return await saveImageFile(metadata)
      })

    ipcMain.handle('set-theme',
      (event, theme: 'system' | 'light' | 'dark') => {
      nativeTheme.themeSource = theme
    })

    ipcMain.handle('get-app-mode',
      (event) => {
        return configManager.getAppMode()
      })

    ipcMain.handle('set-app-mode',
      (event, mode: 'standalone' | 'cloud') => {
        configManager.setAppMode(mode)
      })

    ipcMain.handle('secure-set', (_, key: any, value: string) => {
      return storageManager.set(key, value)
    })

    ipcMain.handle('secure-get', (_, key: any) => {
      return storageManager.get(key)
    })

    ipcMain.handle('update-tray-menu',
      async (event, options) => {
        trayManager?.updateTrayMenu(options)
    })

    ipcMain.handle('updater', (event, options) => {
      console.log('updater', options)
      switch (options.action) {
        case 'check':
          return updaterManager.check()
        case 'download':
          return updaterManager.download()
        case 'update':
          return updaterManager.update(options)
      }
    })

    ipcMain.handle('window-close-main', () => {
      WindowManager.closeMainWindow()
    })

    ipcMain.handle('window-close', (event, id: string) => {
      windowManager.closeWindow(id)
    })

    ipcMain.handle('window-minimize', () => {
      WindowManager.minimizeWindow()
    })

    ipcMain.handle('window-maximize', () => {
      WindowManager.maximizeWindow()
    })

    ipcMain.handle('window-is-maximized', () => {
      return WindowManager.isWindowMaximized()
    })

    ipcMain.handle('open-new-window',
      (event, id: string, url: string, titleBarHeight = 40) => {
        windowManager.openNewWindow(id, url, titleBarHeight)
      })

    ipcMain.handle('show-dialog',
      async (event, options: OpenDialogOptions) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return

        return await dialog.showOpenDialog(win, options)
      })

    ipcMain.handle('open-path',
      async (event, relativePath: string, type = 'book') => {
        let fullPath = ''
        const safeRelativePath = relativePath.replace(/^(\.\.(\/|\\|$))+/, '')

        switch (type) {
          case 'book':
            fullPath = path.join(configManager.appPublicPath(), safeRelativePath)
            break
          default:
            fullPath = safeRelativePath
            break
        }

        if (!path.isAbsolute(fullPath)) {
          fullPath = path.resolve(fullPath)
        }

        const errorMessage = await shell.openPath(fullPath)

        if (errorMessage) {
          // Return error to renderer so the UI can show a notification
          console.error(`[Electron] Failed to open path: ${fullPath}. Error: ${errorMessage}`)
          return { success: false, error: errorMessage }
        }

        return { success: true }
      })

    ipcMain.on('window-control:toggle-devtools', (event) => {
      log.info('🚀 toggle-devtools')
      const webContents = event.sender
      if (webContents.isDevToolsOpened()) {
        webContents.closeDevTools()
      } else {
        webContents.openDevTools({ mode: 'detach' })
      }
    })
  }
}
