import { refreshToken } from 'src/utils/auth'

export class TokenRefreshManager {
  private isPreRefreshing: boolean = false
  private waitingQueue: Array<{
    resolve: (value: any) => void
    reject: (error: any) => void
    config: any
  }> = []

  private isRefreshing: boolean = false
  private failedQueue: Array<{
    resolve: (value: any) => void
    reject: (error: any) => void
    config: any
  }> = []

  constructor(private api: any) {}

  // --------------------------------------------------------------------------------
  // Refresh: pre-refresh
  // --------------------------------------------------------------------------------
  private processWaitingQueue(error: any, authorization: string | null = null): void {
    // console.log('processWaitingQueue', error, authorization, this.waitingQueue)
    this.waitingQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.config.headers.Authorization = authorization
        prom.resolve(prom.config)
      }
    })

    this.waitingQueue = []
  }

  getIsPreRefreshing(): boolean {
    return this.isPreRefreshing
  }

  setIsPreRefreshing(value: boolean): void {
    this.isPreRefreshing = value
  }

  preRefresh(): void {
    refreshToken('pre-refresh')
      .then((res) => {
        this.isPreRefreshing = false
        const authorization = `${res.tokenType} ${res.accessToken}`
        this.processWaitingQueue(null, authorization)
        return authorization
      })
      .catch((error) => {
        this.isPreRefreshing = false
        this.processWaitingQueue(error)
      })
      .finally(() => {
      })
  }

  // --------------------------------------------------------------------------------
  // Refresh: retry failed (401) reqeust
  // --------------------------------------------------------------------------------

  private processFailedQueue(error: any, authorization: string | null = null): void {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.config.headers.Authorization = authorization
        prom.resolve(this.api(prom.config))
      }
    })

    this.failedQueue = []
  }

  getIsRefreshing(): boolean {
    return this.isRefreshing
  }

  setIsRefreshing(value: boolean): void {
    this.isRefreshing = value
  }

  addToWaitingQueue(prom: any): void {
    this.waitingQueue.push(prom)
  }

  addToFailedQueue(prom: any): void {
    this.failedQueue.push(prom)
  }

  /**
   * Process queue when token refresh succeed
   */
  onRefreshSuccess(authorization: string): void {
    this.api.defaults.headers.common['Authorization'] = authorization
    this.processFailedQueue(null, authorization)
  }

  /**
   * Process queue when token refresh failed
   */
  onRefreshFailure(error: any): void {
    this.processFailedQueue(error, null)
  }

  /**
   * Reset
   */
  reset(): void {
    this.isPreRefreshing = false
    this.isRefreshing = false
    this.waitingQueue = []
    this.failedQueue = []
  }
}
