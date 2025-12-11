import { CODE } from 'core/app';
import type { ChatInput } from 'src/types/chat';
import { defineWorkspaceStore } from 'core/workspace/workspace-store-factory';

export const useChatStore = defineWorkspaceStore('chat', {
  state: () => ({
    chatMap: new Map<string, ChatInput>(),
    conversationTimer: 0
  }),
  actions: {
    addChat(value: ChatInput) {
      console.log('addChat', value, this.chatMap)
      this.chatMap.set(value.id, value);
    },
    getChat(id: string) {
      return this.chatMap.get(id);
    },
    removeChat(id: string) {
      this.chatMap.delete(id);
    },
    setSessionTimer(value: number) {
      this.conversationTimer = value;
    },
  },
  persist: {
    key: `${CODE}.chat`,
    storage: sessionStorage,
    serializer: {
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          chatMap: Array.from(state.chatMap.entries())
        })
      },
      deserialize: (value) => {
        const obj = JSON.parse(value)
        return {
          ...obj,
          chatMap: new Map(obj.chatMap)
        }
      }
    }
  }
});
