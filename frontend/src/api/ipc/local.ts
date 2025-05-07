import { IpcService } from 'src/api/ipc/index'

export class LocalIpc implements IpcService {
  public async getServerInfo(): Promise<Indexable> {
    return new Promise((resolve, reject) => {
      window.electronAPI?.getServerInfo().then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      })
    });
  }

  public openNewWindow(id: string, url: string, titleBarHeight = 40) {
    return window.open(url, '_blank', 'noopener');
  }

  public minimizeWindow() {
    // window.electronAPI.minimizeWindow();
  }

  public maximizeWindow() {
    // window.electronAPI.maximizeWindow();
  }

  public closeWindow() {
    // window.electronAPI.closeWindow();
  }

  public async isWindowMaximized() {
    // return await window.electronAPI.isWindowMaximized();
    return false;
  }

  public setTheme(theme: 'system' | 'light' | 'dark') {
    // return window.electronAPI.setTheme(theme);
  }
}
