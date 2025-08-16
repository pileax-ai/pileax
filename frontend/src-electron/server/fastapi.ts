import { ChildProcess, spawn } from 'child_process';
import getPort from 'get-port';
import log from 'electron-log';
import path from 'path';
import { fileURLToPath } from 'node:url';
import os from 'os';
import { appDbPath, appPublicRootPath } from '../utils/path'

const currentDir = fileURLToPath(new URL('.', import.meta.url));
const platform = process.platform || os.platform();
let serverProcess: ChildProcess | undefined;

/**
 * Start a local server
 */
async function startServer() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const port = await getPort({ port: 3000 });
    const dbPath = appDbPath();
    const publicPath = appPublicRootPath();
    let serverPath: string;
    let serverEntry: string;
    let envPath: string;

    if (isProduction) {
      // production
      serverPath = path.join(process.resourcesPath, 'backend');
      serverEntry = path.join(serverPath, 'runnable');
      const options: Indexable = {
        env: {
          ...process.env,
          // IMPORTANT: 使用 spawn(process.execPath, ...) 启动子进程时，默认会运行一个新的 Electron 实例，导致应用重复打开。
          // 通过设置环境变量 ELECTRON_RUN_AS_NODE，可以让子进程以普通 Node.js 模式运行服务脚本，避免创建新窗口。
          ELECTRON_RUN_AS_NODE: '1',
          PORT: `${port}`,
          NODE_ENV: 'production',
          DATABASE_URL: `/${dbPath}`,
          SERVER_ROOT: serverPath,
          PUBLIC_ROOT: publicPath,
        },
        cwd: serverPath,
        stdio: 'pipe',
        shell: true,
        detached: true,
        windowsHide: true
      };
      if (platform === 'win32') {
        options.windowsVerbatimArguments = true;
        options.shell = true;
      }
      serverProcess = spawn(serverEntry, [], options);
      serverProcess.unref();
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
          DATABASE_URL: `/${dbPath}`,
          SERVER_ROOT: serverPath,
          PUBLIC_ROOT: publicPath,
        },
        cwd: serverPath,
        stdio: 'pipe',
        shell: true
      })
    }

    serverProcess.stdout?.on('data', (data) => {
      console.log(`Server: ${data}`)
      log.info(`Server: ${data}`)
    })

    serverProcess.stderr?.on('data', (data) => {
      log.error(`Server Error: ${data}`)
    })

    serverProcess.on('error', (code) => {
      log.error(`Server error with code ${code}`);
      serverProcess = undefined;
    })

    serverProcess.on('exit', (code) => {
      log.info(`Server exited with code ${code}`);
      serverProcess = undefined;
    })

    const serverInfo = {
      port: port,
      appBase: `http://localhost:${port}`,
      apiBase: `http://localhost:${port}/api/v1`,
      apiDocs: `http://localhost:${port}/docs`,
    };
    log.info('✅ Start server...', serverInfo);

    return serverInfo
  } catch (error) {
    log.error('❌ Start server failed:', error);
  }
}

/**
 * Stop the local server
 */
function stopServer(event = 'NA') {
  log.info('⏹️ Stop server process...', event);
  if (serverProcess) {
    if (process.platform === 'win32') {
      const pid = serverProcess.pid;
      if (pid) {
        spawn('taskkill', ['/pid', `${pid}`, '/f', '/t']);
      }
      serverProcess.kill('SIGKILL');
    } else {
      serverProcess.kill('SIGTERM');
    }
  }
}

export {
  startServer,
  stopServer,
}
