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
import { PathManager } from '../app/pathManager'
import { dbExecute } from '../db/service';
import { serverInfo } from '../server/fastapi';
import {
  openNewWindow,
  closeWindow,
  maximizeWindow,
  minimizeWindow,
  isWindowMaximized
} from './window';

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
    const publicPath = pathManger.appPublicRootPath();
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
