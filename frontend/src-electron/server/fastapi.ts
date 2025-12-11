import type { ChildProcess} from 'child_process'
import { spawn } from 'child_process'
import getPort from 'get-port'
import log from 'electron-log'
import path from 'path'
import { fileURLToPath } from 'node:url'
import os from 'os'
import { pathManager } from '../app/path-manager'

const currentDir = fileURLToPath(new URL('.', import.meta.url))
const platform = process.platform || os.platform()
let serverProcess: ChildProcess | undefined
let serverInfo: Indexable | undefined

/**
 * Start a local server
 */
async function startServer() {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    const port = await getPort({ port: 3000 })
    const dbPath = pathManager.appDbFilePath()
    const cachePath = pathManager.appCachePath()
    const publicPath = pathManager.appPublicPath()
    let serverPath: string
    let serverEntry: string
    let envPath: string

    if (isProduction) {
      // production
      serverPath = path.join(process.resourcesPath, 'backend')
      serverEntry = path.join(serverPath, 'runnable')
      const options: Indexable = {
        env: {
          ...process.env,
          // IMPORTANT: 使用 spawn(process.execPath, ...) 启动子进程时，默认会运行一个新的 Electron 实例，导致应用重复打开。
          // 通过设置环境变量 ELECTRON_RUN_AS_NODE，可以让子进程以普通 Node.js 模式运行服务脚本，避免创建新窗口。
          ELECTRON_RUN_AS_NODE: '1',
          PORT: `${port}`,
          NODE_ENV: 'production',
          DB_DATABASE: dbPath,
          CACHE_ROOT: cachePath,
          PUBLIC_FILE_ROOT: publicPath,
          WEB_API_CORS_ALLOW_ORIGINS: '*',
        },
        cwd: serverPath,
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
      serverProcess = spawn(serverEntry, [], options)
      serverProcess.unref()
    } else {
      // development
      serverPath = path.join(currentDir, '../../../backend')
      serverEntry = path.join(serverPath, 'app/main.py')
      envPath = path.join(serverPath, '.env')
      console.log('serverPath',serverPath)
      serverProcess = spawn('python', [serverEntry], {
        env: {
          ...process.env,
          ENV_FILE: envPath,
          PORT: `${port}`,
          NODE_ENV: 'development',
          DB_DATABASE: dbPath,
          CACHE_ROOT: cachePath,
          PUBLIC_FILE_ROOT: publicPath,
          WEB_API_CORS_ALLOW_ORIGINS: process.env.APP_URL,
        },
        cwd: serverPath,
        stdio: 'pipe',
        shell: true
      })
    }

    serverProcess.stdout?.on('data', (data: string) => {
      console.log(`Server: ${data}`)
      log.info(`[Server] ${data.slice(22)}`)
    })

    serverProcess.stderr?.on('data', (data) => {
      log.error(`[Server Error] ${data}`)
    })

    serverProcess.on('error', (code) => {
      log.error(`[Server error with code] ${code}`)
      serverProcess = undefined
    })

    serverProcess.on('close', (code) => {
      log.info(`Server closed with code ${code}`)
      serverProcess = undefined
    })

    serverProcess.on('exit', (code) => {
      log.info(`Server exited with code ${code}`)
      serverProcess = undefined
    })

    serverInfo = {
      port: port,
      appBase: `http://localhost:${port}`,
      apiBase: `http://localhost:${port}/api/v1`,
      apiDocs: `http://localhost:${port}/docs`,
    }
    log.info('✅ Start server...', serverInfo)

    return serverInfo
  } catch (error) {
    log.error('❌ Start server failed:', error)
  }
}

/**
 * Stop the local server
 */
async function stopServer(event = 'NA') {
  if (!serverProcess) {
    log.info('⚠️ No server process to stop.', event)
    return
  }

  const pid = serverProcess.pid
  log.info(`⏹️ Stopping server process (pid: ${pid}) ...`, event)

  return new Promise<void>((resolve) => {
    if (serverProcess) {
      try {
        serverProcess.removeAllListeners()
        if (process.platform === 'win32' && pid) {
          spawn('taskkill', ['/pid', `${pid}`, '/f', '/t'])
          serverProcess.kill('SIGKILL')
        } else {
          serverProcess.kill('SIGTERM')
        }
      } catch (err) {
        log.error('❌ Failed to kill server process:', err)
        serverProcess = undefined
        resolve()
      }
    }
    setTimeout(() => {
      if (serverProcess) {
        log.warn('⚠️ Force clearing serverProcess after timeout.')
        serverProcess = undefined
      }
      resolve()
    }, 2000)
  })
}

async function restartServer() {
  log.info('🔄️ Restarting server process ...')
  await stopServer('restart')
  await startServer()
}

export {
  serverInfo,
  startServer,
  stopServer,
  restartServer,
}
