import { ElectronIpc } from 'src/api/ipc/electron';
import { LocalIpc } from 'src/api/ipc/local';
import { TauriIpc } from 'src/api/ipc/tauri';

export type IpcApi = {
  hi: (message: string) => void;
  closeWindow: () => Promise<any>;
  getPath: (key: string) => Promise<string>;
  getServerInfo: () => Promise<Indexable>;
  isWindowMaximized: () => Promise<boolean>;
  maximizeWindow: () => Promise<any>;
  minimizeWindow: () => Promise<any>;
  migrateLibrary: (options: any) => Promise<any>;
  openNewWindow: (id: string, url: string, titleBarHeight: number) => Promise<any>;
  reload: (force: boolean) => Promise<any>;
  saveImageFile: (metadata: any) => Promise<any>;
  setTheme: (theme: 'system' | 'light' | 'dark') => Promise<any>;
  showDialog: (options: Indexable) => Promise<any>;
  updateTrayMenu: (options: any) => Promise<any>;
}

export const ipcServiceKeys = [
  'hi',
  'closeWindow',
  'getPath',
  'getServerInfo',
  'isWindowMaximized',
  'maximizeWindow',
  'minimizeWindow',
  'migrateLibrary',
  'openNewWindow',
  'reload',
  'saveImageFile',
  'setTheme',
  'showDialog',
  'updateTrayMenu',
] as const;

export type IpcService = Pick<IpcApi, typeof ipcServiceKeys[number]>;

export const ipcMethod = <K extends keyof IpcService>(
  instance: IpcService,
  method: K,
  ...args: IpcService[K] extends (...a: any) => any ? Parameters<IpcService[K]> : never
): IpcService[K] extends (...a: any) => any ? ReturnType<IpcService[K]> : never => {
  const fn = instance[method];
  if (typeof fn === "function") {
    return (fn as (...args: any[]) => any)(...args);
  }
  throw new Error(`Method "${method}" not found`);
};

export const createIpcService = (): { ipcProvider: 'electron' | 'tauri' | 'local', ipcService: IpcService } => {
  if (process.env.MODE === 'electron') {
    return {
      ipcProvider: 'electron',
      ipcService: new ElectronIpc()
    };
  } else if (window.__TAURI_INTERNALS__) {
    return {
      ipcProvider: 'tauri',
      ipcService: new TauriIpc()
    };
  } else {
    return {
      ipcProvider: 'local',
      ipcService: new LocalIpc()
    };
  }
}

export const { ipcProvider, ipcService } = createIpcService();
