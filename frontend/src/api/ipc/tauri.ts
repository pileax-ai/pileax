import type { IpcService} from 'src/api/ipc/index'
import { ipcServiceKeys } from 'src/api/ipc/index'

export const createTauriIpc = (): IpcService => {
  const api = window.tauriIpcAPI

  const handler: ProxyHandler<any> = {
    get: (_, prop: string) => {
      if (ipcServiceKeys.includes(prop as any)) {
        const fn = api[prop as keyof typeof api]
        return typeof fn === "function" ? fn.bind(api) : fn
      }
      throw new Error(`IPC method ${prop} not found`)
    }
  }

  return new Proxy({}, handler) as IpcService
}

export const tauriIpc = createTauriIpc()
