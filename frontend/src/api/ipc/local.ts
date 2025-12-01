import { IpcApi, IpcService, ipcServiceKeys } from 'src/api/ipc/index'

const mock = (args?: any) => {
  return new Promise((resolve, reject) => {
    resolve(args);
  });
}

export class LocalIpc implements IpcService {
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

  constructor() {
    this.hi = mock as any;
    this.getServerInfo = mock as any;
    this.isWindowMaximized = mock as any;
    this.maximizeWindow = mock as any;
    this.minimizeWindow = mock as any;
    this.migrateLibrary = mock as any;
    this.reload = mock as any;
    this.setTheme = mock as any;
    this.showDialog = mock as any;
    this.updateTrayMenu = mock as any;
  }
}
