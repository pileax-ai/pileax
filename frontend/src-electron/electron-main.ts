import { app, BrowserWindow, session } from 'electron'
import log from 'electron-log'
import os from 'os'
import { Application } from './app/application'
import { server } from './server/fastapi'
import { spaServer } from './server/spa-server'
import { WindowManager } from './app/window-manager'
import { configManager } from './app/config-manager'
import { openFileManager } from './app/open-file-manager'

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine) => {
    openFileManager.onOpenFile(commandLine, 'second-instance')

    const mainWindow = WindowManager.getMainWindow()
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  // App initialization
  Application.initialize()

  // App life cycle
  app.whenReady().then(async () => {
    const appMode = configManager.getAppMode()
    log.info('🚀 Running app in:', appMode)

    await spaServer.start()

    if (appMode === 'standalone') {
      await server.start()
    }

    await WindowManager.createMainWindow('whenReady')
    Application.initUpdater()

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      // Remove X-Frame-Options to allow open in iframe.
      const responseHeaders = details.responseHeaders
      if (responseHeaders) {
        delete responseHeaders['x-frame-options']
        delete responseHeaders['X-Frame-Options']
      } else {
        return
      }
      callback({ cancel: false, responseHeaders })
    })

    Application.initTray(() => {
      const mainWindow = WindowManager.getMainWindow()
      if (!mainWindow && BrowserWindow.getAllWindows().length === 0) {
        WindowManager.createMainWindow('initTray')
      }
    })
  })
}

app.on('activate', async () => {
  const mainWindow = WindowManager.getMainWindow()
  if (!mainWindow && BrowserWindow.getAllWindows().length === 0) {
    await WindowManager.createMainWindow('activate')
  }
})

app.on('before-quit', async (event) => {
  await spaServer.stop()
  await server.stop('before-quit')
})

app.on('window-all-closed', async () => {
  const platform = process.platform || os.platform()
  if (platform !== 'darwin') {
    app.quit()
  }
})
