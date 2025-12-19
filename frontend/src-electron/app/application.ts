import { ipcMain, nativeTheme } from 'electron'
import fs from 'fs'

import {
  readFile,
  readImage,
  readBookFile,
  readBookCover,
  saveBookFiles,
  saveImageFile
} from '../utils/file'
import { pathManager } from './path-manager'
import { logManager } from './log-manager'
import { TrayManager } from './tray-manager'
import { serverInfo } from '../server/fastapi'
import { WindowManager, windowManager } from './window-manager'
import path from 'path'

let trayManager: TrayManager

export class Application {
  static initialize() {
    Application.initPath()
    Application.initLog()
    Application.initIpcMain()
  }

  static reload() {
    Application.initPath()
    Application.initLog()
  }

  static initPath() {
    const publicPath = pathManager.appPublicPath()
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true })
      console.log(`📁 Create public dir: ${publicPath}`)
    } else {
      console.log(`✅ Public dir is ready: ${publicPath}`)
    }
  }

  static initLog() {
    logManager.init()
    // const logFilePath = pathManager.appLogFilePath();
    // log.initialize();
    // log.transports.file.resolvePathFn = () => {
    //   return logFilePath;
    // };
    // log.info('Init log: ', logFilePath);
  }

  static initTray(activate?: () => void) {
    trayManager = new TrayManager(activate)
  }

  static initIpcMain() {

    ipcMain.handle('get-path',
      (event, key: string) => {
        return pathManager.getPath(key)
      })

    ipcMain.handle('get-server-info', () => {
      return serverInfo
    })

    ipcMain.handle("log:init", (event, maxLines = 100) => {
      return logManager.readLastLines(maxLines)
    })
    ipcMain.handle("log:start", (_, maxLines = 100) =>
      logManager.startWatch(maxLines))
    ipcMain.handle("log:stop", () => logManager.stopWatch())

    ipcMain.handle('open-new-window',
      (event, id: string, url: string, titleBarHeight = 40) => {
        windowManager.openNewWindow(id, url, titleBarHeight)
      })

    ipcMain.handle('public-path',
      (event, p: string) => {
      return process.env.NODE_ENV === 'production'
        ? path.join('file://', process.resourcesPath, 'app.asar', p)
        : p
      })

    ipcMain.handle('migrate-library',
      async (event, options) => {
        return await pathManager.migrateLibrary(options)
      })

    ipcMain.handle('read-book-file',
      async (event, filePath) => {
        return await readBookFile(filePath)
      })

    ipcMain.handle('read-book-cover',
      async (event, filePath) => {
        return await readBookCover(filePath)
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

    ipcMain.handle('save-book-files',
      async (event, metadata) => {
        return await saveBookFiles(metadata)
      })

    ipcMain.handle('save-image-file',
      async (event, metadata) => {
        return await saveImageFile(metadata)
      })

    ipcMain.handle('set-theme',
      (event, theme: 'system' | 'light' | 'dark') => {
      console.log('set-theme', theme)
      nativeTheme.themeSource = theme
    })

    ipcMain.handle('update-tray-menu',
      async (event, options) => {
        trayManager?.updateTrayMenu(options)
      })

    ipcMain.handle('window-close', () => {
      WindowManager.closeWindow()
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
  }
}
