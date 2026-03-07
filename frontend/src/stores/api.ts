import { defineStore } from 'pinia'
import { CODE } from 'core/app'
import { parseBool } from 'core/utils/format'
import { api } from 'boot/axios'
import { ipcProvider, ipcService } from 'src/api/ipc'
import { systemService } from 'src/api/service/remote'

let healthCheckTimer: ReturnType<typeof setTimeout> | null = null
let retryCount = 0

export const useApiStore = defineStore('api', {
  state: () => ({
    appMode: 'cloud',
    apiBase: window.APP_CONFIG?.API_BASE_URL || process.env.API_BASE_URL,
    apiTimeout: (process.env.API_TIMEOUT || 60000) as number,
    collab: parseBool(window.APP_CONFIG?.COLLAB) || parseBool(process.env.COLLAB),
    collabProvider: window.APP_CONFIG?.COLLAB_PROVIDER_URL
      || process.env.COLLAB_PROVIDER_URL
      || 'ws://localhost:9611',
    connected: false,
  }),
  actions: {
    async resetServer() {
      if (ipcProvider === 'web') {
        this.setAppMode('cloud')
      } else {
        const appMode = await ipcService.getAppMode()
        if (appMode === 'standalone') {
          const serverInfo = await ipcService.getServerInfo()
          const apiBase = serverInfo.apiBase || process.env.API_BASE_URL
          this.setApiBase(apiBase)
        }
        this.setAppMode(appMode)
      }

      api.defaults.baseURL = this.apiBase
      api.defaults.timeout = this.apiTimeout
    },
    setAppMode(mode: string) {
      this.appMode = mode
    },
    setApiBase(url: string) {
      this.apiBase = url
      api.defaults.baseURL = url
    },
    setTimeout(timeout: number) {
      this.apiTimeout = timeout
      api.defaults.timeout = timeout
    },
    setCollab(collab: boolean) {
      this.collab = collab
    },
    setCollabProvider(url: string) {
      this.collabProvider = url
    },
    async startCheckConnectivity() {
      let interval = 20000
      // Clear any existing timer to prevent overlapping loops
      this.stopCheckConnectivity()

      try {
        await systemService.healthCheck()
        retryCount = 0
        this.connected = true
      } catch (e) {
        this.connected = false

        // retry every 3 seconds
        if (retryCount < 10) {
          retryCount++
          interval = 3000
        }
      } finally {
        healthCheckTimer = setTimeout(() => {
          this.startCheckConnectivity()
        }, interval)
      }
    },
    stopCheckConnectivity() {
      if (healthCheckTimer) {
        clearTimeout(healthCheckTimer)
        healthCheckTimer = null
      }
    }
  },
  persist: {
    key: `${CODE}.api`
  }
})
