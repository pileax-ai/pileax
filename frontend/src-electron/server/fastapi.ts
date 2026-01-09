import type { ChildProcess} from 'child_process'
import { spawn } from 'child_process'
import getPort from 'get-port'
import log from 'electron-log'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'os'

import { pathManager } from '../app/path-manager'
import { spaServer } from '../server/spa-server'

const currentDir = fileURLToPath(new URL('.', import.meta.url))
const platform = process.platform || os.platform()

class FastAPIServer {
  private serverProcess?: ChildProcess
  private port?: number
  private envPath?: string
  private serverPath?: string
  private serverEntry?: string

  private readonly dbPath: string
  private readonly cachePath: string
  private readonly publicPath: string

  constructor() {
    this.dbPath = pathManager.appDbFilePath()
    this.cachePath = pathManager.appCachePath()
    this.publicPath = pathManager.appPublicPath()
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
      log.info(`⚙️ Config path: `, pathManager.configPath)
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

  public async restart() {
    log.info('🔄️ Restarting server process ...')
    await this.stop('restart')
    await this.start()
  }

  get serverInfo(): Indexable {
    return {
      port: this.port,
      apiBase: `http://localhost:${this.port}/api/v1`,
      apiDocs: `http://localhost:${this.port}/docs`,
      appBase: `http://localhost:${this.port}`,
    }
  }

  private async startProd() {
    this.serverPath = path.join(process.resourcesPath, 'backend')
    this.serverEntry = path.join(this.serverPath, 'runnable')
    const options: Indexable = {
      env: {
        ...process.env,
        // IMPORTANT: 使用 spawn(process.execPath, ...) 启动子进程时，默认会运行一个新的 Electron 实例，导致应用重复打开。
        // 通过设置环境变量 ELECTRON_RUN_AS_NODE，可以让子进程以普通 Node.js 模式运行服务脚本，避免创建新窗口。
        ELECTRON_RUN_AS_NODE: '1',
        PORT: `${this.port}`,
        NODE_ENV: 'production',
        DB_PROVIDER: 'sqlite',
        DB_DATABASE: this.dbPath,
        CACHE_ROOT: this.cachePath,
        PUBLIC_FILE_ROOT: this.publicPath,
        WEB_API_CORS_ALLOW_ORIGINS: spaServer.serverInfo.url,
        // COOKIE_DOMAIN: VIRTUAL_DOMAIN
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
    this.serverEntry = path.join(this.serverPath, 'app/main.py')
    this.envPath = path.join(this.serverPath, '.env')
    log.info('⚙️ serverPath', this.serverPath)

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
