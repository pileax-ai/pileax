import { defineStore } from 'pinia';
import { CODE } from 'core/app';
import { api } from 'boot/axios';

export const useApiStore = defineStore('api', {
  state: () => ({
    baseURL: process.env.API_BASE_URL,
    timeout: (process.env.API_TIMEOUT || 60000) as number,
  }),
  actions: {
    setBaseURL(url: string) {
      this.baseURL = url;
      api.defaults.baseURL = url;
    },
    setTimeout(timeout: number) {
      this.timeout = timeout;
      api.defaults.timeout = timeout;
    }
  },
  persist: {
    key: `${CODE}.api`
  }
});
