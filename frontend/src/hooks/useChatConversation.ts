import { computed, ref } from 'vue';
import { ChatInput, ChatConversation } from 'src/types/chat'
import { chatConversationService } from 'src/api/service/remote/chat-conversation';
import { MenuItem } from 'core/types/menu';
import { useAccountStore } from 'stores/account';
import { useChatStore } from 'stores/chat';
import { useNaviStore } from 'stores/navi';
import { useNoteStore } from 'stores/note'

export default function () {
  const appId = ref('')
  const conversationId = ref('')
  const conversation = ref<ChatConversation>();
  const naviStore = useNaviStore();
  const accountStore = useAccountStore();

  const chatStore = computed(() => {
    const currentTenantId = accountStore.workspaceId;
    return useChatStore(currentTenantId);
  })

  const conversationTimer = computed(() => {
    return chatStore.value.conversationTimer;
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
    } as MenuItem;
    naviStore.setCurrentMenu(menuItem);
  }
  async function getConversation() {
    chatConversationService.get(conversationId.value).then(res => {
      conversation.value = res;
      setCurrentSession(res);
    })
  }

  return {
    chatStore,
    appId,
    conversation,
    conversationId,
    conversationTimer,
    getConversation,
  };
}
