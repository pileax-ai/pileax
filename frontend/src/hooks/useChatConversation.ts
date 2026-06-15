import { computed, ref } from 'vue'
import type { ChatConversation } from 'src/types/chat'
import { chatConversationService } from 'src/api/service/remote/chat-conversation'
import type { MenuItem } from 'core/types/menu'
import { useChatStore } from 'stores/chat'
import { useNaviStore } from 'stores/navi'
import { useWorkspaceStore } from 'src/stores/workspace'

export default function () {
  const appId = ref('')
  const conversationId = ref('')
  const conversation = ref<ChatConversation>()
  const naviStore = useNaviStore()
  const workspaceStore = useWorkspaceStore()

  const chatStore = computed(() => {
    const currentWorkspaceId = workspaceStore.workspaceId
    return useChatStore(currentWorkspaceId)
  })

  const conversationTimer = computed(() => {
    return chatStore.value.conversationTimer
  })

  function setCurrentSession(s: ChatConversation) {
    const menuItem = {
      id: s.id,
      parentId: s.appId,
      name: s.name,
      path: `/a/chat/${s.appId}/${s.id}`,
      action: 1,
      meta: {
        type: 'chat-conversation',
        icon: '🍃',
        iconClass: 'emoji'
      }
    } as MenuItem
    naviStore.setCurrentMenu(menuItem)
  }

  async function getConversation() {
    return new Promise((resolve, reject) => {
      chatConversationService.get(conversationId.value).then(res => {
        conversation.value = res
        setCurrentSession(res)

        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  return {
    chatStore,
    appId,
    conversation,
    conversationId,
    conversationTimer,
    getConversation,
  }
}
