import { defineStore } from 'pinia';
import { CODE } from 'core/app';
import { tdmService } from 'src/service/remote'

export const useAiStore = defineStore('ai', {
  state: () => ({
    provider: {} as Indexable,
    defaultModels: [] as Indexable[],
  }),
  actions: {
    setProvider(value: Indexable) {
      this.provider = value;
    },
    getDefaultModels() {
      tdmService.findAll().then(res => {
        this.defaultModels = res
      })
    },
    updateLocalDefaultModels(item: Indexable) {
      const idx = this.defaultModels.findIndex(m => m.id === item.id)
      if (idx >= 0) {
        this.defaultModels.splice(idx, 1, item)
      } else {
        this.defaultModels.push(item)
      }
    }
  },
  persist: {
    key: `${CODE}.ai`
  }
});
