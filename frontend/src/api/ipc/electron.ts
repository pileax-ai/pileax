import { IpcService } from 'src/api/ipc/index'

export class ElectronIpc implements IpcService {
  public hi(message: string) {
    return window.electronAPI.hi(message);
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

  public getServerInfo() {
    return window.electronAPI.getServerInfo();
  }

  public showDialog(options: Indexable) {
    return window.electronAPI.showDialog(options);
  }

  public setTheme(theme: 'system' | 'light' | 'dark') {
    return window.electronAPI.setTheme(theme);
  }

  public updateTrayMenu(options: Indexable) {
    return window.electronAPI.updateTrayMenu(options);
  }
}
