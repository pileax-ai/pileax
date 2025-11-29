import { ipcMain, nativeTheme } from 'electron';
import fs from 'fs';
import log from 'electron-log';

import {
  readFile,
  readImage,
  readBookFile,
  readBookCover,
  saveBookFiles,
  saveImageFile
} from '../utils/file';
import { PathManager } from './path-manager'
import { TrayManager } from './tray-manager'
import { serverInfo } from '../server/fastapi';
import {
  openNewWindow,
  closeWindow,
  maximizeWindow,
  minimizeWindow,
  isWindowMaximized
} from './window';

let trayManager

export class Application {
  static initialize() {
    const pathManager = new PathManager();
    Application.initPath(pathManager);
    Application.initLog(pathManager);
    Application.initIpcMain();
  }

  static reload() {
    const pathManager = new PathManager();
    Application.initPath(pathManager);
    Application.initLog(pathManager);
  }

  static initPath(pathManger: PathManager) {
    const publicPath = pathManger.appPublicPath();
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
      console.log(`📁 Create public dir: ${publicPath}`);
    } else {
      console.log(`✅ Public dir is ready: ${publicPath}`);
    }
  }

  static initLog(pathManger: PathManager) {
    const logFilePath = pathManger.appLogFilePath();
    log.initialize();
    log.transports.file.resolvePathFn = () => {
      return logFilePath;
    };
    log.info('Init log: ', logFilePath);
  }

  static initTray(activate?: () => void) {
    trayManager = new TrayManager(activate)
  }

  static initIpcMain() {
    const pathManager = new PathManager();

    ipcMain.handle('set-theme',
      (event, theme: 'system' | 'light' | 'dark') => {
      console.log('set-theme', theme);
      nativeTheme.themeSource = theme;
    });

    ipcMain.handle('open-new-window',
      (event, id: string, url: string, titleBarHeight = 40) => {
      openNewWindow(id, url, titleBarHeight);
    });

    ipcMain.handle('window-close', () => {
      closeWindow();
    });

    ipcMain.handle('window-minimize', () => {
      minimizeWindow();
    });

    ipcMain.handle('window-maximize', () => {
      maximizeWindow();
    });

    ipcMain.handle('window-is-maximized', () => {
      return isWindowMaximized();
    });

    ipcMain.handle('read-file',
      async (event, filePath) => {
        return await readFile(filePath);
      });

    ipcMain.handle('read-image',
      async (event, filePath) => {
        return await readImage(filePath);
      });

    ipcMain.handle('read-book-file',
      async (event, filePath) => {
        return await readBookFile(filePath);
      });

    ipcMain.handle('read-book-cover',
      async (event, filePath) => {
        return await readBookCover(filePath);
      });

    ipcMain.handle('save-book-files',
      async (event, metadata) => {
        return await saveBookFiles(metadata);
      });

    ipcMain.handle('save-image-file',
      async (event, metadata) => {
        return await saveImageFile(metadata);
      });

    ipcMain.handle('get-server-info', () => {
      return serverInfo;
    });

    ipcMain.handle('get-path',
      (event, key: string) => {
        return pathManager.getPath(key);
      });

    ipcMain.handle('migrate-library',
      async (event, options) => {
        return await pathManager.migrateLibrary(options);
      });
  }
}
