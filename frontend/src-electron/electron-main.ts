import { app, BrowserWindow, shell, session, protocol } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import log from 'electron-log'
import os from 'os'
import * as remoteMain from '@electron/remote/main/index.js'
import { Application } from './app/application'
import { startServer, stopServer } from './server/fastapi'
import { ExpressServer } from './server/express'
import { WindowManager } from './app/window-manager'
import { lookup } from 'mime-types'

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
    await mainWindow.loadURL('https://www.pileax.ai')
    // expressServer = new ExpressServer()
    // try {
    //   await expressServer.start()
    //   // await mainWindow.loadURL(expressServer.getUrl())
    //
    //   const virtualUrl = 'https://www.pileax.ai'
    //   const session = mainWindow.webContents.session
    //   session.webRequest.onBeforeRequest({ urls: [`${virtualUrl}/*`] }, (details, callback) => {
    //     const redirectURL = details.url.replace(virtualUrl, expressServer!.getUrl())
    //     callback({ redirectURL })
    //   })
    //
    //   await mainWindow.loadURL(virtualUrl)
    //   log.error('✅ Succeed to start Express server:', virtualUrl)
    // } catch (err) {
    //   log.error('❌ Failed to start Express server:', err)
    //
    //   // Fallback
    //   await mainWindow.loadFile('index.html')
    // }
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

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'https',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
      corsEnabled: true,
    },
  },
])

const registerProtocol = () => {
  protocol.handle('https', async (request) => {
    const url = new URL(request.url)

    // 只拦截你的虚拟域名
    if (url.hostname !== 'www.pileax.ai') {
      return fetch(request)
    }

    let pathname = url.pathname
    if (pathname === '/') pathname = '/index.html'

    const root = process.resourcesPath + '/app'
    const filePath = root + pathname

    try {
      const data = await fs.promises.readFile(filePath)
      const contentType = lookup(filePath)
      log.info('Open: ', filePath, contentType)

      return new Response(data, {
        headers: {
          'Content-Type': contentType || 'text/plain',
          'Cache-Control': 'no-cache'
        },
      })
    } catch {
      // SPA fallback
      const index = await fs.promises.readFile(
        root + '/index.html'
      )
      return new Response(index, {
        headers: { 'Content-Type': 'text/html' },
      })
    }
  })
}

app.whenReady().then(async () => {
  registerProtocol()
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

