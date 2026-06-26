import type { IpcApi } from 'src/api/ipc'
import type { EbookApi } from 'src/api/service/ebook'

declare global {
  interface Window {
    electronIpcAPI: IpcApi;
    tauriIpcAPI: IpcApi;
    webIpcAPI: IpcApi;

    ebook: EbookApi;

    APP_CONFIG: {
      API_BASE_URL: string
      COLLAB: boolean
      COLLAB_PROVIDER_URL: string
    }
  }

}
export {}
