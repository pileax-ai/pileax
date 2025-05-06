import { app, ipcMain, BrowserWindow, session, nativeTheme } from 'electron';
import { fileURLToPath } from 'node:url';
import log from 'electron-log';
import path from 'path';
import os from 'os';
import * as remoteMain from '@electron/remote/main/index.js';
import { Application } from './app/application';
import { startServer, stopServer } from './server/server';

remoteMain.initialize();
const currentDir = fileURLToPath(new URL('.', import.meta.url));
const platform = process.platform || os.platform();
let mainWindow: BrowserWindow | undefined;
let serverInfo: Indexable | undefined;

/**
 * Main window
 */
async function createWindow() {
  if (mainWindow) {
    log.error('Avoid create again.')
    return;
  }

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1200,
    height: 800,
    useContentSize: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 8, y: 12 },
    // titleBarOverlay: process.platform === 'win32' ? {
    //   height: 40,
    //   color: 'rgba(0, 0, 0, 0)',
    //   symbolColor: 'rgba(0, 0, 0, 0)'
    // } : undefined,
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
  });

  remoteMain.enable(mainWindow.webContents);
  mainWindow.maximize();
  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL);
  } else {
    await mainWindow.loadFile('index.html')
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    // mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      // mainWindow?.webContents.closeDevTools(); // Todo: uncomment in production
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(async () => {
  serverInfo = await startServer();
  await createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Remove X-Frame-Options to allow open in iframe.
    const responseHeaders = details.responseHeaders;
    if (responseHeaders) {
      delete responseHeaders['x-frame-options'];
      delete responseHeaders['X-Frame-Options'];
    } else {
      return
    }
    callback({ cancel: false, responseHeaders });
  });
});

app.on('activate', () => {
  if (mainWindow === undefined && BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', (event) => {
  stopServer('before-quit');
});

app.on('window-all-closed', async () => {
  if (platform !== 'darwin') {
    stopServer('window-all-closed');
    app.quit();
  }
});

// App initialization
Application.initialize();

ipcMain.handle('get-server-info', () => {
  return serverInfo;
});
