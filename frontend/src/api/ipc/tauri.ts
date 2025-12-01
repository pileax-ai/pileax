import { IpcApi, IpcService, ipcServiceKeys } from 'src/api/ipc/index'

export class TauriIpc implements IpcService {
  hi!: IpcApi['hi'];
  getServerInfo!: IpcApi['getServerInfo'];
  isWindowMaximized!: IpcApi['isWindowMaximized'];
  maximizeWindow!: IpcApi['maximizeWindow'];
  minimizeWindow!: IpcApi['minimizeWindow'];
  migrateLibrary!: IpcApi['migrateLibrary'];
  reload!: IpcApi['reload'];
  setTheme!: IpcApi['setTheme'];
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
}
