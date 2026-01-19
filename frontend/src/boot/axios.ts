import { boot } from 'quasar/wrappers'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { getCommonHeaders } from 'core/utils/common'
import useDialog from 'core/hooks/useDialog'
import { isTokenNeedRefresh, refreshToken } from 'src/utils/auth'
import { getErrorMessage } from 'src/utils/request'
import { notifyWarning } from 'core/utils/control'
import { TokenRefreshManager } from 'src/utils/token-refresh-manager'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const { openDialog } = useDialog()
const api = axios.create({
  baseURL: window.APP_CONFIG?.API_BASE_URL || process.env.API_BASE_URL,
  timeout: 100000
})

// Request interceptors
// =========================================================
api.interceptors.request.use(
  (config: any) => {
    // Headers
    if (config.url && config.url.indexOf('http') < 0) {
      const headers = getCommonHeaders()
      config.headers = Object.assign(config.headers, headers)
    }

    // refresh-token request
    if (config.url?.includes('refresh-token')) {
      return config
    }

    // Add requests to waiting queue when pre refreshing
    if (tokenRefreshManager.getIsPreRefreshing()) {
      return new Promise((resolve, reject) => {
        tokenRefreshManager.addToWaitingQueue({
          resolve, reject, config
        })
      })
    }

    // Pre refresh token
    if (isTokenNeedRefresh()) {
      tokenRefreshManager.setIsPreRefreshing(true)
      const requestPromise = new Promise((resolve, reject) => {
        tokenRefreshManager.addToWaitingQueue({
          resolve, reject, config
        })
      })
      tokenRefreshManager.preRefresh()

      return requestPromise
    }

    return config
  },
  (error) => {
    console.log('Request error', error)
    return Promise.reject(error)
  }
)

// Response interceptors
// =========================================================
const tokenRefreshManager = new TokenRefreshManager(api)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const data = error.response?.data
    const message = getErrorMessage(error)
    const status = error.response?.status || data?.code
    // console.error('API Error:', error)

    if (status === 401) {
      if (originalRequest._retry || originalRequest.url === '/auth/refresh-token') {
        // Guide to signin again
        openDialog({ type: 'signin' })
        return Promise.reject(error)
      }

      // console.log('isRefreshing', tokenRefreshManager.getIsRefreshing())
      if (tokenRefreshManager.getIsRefreshing()){
        return new Promise((resolve, reject) => {
          tokenRefreshManager.addToFailedQueue({
            resolve, reject, config: originalRequest
          })
        })
      }

      // Start retrying
      tokenRefreshManager.setIsRefreshing(true)
      originalRequest._retry = true

      try {
        const token = await refreshToken()
        const authorization = `${token.tokenType} ${token.accessToken}`

        // Success
        tokenRefreshManager.onRefreshSuccess(authorization)

        // Retry current request
        originalRequest.headers.Authorization = authorization
        return api(originalRequest)
      } catch (refreshError) {
        // Failed
        tokenRefreshManager.onRefreshFailure(refreshError)
        openDialog({ type: 'signin' })
        return Promise.reject(refreshError)
      } finally {
        tokenRefreshManager.setIsRefreshing(false)
      }
    } else if (status === 500) {
      notifyWarning(message)
    }

    return Promise.reject(error)
})

// Export
// =========================================================
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
