import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { ChatInput } from 'src/types/chat';

export const useChatStore = defineStore('chat', {
  state: () => ({
    currentChat: undefined as undefined | ChatInput,
    conversationTimer: 0
  }),
  actions: {
    setCurrentChat(value?: ChatInput) {
      this.currentChat = value;
    },
    setSessionTimer(value: number) {
      this.conversationTimer = value;
    },
  },
  persist: {
    key: `${CODE}.chat`,
    storage: sessionStorage,
  }
});

export const useNoteStoreWithOut = () => {
  return useChatStore(store);
}
