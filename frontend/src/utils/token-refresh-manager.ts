export class TokenRefreshManager {
  private isRefreshing: boolean = false
  private failedQueue: Array<{
    resolve: (value: any) => void
    reject: (error: any) => void
    config: any
  }> = []

  constructor(private api: any) {}

  private processQueue(error: any, authorization: string | null = null): void {
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

  addToFailedQueue(prom: any): void {
    this.failedQueue.push(prom)
  }

  /**
   * Process queue when token refresh succeed
   */
  onRefreshSuccess(authorization: string): void {
    this.api.defaults.headers.common['Authorization'] = authorization
    this.processQueue(null, authorization)
  }

  /**
   * Process queue when token refresh failed
   */
  onRefreshFailure(error: any): void {
    this.processQueue(error, null)
  }

  /**
   * Reset
   */
  reset(): void {
    this.isRefreshing = false
    this.failedQueue = []
  }
}
