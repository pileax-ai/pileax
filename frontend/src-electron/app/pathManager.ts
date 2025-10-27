import { app } from 'electron';
import fs from 'fs-extra';
import log from 'electron-log';
import path from 'path';
import { restartServer } from '../server/fastapi';
import { Application } from 'app/src-electron/app/application'
import { sleep } from 'core/utils/misc'
import { isDirectoryEmpty, isDirectoryExists } from 'app/src-electron/utils/file'

export interface PathConfig {
  paths?: Record<string, string>
}

export interface MigrateOptions {
  backup?: boolean
  removeOld?: boolean
}

export interface MigrateLibraryOptions {
  location: string
  type: string
}

export interface MigrateResult {
  success: boolean
  message: string
  code?: string
}

/**
 * library
 * ├── logs
 * │ └── electron.log
 * ├── metadata.db
 * └── public
 *     ├── book
 *     └── file
 */
export class PathManager {
  private appName?: string;
  private userData: string;
  private configPath: string;
  private config: PathConfig;
  private defaultPaths: Record<string, string>;

  constructor(appName?: string) {
    this.appName = appName;
    this.userData = app.getPath('userData');
    this.configPath = appName
      ? path.join(app.getPath('appData'), appName, 'config.json')
      : path.join(this.userData, 'config.json');
    this.config = this.loadConfig();
    this.defaultPaths = {
      library: path.join(this.userData, 'library'),
    }
  }

  /**
   * Load config
   */
  private loadConfig(): PathConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      }
    } catch (e) {
      console.error('[PathManager] Failed to load config:', e);
    }
    return { paths: {} }
  }

  /**
   * Save config to disk
   * @private
   */
  private saveConfig(): void {
    fs.mkdirSync(path.dirname(this.configPath), { recursive: true });
    fs.writeFileSync(
      this.configPath,
      JSON.stringify(this.config, null, 2)
    );
  }

  getPath(key: string): string {
    return this.config.paths?.[key] || this.defaultPaths[key] || '';
  }

  setPath(key: string, newPath: string): void {
    if (!this.config.paths) this.config.paths = {};
    this.config.paths[key] = newPath;
    this.saveConfig();
  }

  getAllPaths(): Record<string, string> {
    const keys = Object.keys(this.defaultPaths);
    const result: Record<string, string> = {
      userData: this.userData,
    }
    for (const k of keys) {
      result[k] = this.getPath(k);
    }
    return result;
  }

  appLogsPath(): string {
    return path.join(this.userData, 'logs');
  }

  appLogFilePath(): string {
    return path.join(this.appLogsPath(), 'electron.log');
  }

  appLibraryPath(): string {
    return this.getPath('library');
  }

  appDbFilePath(): string {
    return path.join(this.appLibraryPath(), 'metadata.db');
  }

  appPublicRootPath(): string {
    return path.join(this.appLibraryPath(), 'public');
  }

  async migrate(key: string, newDir: string, cut: boolean): Promise<MigrateResult> {
    const oldDir = this.getPath(key)
    if (oldDir === newDir) {
      return { success: false, message: 'Location not changed', code: 'sameLocation' }
    }

    try {
      await fs.ensureDir(newDir)

      await fs.copy(oldDir, newDir, { overwrite: true })
      this.setPath(key, newDir)

      if (cut) {
        await fs.remove(oldDir)
      }

      return { success: true, message: `Migrated ${key} to ${newDir}`, code: '' }
    } catch (err: any) {
      console.error(`Failed to migrate ${key}:`, err)
      return { success: false, message: err.message || String(err), code: 'error' }
    }
  }

  async migrateLibrary(options: MigrateLibraryOptions) {
    const newDir = options.location
    const type = options.type
    if (!isDirectoryExists(newDir)) {
      return { success: false, message: 'Location does not exist', code: `noExist` }
    }

    log.info(`🚚 Migrating [${type}] library to ${newDir} ...`);
    // migrate
    let result = { success: true, message: '', code: '' }
    switch (type) {
      case 'create':
        result.message = `Create new library at ${newDir}`
        break;
      case 'open':
        result.message = `Use exist library at ${newDir}`
        break;
      case 'move':
        if (await isDirectoryEmpty(newDir)) {
          result = (await this.migrate('library', newDir, true)) as any
        } else {
          result = { success: false, message: 'New location is not empty', code: 'notEmpty' }
        }
        break;
    }

    // Restart server
    if (result.success) {
      this.setPath('library', newDir);

      // Reload app
      Application.reload();
      await restartServer();
      await sleep(3000)
    }

    return result
  }
}
