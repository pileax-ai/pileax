import { IpcService } from 'src/api/ipc/index'

const mock = (args?: any) => {
  return new Promise((resolve, reject) => {
    resolve(args);
  });
}

export class LocalIpc implements IpcService {
  public hi(message: string) {
    return mock(message);
  }

  public getServerInfo(): Promise<Indexable> {
    return new Promise((resolve, reject) => {
      resolve({} as Indexable);
    });
  }

  public isWindowMaximized(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }

  public maximizeWindow() {
    return mock();
  }

  public minimizeWindow() {
    return mock();
  }

  public migrateLibrary(options: Indexable) {
    return mock(options);
  }

  public reload(force: boolean) {
    return mock(force);
  }

  public setTheme(theme: 'system' | 'light' | 'dark') {
    return mock(theme);
  }

  public showDialog(options: Indexable) {
    return mock(options);
  }

  public updateTrayMenu(options: Indexable) {
    return mock(options);
  }
}
