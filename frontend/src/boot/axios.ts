import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { getCommonHeaders } from 'core/utils/common';
import useDialog from 'core/hooks/useDialog';

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
  (error) => {
    const data = error.response?.data
    console.error('API Error:', data || error.message);
    if (data?.code === 401 && data?.msg === 'Could not validate credentials') {
      openDialog({
        type: 'signin'
      })
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
