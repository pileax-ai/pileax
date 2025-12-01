import { IpcService } from 'src/api/ipc/index'

export class TauriIpc implements IpcService {
  public hi(message: string) {
    return window.electronAPI.hi(message);
  }

  public getServerInfo() {
    return window.electronAPI.getServerInfo();
  }

  public isWindowMaximized() {
    return window.electronAPI.isWindowMaximized();
  }

  public maximizeWindow() {
    return window.electronAPI.maximizeWindow();
  }

  public minimizeWindow() {
    return window.electronAPI.minimizeWindow();
  }

  public migrateLibrary(options: Indexable) {
    return window.electronAPI.migrateLibrary(options);
  }

  public reload(force: boolean) {
    return window.electronAPI.reload(force);
  }

  public setTheme(theme: 'system' | 'light' | 'dark') {
    return window.electronAPI.setTheme(theme);
  }

  public showDialog(options: Indexable) {
    return window.electronAPI.showDialog(options);
  }

  public updateTrayMenu(options: Indexable) {
    return window.electronAPI.updateTrayMenu(options);
  }
}
