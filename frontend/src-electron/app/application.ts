import { ipcMain, nativeTheme } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

import {
  readFile,
  readImage,
  saveImageFile
} from '../utils/file'
import { pathManager } from './path-manager'
import { logManager } from './log-manager'
import { TrayManager } from './tray-manager'
import { server } from '../server/fastapi'
import { WindowManager, windowManager } from './window-manager'
import { PROTOCOL_SCHEME, VIRTUAL_HOST, VIRTUAL_URL } from './constant'
import { joinPath } from '../utils/path'

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
      return server.serverInfo
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
        // ? path.join('file://', process.resourcesPath, 'app.asar', p)
        ? `${PROTOCOL_SCHEME}://` + joinPath(VIRTUAL_HOST, p)
        : p
      })

    ipcMain.handle('migrate-library',
      async (event, options) => {
        const  result = await pathManager.migrateLibrary(options)
        if (result.success) {
          await server.restart()
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
