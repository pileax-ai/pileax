class ElectronIpc {
  public async getServerInfo(): Promise<Indexable> {
    return new Promise((resolve, reject) => {
      window.electronAPI?.getServerInfo().then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      })
    });
  }

  public async removeBook(id: string) {
    return new Promise((resolve, reject) => {
      window.electronAPI?.dbExecute('Book', 'removeBookAndFiles', id).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      })
    });
  }
}

export const electronIpc = new ElectronIpc();
