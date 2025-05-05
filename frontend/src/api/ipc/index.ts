import { ElectronIpc } from 'src/api/ipc/electron';
import { LocalIpc } from 'src/api/ipc/local';
import { TauriIpc } from 'src/api/ipc/tauri';

export interface IpcService {
  getServerInfo(): Promise<Indexable>;
  openNewWindow(id: string, url: string): void;
  setTheme(theme: 'system' | 'light' | 'dark'): void;
}

let ipcService: IpcService;
if (process.env.MODE === 'electron') {
  ipcService = new ElectronIpc();
} else if (window.__TAURI_INTERNALS__) {
  ipcService = new TauriIpc();
} else {
  ipcService = new LocalIpc();
}

export { ipcService }
