import { IpcService } from 'src/api/ipc/index'

export class TauriIpc implements IpcService {
  public async getServerInfo(): Promise<Indexable> {
    return new Promise((resolve, reject) => {
      window.electronAPI?.getServerInfo().then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      })
    });
  }

  public openNewWindow(id: string, url: string) {
    return window.electronAPI.openNewWindow(id, url);
  }

  public setTheme(theme: 'system' | 'light' | 'dark') {
    return window.electronAPI.setTheme(theme);
  }
}
