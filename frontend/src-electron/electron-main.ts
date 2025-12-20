import { app, BrowserWindow, shell, session } from 'electron'
import { fileURLToPath } from 'node:url'
import log from 'electron-log'
import path from 'path'
import os from 'os'
import * as remoteMain from '@electron/remote/main/index.js'
import { Application } from './app/application'
import { startServer, stopServer } from './server/fastapi'
import { ExpressServer } from './server/express'
import { WindowManager } from './app/window-manager'

remoteMain.initialize()
const currentDir = fileURLToPath(new URL('.', import.meta.url))
const platform = process.platform || os.platform()
let mainWindow = WindowManager.getMainWindow()
let expressServer: ExpressServer | undefined = undefined

/**
 * Main window
 */
const createWindow = async () => {
  if (mainWindow) {
    log.error('Avoid create again.')
    return
  }

  /**
   * Initial window options
   *
   * @see https://www.electronjs.org/docs/latest/api/browser-window
   */
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    useContentSize: true,
    frame: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 8, y: 12 },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      sandbox: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER ?? '', 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      ),
    },
  })

  remoteMain.enable(mainWindow.webContents)
  mainWindow.maximize()
  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    expressServer = new ExpressServer()
    try {
      await expressServer.start()
      await mainWindow.loadURL(expressServer.getUrl())

      // const virtualUrl = 'https://www.pileax.ai'
      // const session = mainWindow.webContents.session
      // session.webRequest.onBeforeRequest({ urls: [`${virtualUrl}/*`] }, (details, callback) => {
      //   const redirectURL = details.url.replace(virtualUrl, expressServer!.getUrl())
      //   callback({ redirectURL })
      // })
      //
      // await mainWindow.loadURL(virtualUrl)
      // log.error('✅ Succeed to start Express server:', virtualUrl)
    } catch (err) {
      log.error('❌ Failed to start Express server:', err)

      // Fallback
      await mainWindow.loadFile('index.html')
    }
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    // mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      // mainWindow?.webContents.closeDevTools(); // Todo: uncomment in production
    })
  }

  // Open url in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = undefined
  })

  WindowManager.setMainWindow(mainWindow)
}

app.whenReady().then(async () => {
  await startServer()
  await createWindow()

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
      createWindow()
    }
  })
})

app.on('activate', () => {
  if (mainWindow === undefined && BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('before-quit', (event) => {
  stopServer('before-quit')
})

app.on('window-all-closed', async () => {
  if (platform !== 'darwin') {
    app.quit()
  }

  // server
  await stopServer('window-all-closed')

  // express
  if (expressServer) {
    await expressServer.stop()
    expressServer = undefined
  }
})

// App initialization
Application.initialize()

