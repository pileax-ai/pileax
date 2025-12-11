import type { IpcService} from 'src/api/ipc/index';
import { IpcApi, ipcServiceKeys } from 'src/api/ipc/index'

/**
 * Solution 1: Class
 */
/*
export class ElectronIpc implements IpcService {
  hi!: IpcApi['hi'];
  closeWindow!: IpcApi['closeWindow'];
  getPath!: IpcApi['getPath'];
  getServerInfo!: IpcApi['getServerInfo'];
  isWindowMaximized!: IpcApi['isWindowMaximized'];
  maximizeWindow!: IpcApi['maximizeWindow'];
  minimizeWindow!: IpcApi['minimizeWindow'];
  migrateLibrary!: IpcApi['migrateLibrary'];
  openNewWindow!: IpcApi['openNewWindow'];
  reload!: IpcApi['reload'];
  setTheme!: IpcApi['setTheme'];
  saveImageFile!: IpcApi['saveImageFile'];
  showDialog!: IpcApi['showDialog'];
  updateTrayMenu!: IpcApi['updateTrayMenu'];

  private api = window.electronAPI;

  constructor() {
    for (const key of ipcServiceKeys) {
      const fn = this.api[key];
      (this as any)[key] = typeof fn === "function"
        ? fn.bind(this.api)
        : fn;
    }
  }
}*/

/**
 * Solution 2: Factory
 */
export const createElectronIpc = (): IpcService => {
  const api = window.electronIpcAPI;

  const handler: ProxyHandler<any> = {
    get: (_, prop: string) => {
      if (ipcServiceKeys.includes(prop as any)) {
        const fn = api[prop as keyof typeof api];
        return typeof fn === "function" ? fn.bind(api) : fn;
      }
      throw new Error(`IPC method ${prop} not found`);
    }
  };

  return new Proxy({}, handler) as IpcService;
}

export const electronIpc = createElectronIpc();
