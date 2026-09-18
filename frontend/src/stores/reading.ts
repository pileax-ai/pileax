import { defineStore } from 'pinia'
import { store } from 'stores/index'
import { CODE } from 'core/app'

export const useReadingStore = defineStore('reading', {
  state: () => ({
    library: {
      grouped: true,

      // sort
      view: 'grid',
      orderBy: 'recentRead',
      orderDesc: true,

      // filter
      title: '',
      extension: '',
      readingStatus: '',
    } as Indexable,
    bookUploading: false,
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
    setBookUploading(value: boolean) {
      this.bookUploading = value
    }
  },
  persist: {
    key: `${CODE}.reading`
  }
})

export const useReadingStoreWithOut = () => {
  return useReadingStore(store)
}
