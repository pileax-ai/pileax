import { defineStore } from 'pinia'
import { CODE } from 'core/app'
import { api } from 'boot/axios'
import { ipcService } from 'src/api/ipc'

export const useApiStore = defineStore('api', {
  state: () => ({
    appBase: process.env.APP_BASE_URL,
    apiBase: process.env.API_BASE_URL,
    timeout: (process.env.API_TIMEOUT || 60000) as number,
  }),
  actions: {
    async resetServer() {
      if (process.env.MODE === 'electron') {
        const serverInfo = await ipcService.getServerInfo()
        const apiBase = serverInfo.apiBase || process.env.API_BASE_URL
        const appBase = serverInfo.appBase || process.env.APP_BASE_URL
        this.setApiBase(apiBase)
        this.setAppBase(appBase)
      }
    },
    setAppBase(url: string) {
      this.appBase = url
    },
    setApiBase(url: string) {
      this.apiBase = url
      api.defaults.baseURL = url
    },
    setTimeout(timeout: number) {
      this.timeout = timeout
      api.defaults.timeout = timeout
    }
  },
  persist: {
    key: `${CODE}.api`
  }
})
