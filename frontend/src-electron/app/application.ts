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
import { appLogPath, appStoragePath } from '../utils/path'
import { dbExecute } from '../db/service';
import {
  openNewWindow,
  closeWindow,
  maximizeWindow,
  minimizeWindow,
  isWindowMaximized
} from './window';

export class Application {
  static initialize() {
    Application.initPath();
    Application.initLog();
    Application.initIpcMain();
  }

  static initPath() {
    const storagePath = appStoragePath();
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
      console.log(`📁 Create storage dir: ${storagePath}`);
    } else {
      console.log(`✅ Storage dir is ready: ${storagePath}`);
    }
  }

  static initLog() {
    const logPath = appLogPath();
    log.initialize();
    log.transports.file.resolvePathFn = () => {
      return logPath;
    };
    log.info('Init log: ', logPath);
  }

  static initIpcMain() {
    ipcMain.handle('set-theme',
      (event, theme: 'system' | 'light' | 'dark') => {
      console.log('set-theme', theme);
      nativeTheme.themeSource = theme;
    });

    ipcMain.handle('open-new-window',
      (event, id: string, url: string, titleBarHeight = 40) => {
      openNewWindow(id, url, titleBarHeight);
    });

    ipcMain.handle('window-minimize', () => {
      minimizeWindow();
    });

    ipcMain.handle('window-maximize', () => {
      maximizeWindow();
    });

    ipcMain.handle('window-close', () => {
      closeWindow();
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

    ipcMain.handle('db-execute',
      async (event, entity: string, method: string, params: any) => {
        return new Promise((resolve, reject) => {
          dbExecute(entity, method, params).then(result => {
            resolve(result);
          }).catch(err => {
            console.error('db-execute', entity, method, params, err);
            reject(err);
          });
        });
      });
  }
}
