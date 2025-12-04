import { app, BrowserWindow } from 'electron';
import { pathManager } from './path-manager';
import fs from 'fs-extra';
import log from 'electron-log';

export interface MigrateResult {
  success: boolean
  message: string
  code?: string
}

/**
 * Log Manager
 */
export class LogManager {
  private logFilePath: string;
  private watcher: fs.FSWatcher | null = null;

  constructor() {
    this.logFilePath = pathManager.appLogFilePath();
  }

  init() {
    log.initialize();
    log.transports.file.resolvePathFn = () => {
      return this.logFilePath;
    };
    log.info('Init log: ', this.logFilePath);
  }

  readLastLines(maxLines = 100): string {
    const stats = fs.statSync(this.logFilePath);
    const fileSize = stats.size;
    const bufferSize = 4096;
    const buffer = Buffer.alloc(bufferSize);

    let lines: string[] = [];
    let position = fileSize;

    while (position > 0 && lines.length <= maxLines) {
      const readSize = Math.min(bufferSize, position);
      position -= readSize;

      const fd = fs.openSync(this.logFilePath, 'r');
      fs.readSync(fd, buffer, 0, readSize, position);
      fs.closeSync(fd);

      lines = buffer.slice(0, readSize).toString('utf-8').split('\n').concat(lines);
    }

    return lines.slice(-maxLines).join('\n');
  }

  startWatch(win: BrowserWindow) {
    if (this.watcher) {
      return;
    }

    this.watcher = fs.watch(this.logFilePath, { encoding: 'utf-8' }, () => {
      const stats = fs.statSync(this.logFilePath);
      const size = stats.size;

      // Read latest 8KB
      const start = Math.max(0, size - 8192);

      const stream = fs.createReadStream(this.logFilePath, {
        encoding: 'utf-8',
        start,
      });

      let chunk = '';
      stream.on('data', (part) => {
        chunk += part.toString();
      });
      stream.on('end', () => {
        win?.webContents.send('log:update', chunk);
      });
    });
  }

  stopWatch() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}

export const logManager = new LogManager();
