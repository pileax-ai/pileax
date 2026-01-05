import { defineStore } from 'pinia'
import { CODE } from 'core/app'
import { api } from 'boot/axios'
import { ipcService } from 'src/api/ipc'

export const useApiStore = defineStore('api', {
  state: () => ({
    apiBase: window.APP_CONFIG?.API_BASE_URL || process.env.API_BASE_URL,
    timeout: (process.env.API_TIMEOUT || 60000) as number,
  }),
  actions: {
    async resetServer() {
      if (process.env.MODE === 'electron') {
        const serverInfo = await ipcService.getServerInfo()
        const apiBase = serverInfo.apiBase || process.env.API_BASE_URL
        this.setApiBase(apiBase)
      }
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
