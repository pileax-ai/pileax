import type { ChildProcess} from 'child_process'
import { spawn } from 'child_process'
import getPort from 'get-port'
import log from 'electron-log'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'os'

import { configManager } from '../app/config-manager'
import { spaServer } from '../server/spa-server'

const currentDir = fileURLToPath(new URL('.', import.meta.url))
const platform = process.platform || os.platform()

class FastAPIServer {
  private serverProcess?: ChildProcess
  private port?: number
  private serverPath?: string
  private serverEntry?: string

  private dbPath: string
  private envPath: string
  private cachePath: string
  private publicPath: string

  constructor() {
    this.dbPath = configManager.appDbFilePath()
    this.envPath = configManager.appEnvFilePath()
    this.cachePath = configManager.appCachePath()
    this.publicPath = configManager.appPublicPath()
  }

  public async start() {
    this.port = await getPort({ port: 3000 })
    try {
      if (process.env.NODE_ENV === 'production') {
        await this.startProd()
      } else {
        await this.startDev()
      }

      this.bindEvents()
      log.info('✅ Start server...', this.serverInfo)
      log.info(`⚙️ Config path: `, configManager.configPath)
    } catch (err) {
      log.error('❌ Start server failed:', err)
    }
  }

  public async stop(event = 'NA') {
    if (!this.serverProcess) {
      log.info('⚠️ No server process to stop.', event)
      return
    }

    const pid = this.serverProcess.pid
    log.info(`⏹️ Stopping server process (pid: ${pid}) ...`, event)

    return new Promise<void>((resolve) => {
      if (this.serverProcess) {
        try {
          this.serverProcess.removeAllListeners()
          if (process.platform === 'win32' && pid) {
            spawn('taskkill', ['/pid', `${pid}`, '/f', '/t'])
            this.serverProcess.kill('SIGKILL')
          } else {
            this.serverProcess.kill('SIGTERM')
          }
        } catch (err) {
          log.error('❌ Failed to kill server process:', err)
          this.serverProcess = undefined
          resolve()
        }
      }
      setTimeout(() => {
        if (this.serverProcess) {
          log.warn('⚠️ Force clearing serverProcess after timeout.')
          this.serverProcess = undefined
        }
        resolve()
      }, 2000)
    })
  }

  public async restart(waitForReady = false) {
    log.info('🔄️ Restarting server process ...')
    this.resetPath()

    await this.stop('restart')
    await this.start()

    if (waitForReady) {
      await this.waitUntilReady()
    }
  }

  public async isReady() {
    return new Promise((resolve, reject) => {
      const req = http.get(
        {
          host: 'localhost',
          port: this.port,
          path: '/api/v1/system/health-check'
        },
        (res) => {
          resolve(res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300)
          res.resume()
        }
      )
      req.on('timeout', () => {
        req.destroy()
        resolve(false)
      })
      req.on('error', () => {
        resolve(false)
      })
    })
  }

  public async waitUntilReady(
    options?: {
      timeout?: number
      interval?: number
    }
  ): Promise<void> {
    const timeout = options?.timeout ?? 10_000
    const interval = options?.interval ?? 500
    const start = Date.now()

    while (true) {
      if (await this.isReady()) {
        return
      }

      if (Date.now() - start > timeout) {
        throw new Error('FastAPI server startup timeout')
      }

      await new Promise((r) => setTimeout(r, interval))
    }
  }

  get serverInfo(): Indexable {
    return {
      port: this.port,
      apiBase: `http://localhost:${this.port}/api/v1`,
      apiDocs: `http://localhost:${this.port}/docs`,
    }
  }

  private resetPath() {
    this.dbPath = configManager.appDbFilePath()
    this.envPath = configManager.appEnvFilePath()
    this.cachePath = configManager.appCachePath()
    this.publicPath = configManager.appPublicPath()
  }

  private async startProd() {
    this.serverPath = path.join(process.resourcesPath, 'backend')
    this.serverEntry = path.join(this.serverPath, 'runnable')
    const options: Indexable = {
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1',
        ENV_FILE: this.envPath,
        PORT: `${this.port}`,
        NODE_ENV: 'production',
        DB_PROVIDER: 'sqlite',
        DB_DATABASE: this.dbPath,
        CACHE_ROOT: this.cachePath,
        PUBLIC_FILE_ROOT: this.publicPath,
        WEB_API_CORS_ALLOW_ORIGINS: spaServer.serverInfo.url,
        DEBUG: false
      },
      cwd: this.serverPath,
      stdio: 'pipe',
      shell: true,
      detached: true,
      windowsHide: true
    }
    if (platform === 'win32') {
      options.shell = false
      options.detached = false
      options.windowsVerbatimArguments = false
      options.creationFlags = 0x08000000 // No window
    }

    this.serverProcess = spawn(this.serverEntry, [], options)
    this.serverProcess.unref()
  }

  private async startDev() {
    this.serverPath = path.join(currentDir, '../../../backend')
    this.serverEntry = path.join(this.serverPath, 'dist/runnable/runnable')
    log.info('⚙️ serverPath', this.serverPath)
    log.info('⚙️ envPath', this.envPath)

    const options: Indexable = {
      env: {
        ...process.env,
        ENV_FILE: this.envPath,
        PORT: `${this.port}`,
        NODE_ENV: 'development',
        DB_PROVIDER: 'sqlite',
        DB_DATABASE: this.dbPath,
        CACHE_ROOT: this.cachePath,
        PUBLIC_FILE_ROOT: this.publicPath,
        WEB_API_CORS_ALLOW_ORIGINS: process.env.APP_URL,
      },
      cwd: this.serverPath,
      stdio: 'pipe',
      shell: true
    }

    this.serverProcess = spawn(this.serverEntry, [], options)
    this.serverProcess.unref()
  }

  private async startDev0() {
    this.serverPath = path.join(currentDir, '../../../backend')
    this.serverEntry = path.join(this.serverPath, 'app/main.py')
    log.info('⚙️ serverPath', this.serverPath)
    log.info('⚙️ envPath', this.envPath)

    this.serverProcess = spawn('python', [this.serverEntry], {
      env: {
        ...process.env,
        ENV_FILE: this.envPath,
        PORT: `${this.port}`,
        NODE_ENV: 'development',
        DB_PROVIDER: 'sqlite',
        DB_DATABASE: this.dbPath,
        CACHE_ROOT: this.cachePath,
        PUBLIC_FILE_ROOT: this.publicPath,
        WEB_API_CORS_ALLOW_ORIGINS: process.env.APP_URL,
      },
      cwd: this.serverPath,
      stdio: 'pipe',
      shell: true
    })
  }

  private bindEvents() {
    this.serverProcess?.stdout?.on('data', (data: string) => {
      console.log(`Server: ${data}`)
      log.info(`[Server] ${data.slice(22)}`)
    })

    this.serverProcess?.stderr?.on('data', (data) => {
      log.error(`[Server Error] ${data}`)
    })

    this.serverProcess?.on('error', (code) => {
      log.error(`[Server error with code] ${code}`)
      this.serverProcess = undefined
    })

    this.serverProcess?.on('close', (code) => {
      log.info(`Server closed with code ${code}`)
      this.serverProcess = undefined
    })

    this.serverProcess?.on('exit', (code) => {
      log.info(`Server exited with code ${code}`)
      this.serverProcess = undefined
    })
  }
}

export const server = new FastAPIServer()
