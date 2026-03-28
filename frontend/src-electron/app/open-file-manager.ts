import { app } from 'electron'
import log from 'electron-log'
import path from 'node:path'
import { WindowManager } from './window-manager'
import { readFileObject } from 'app/src-electron/utils/file'

/**
 * Open File Manager: Handle file associations
 */
export class OpenFileManager {
  private pendingFilePath: string | null = null

  constructor() {
    this.init()
  }

  init() {
    log.info('Init OpenFileManager')
    this.pendingFilePath = null
  }

  onOpenFile(args: string[], source = '') {
    const filePath = args.find(arg => path.isAbsolute(arg)
      && arg !== process.execPath
      && !arg.includes('node_modules')
      && !arg.startsWith('--'))
    if (filePath) {
      this.sendFile(filePath, source)
    }
  }

  async sendFile(filePath: string, source = '') {
    const mainWindow = WindowManager.getMainWindow()
    if (app.isReady() && mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.webContents.isLoading()) {
        this.pendingFilePath = filePath
      } else {
        this.sendAppEvent('open-file', {
          path: filePath,
          file: await readFileObject(filePath),
          source: source
        })
      }
    } else {
      this.pendingFilePath = filePath
      WindowManager.createMainWindow()
    }
  }

  getFile() {
    if (this.pendingFilePath) {
      this.sendFile(this.pendingFilePath, 'get-file')
      this.pendingFilePath = null
    }
  }

  sendAppEvent(event: string, data?: any) {
    WindowManager.getMainWindow()?.webContents.send('app-event', event, data)
  }
}

export const openFileManager = new OpenFileManager()
