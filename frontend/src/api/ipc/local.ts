import { IpcService, ipcServiceKeys } from 'src/api/ipc/index'

const mock = (args?: any) => {
  return new Promise((resolve, reject) => {
    resolve(args);
  });
}

window.localIpcAPI = {
  hi: mock as any,
  closeWindow: mock as any,
  getPath: mock as any,
  getServerInfo: mock as any,
  isWindowMaximized: mock as any,
  maximizeWindow: mock as any,
  migrateLibrary: mock as any,
  minimizeWindow: mock as any,
  openNewWindow: mock as any,
  reload: mock as any,
  saveImageFile: mock as any,
  setTheme: mock as any,
  showDialog: mock as any,
  updateTrayMenu: mock as any
}

export const createLocalIpc = (): IpcService => {
  const api = window.localIpcAPI;

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

export const localIpc = createLocalIpc();
