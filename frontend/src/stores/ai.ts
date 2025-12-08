import { CODE } from 'core/app';
import { pdmService } from 'src/api/service/remote'
import { defineWorkspaceStore } from 'core/workspace/workspace-store-factory'

export const useAiStore = defineWorkspaceStore('ai', {
  state: () => ({
    provider: {} as Indexable,
    localModels: {} as Indexable,
    defaultModels: [] as Indexable[],
  }),
  actions: {
    setProvider(value: Indexable) {
      this.provider = value;
    },
    setLocalModel(type: string, value: Indexable) {
      this.localModels[type] = value;
    },
    getLocalModel(type: string) {
      return this.localModels[type];
    },
    getDefaultModels() {
      pdmService.getAll().then(res => {
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
