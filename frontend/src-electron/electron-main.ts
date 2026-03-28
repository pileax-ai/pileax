import { app, BrowserWindow, session } from 'electron'
import log from 'electron-log'
import os from 'os'
import { Application } from './app/application'
import { server } from './server/fastapi'
import { spaServer } from './server/spa-server'
import { WindowManager } from './app/window-manager'
import { configManager } from './app/config-manager'

// App initialization
Application.initialize()

// App life cycle
const platform = process.platform || os.platform()
const mainWindow = WindowManager.getMainWindow()

app.whenReady().then(async () => {
  const appMode = configManager.getAppMode()
  log.info('🚀 Running app in:', appMode)

  await spaServer.start()

  if (appMode === 'standalone') {
    await server.start()
  }

  await WindowManager.createMainWindow()
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
    if (mainWindow === undefined && BrowserWindow.getAllWindows().length === 0) {
      WindowManager.createMainWindow()
    }
  })
})

app.on('activate', async () => {
  if (mainWindow === undefined && BrowserWindow.getAllWindows().length === 0) {
    await WindowManager.createMainWindow()
  }
})

app.on('before-quit', async (event) => {
  await spaServer.stop()
  await server.stop('before-quit')
})

app.on('window-all-closed', async () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})
