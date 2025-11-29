import { BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'path';

import * as remoteMain from '@electron/remote/main/index.js';
const currentDir = fileURLToPath(new URL('.', import.meta.url));
const windows: Indexable = {};

// Open new window with id
export const openNewWindow = async (id: string, url: string, titleBarHeight = 40) => {
  // Focus window if exists.
  const w = windows[id];
  if (w && !w.isDestroyed()) {
    w.focus();
    return;
  }

  // Create new window.
  const newWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1200,
    height: 800,
    useContentSize: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 12 },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      sandbox: false,
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER ?? '', 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      ),
    },
  });
  remoteMain.enable(newWindow.webContents);

  if (process.env.DEV) {
    const newUrl = `${process.env.APP_URL}#${url}`;
    await newWindow.loadURL(newUrl);
  } else {
    await newWindow.loadFile('index.html', {
      hash: url
    });
  }

  newWindow.on('closed', () => {
    delete windows[id];
  });

  windows[id] = newWindow;
}

export const minimizeWindow = () => {
  const win = BrowserWindow.getFocusedWindow();
  win?.minimize();
}

export const maximizeWindow = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
}

export const closeWindow = () => {
  const win = BrowserWindow.getFocusedWindow();
  win?.close();
}

export const isWindowMaximized = () => {
  const win = BrowserWindow.getFocusedWindow();
  return win?.isMaximized() ?? false;
}
