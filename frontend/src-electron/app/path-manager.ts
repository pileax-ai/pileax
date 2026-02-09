import { app } from 'electron'
import fs from 'fs-extra'
import log from 'electron-log'
import path from 'node:path'
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
  configPath: string

  private appName?: string
  private userData: string
  private config: PathConfig
  private defaultPaths: Record<string, string>

  constructor(appName?: string) {
    this.appName = appName
    this.userData = app.getPath('userData')
    this.configPath = appName
      ? path.join(app.getPath('appData'), appName, 'config.json')
      : path.join(this.userData, 'config.json')
    this.config = this.loadConfig()
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
        return JSON.parse(fs.readFileSync(this.configPath, 'utf8'))
      }
    } catch (e) {
      console.error('[PathManager] Failed to load config:', e)
    }
    return { paths: {} }
  }

  /**
   * Save config to disk
   * @private
   */
  private saveConfig(): void {
    fs.mkdirSync(path.dirname(this.configPath), { recursive: true })
    fs.writeFileSync(
      this.configPath,
      JSON.stringify(this.config, null, 2)
    )
  }

  getPath(key: string): string {
    return this.config.paths?.[key] || this.defaultPaths[key] || ''
  }

  setPath(key: string, newPath: string): void {
    if (!this.config.paths) this.config.paths = {}
    this.config.paths[key] = newPath
    this.saveConfig()
  }

  getAllPaths(): Record<string, string> {
    const keys = Object.keys(this.defaultPaths)
    const result: Record<string, string> = {
      userData: this.userData,
    }
    for (const k of keys) {
      result[k] = this.getPath(k)
    }
    return result
  }

  appLogsPath(): string {
    return path.join(this.userData, 'logs')
  }

  appLogFilePath(): string {
    return path.join(this.appLogsPath(), 'electron.log')
  }

  appLibraryPath(): string {
    return this.getPath('library')
  }

  appDbFilePath(): string {
    return path.join(this.appLibraryPath(), 'metadata.db')
  }

  appCachePath(): string {
    return path.join(this.appLibraryPath(), '.cache')
  }

  appPublicPath(): string {
    return path.join(this.appLibraryPath(), 'public')
  }

  async migrate(key: string, newDir: string): Promise<MigrateResult> {
    const isEmpty = await isDirectoryEmpty(newDir)
    if (!isEmpty) {
      return MigrationMessage.error('New location is not empty', 'notEmpty')
    }

    const oldDir = this.getPath(key)
    if (oldDir === newDir) {
      return MigrationMessage.error('Location not changed', 'sameLocation')
    }

    try {
      await fs.ensureDir(newDir)

      await fs.copy(oldDir, newDir, { overwrite: true })

      // don't remove before reloading
      // await fs.remove(oldDir)

      return MigrationMessage.success(`Migrated ${key} to ${newDir}`)
    } catch (err: any) {
      log.error(`Failed to migrate ${key}:`, err)
      return MigrationMessage.error(err.message || String(err), 'error')
    }
  }

  async migrateCreate(newDir: string): Promise<MigrateResult> {
    if (await isDirectoryEmpty(newDir)) {
      return MigrationMessage.success(`Create new library at ${newDir}`)
    } else {
      return MigrationMessage.error('New location is not empty', 'notEmpty')
    }
  }

  async migrateExist(newDir: string): Promise<MigrateResult> {
    const dbPath = path.join(newDir, 'metadata.db')
    if (await fs.pathExists(dbPath)) {
      return MigrationMessage.success(`Use exist library at ${newDir}`)
    } else {
      return MigrationMessage.error('No metadata.db file found', 'notFound')
    }
  }

  async migrateLibrary(options: MigrateLibraryOptions) {
    const libraryKey = 'library'
    const oldDir = this.getPath(libraryKey)
    let newDir = options.location
    const type = options.type
    if (!isDirectoryExists(newDir)) {
      return MigrationMessage.error('Location does not exist', 'noExist')
    }

    log.info(`🚚 Migrating [${type}] library to ${newDir} ...`)

    // migrate
    let result = MigrationMessage.success('')
    switch (type) {
      case 'create':
        newDir = path.join(newDir, 'pileax-library')
        result = await this.migrateCreate(newDir)
        break
      case 'open':
        result = await this.migrateExist(newDir)
        break
      case 'move':
        result = await this.migrate(libraryKey, newDir)
        break
    }

    // Restart server
    if (result.success) {
      this.setPath('library', newDir)

      if (type === 'move') {
        this.setPath('library_old', oldDir) // save to remove it later
      }

      // Reload app
      Application.reload()
      await sleep(3000)
    }

    return result
  }

  async cleanOldLibrary() {
    const oldLibrary = this.getPath('library_old')
    const library = this.getPath('library')
    if (oldLibrary && oldLibrary !== library) {
      try {
        // don't remove before reloading
        await fs.remove(oldLibrary)
        this.setPath('library_old', '')
        log.info(`✅ Successfully removed the old - library ${oldLibrary}`)
      } catch (err: any) {
        log.error(`❌ Failed to remove old library ${oldLibrary}:`, err)
      }
    } else {
      log.info(`📁 Old library does not exist`)
    }
  }
}

class MigrationMessage {
  static success(message: string): MigrateResult {
    return { success: true, message: message, code: '' }
  }

  static error(message: string, code: string): MigrateResult {
    return { success: false, message: message, code: code }
  }
}

export const pathManager = new PathManager()
