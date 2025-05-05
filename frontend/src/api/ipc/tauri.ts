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

  public openNewWindow(id: string, url: string, titleBarHeight = 40) {
    return window.electronAPI.openNewWindow(id, url);
  }

  public minimizeWindow() {
    window.electronAPI.minimizeWindow();
  }

  public maximizeWindow() {
    window.electronAPI.maximizeWindow();
  }

  public closeWindow() {
    window.electronAPI.closeWindow();
  }

  public async isWindowMaximized() {
    return await window.electronAPI.isWindowMaximized();
  }

  public setTheme(theme: 'system' | 'light' | 'dark') {
    return window.electronAPI.setTheme(theme);
  }
}
