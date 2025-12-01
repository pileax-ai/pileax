import { ElectronIpc } from 'src/api/ipc/electron';
import { LocalIpc } from 'src/api/ipc/local';
import { TauriIpc } from 'src/api/ipc/tauri';

export interface IpcService {
  hi: (message: string) => void;
  // closeWindow: () => Promise<any>;
  // dbExecute: (entity: string, method: string, params: any) => Promise<any>;
  // getPath: (key: string) => Promise<string>;
  getServerInfo: () => Promise<Indexable>;
  isWindowMaximized: () => Promise<boolean>;
  maximizeWindow: () => Promise<any>;
  minimizeWindow: () => Promise<any>;
  migrateLibrary: (options: any) => Promise<any>;
  // openNewWindow: (id: string, url: string, titleBarHeight: number) => Promise<any>;
  // readBookCover: (filePath: string) => Promise<any>;
  // readBookFile: (filePath: string) => Promise<any>;
  // readFile: (filePath: string) => Promise<any>;
  // readImage: (filePath: string) => Promise<any>;
  reload: (force: boolean) => Promise<any>;
  // saveBookFiles: (metadata: any) => Promise<any>;
  // saveImageFile: (metadata: any) => Promise<any>;
  setTheme: (theme: 'system' | 'light' | 'dark') => Promise<any>;
  showDialog: (options: Indexable) => Promise<any>;
  // showSaveDialog: (options: Indexable) => Promise<any>;
  updateTrayMenu: (options: any) => Promise<any>;
}

function ipcMethod(instance: any, method: string, ...args: any[]) {
  if (typeof instance[method] === "function") {
    return instance[method](...args);
  }
  throw new Error(`Method "${method}" not found`);
}

let ipcService: IpcService;
if (process.env.MODE === 'electron') {
  ipcService = new ElectronIpc();
} else if (window.__TAURI_INTERNALS__) {
  ipcService = new TauriIpc();
} else {
  ipcService = new LocalIpc();
}

export { ipcService, ipcMethod }
