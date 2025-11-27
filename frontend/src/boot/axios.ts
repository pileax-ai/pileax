import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { getCommonHeaders } from 'core/utils/common';
import useDialog from 'core/hooks/useDialog';
import { refreshToken, refreshTokenThrottle } from 'src/utils/auth'

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
const { openDialog } = useDialog();
const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 100000
});

// Request interceptors
// =========================================================
api.interceptors.request.use(
  (config) => {
    // Headers
    if (config.url && config.url.indexOf('http') < 0) {
      const headers = getCommonHeaders();
      config.headers = Object.assign(config.headers, headers);
    }

    // Auto refresh token
    if (!config.url?.includes('refresh-token')) {
      refreshTokenThrottle()
    }

    return config;
  },
  (error) => {
    console.log('Request error', error);
    return Promise.reject(error);
  }
)

// Response interceptors
// =========================================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const data = error.response?.data;
    const message = data?.message;
    const status = error.response?.status || data?.code;
    console.error('API Error:', error);

    if (status === 401) {
      if (originalRequest._retry) {
        // Guide to signin again
        openDialog({ type: 'signin' });
      } else {
        // Retry
        originalRequest._retry = true;

        try {
          const token = await refreshToken(true);
          const accessToken = (token as Indexable).access_token;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          openDialog({ type: 'signin' });
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
})

// Export
// =========================================================
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
