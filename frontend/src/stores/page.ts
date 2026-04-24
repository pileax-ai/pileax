import { defineStore } from 'pinia'
import { store } from 'stores/index'
import { CODE } from 'core/app'

export const usePageStore = defineStore('page', {
  state: ()=> ({
    status: 200,
    data: {}
  }),
  actions: {
    setPageStatus(value: number, data?: Indexable) {
      this.status = value
      this.data = data ?? {}
    },
    resetPageStatus() {
      this.status = 200
      this.data = {}
    }
  },
  persist: {
    key: `${CODE}.page`
  }
})

export const usePageStoreWithOut = () => {
  return usePageStore(store)
}
