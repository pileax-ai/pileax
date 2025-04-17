import { defineStore } from 'pinia';
import { CODE } from 'core/app';

export const useAiStore = defineStore('ai', {
  state: () => ({
    provider: {} as Indexable,
  }),
  actions: {
    setProvider(value: Indexable) {
      this.provider = value;
    },
  },
  persist: {
    key: `${CODE}.ai`
  }
});
