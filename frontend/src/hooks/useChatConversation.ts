import { computed, ref } from 'vue';
import { ChatInput, ChatConversation } from 'src/types/chat'
import { chatConversationService } from 'src/service/remote/chat-conversation';
import { MenuItem } from 'core/types/menu';
import { useChatStore } from 'stores/chat';
import { useNaviStore } from 'stores/navi';

export default function () {
  const appId = ref('')
  const conversationId = ref('')
  const conversation = ref<ChatConversation>();
  const chatStore = useChatStore();
  const naviStore = useNaviStore();

  const conversationTimer = computed(() => {
    return chatStore.conversationTimer;
  })

  const currentChat = computed(() => {
    return chatStore.currentChat;
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
  function setCurrentChat(value?: ChatInput) {
    chatStore.setCurrentChat(value);
  }

  return {
    chatStore,
    appId,
    conversation,
    conversationId,
    conversationTimer,
    currentChat,
    getConversation,
    setCurrentChat,
  };
}
