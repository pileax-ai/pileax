import { defineStore } from 'pinia'
import { store } from 'stores/index'
import { CODE } from 'core/app'
import { ChatInput } from 'src/types/chat'

export const useKnowledgeStore = defineStore('knowledge', {
  state: () => ({
    queryTimer: 0
  }),
  actions: {
    setQueryTimer(value: number) {
      this.queryTimer = value
    },
  },
  persist: {
    key: `${CODE}.knowledge`,
    storage: sessionStorage,
  }
})

export const useNoteStoreWithOut = () => {
  return useKnowledgeStore(store)
}
