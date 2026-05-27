import { defineStore } from 'pinia'
import { store } from 'stores/index'
import { CODE } from 'core/app'

export const useReadingStore = defineStore('reading', {
  state: () => ({
    library: {
      view: 'grid',
      orderBy: 'recentRead',
    } as Indexable,
    collection: {
      view: 'grid',
      orderBy: 'recentRead',
    } as Indexable,
  }),
  getters: {
  },
  actions: {
    setLibraryItem(key: string, value: any) {
      this.library[key] = value
    },
    setCollectionItem(key: string, value: any) {
      this.collection[key] = value
    },
  },
  persist: {
    key: `${CODE}.reading`
  }
})

export const useReadingStoreWithOut = () => {
  return useReadingStore(store)
}
