import { computed, ref } from 'vue';
import { ChatInput, ChatSession } from 'src/types/chat'
import { chatSessionService } from 'src/service/remote/chat-session';
import { MenuItem } from 'core/types/menu';
import { useChatStore } from 'stores/chat';
import { useNaviStore } from 'stores/navi';

export default function () {
  const sessionId = ref('')
  const session = ref<ChatSession>();
  const chatStore = useChatStore();
  const naviStore = useNaviStore();

  const sessionTimer = computed(() => {
    return chatStore.sessionTimer;
  })

  const currentChat = computed(() => {
    return chatStore.currentChat;
  })

  function setCurrentSession(s: ChatSession) {
    const menuItem = {
      id: s.id,
      parentId: s.assistant,
      name: s.title,
      path: `/a/chat/${s.assistant}/${s.id}`,
      action: 1,
      meta: {
        type: 'chat-session',
        icon: '🍃',
        iconClass: 'emoji'
      }
    } as MenuItem;
    naviStore.setCurrentMenu(menuItem);
  }
  async function getSession() {
    chatSessionService.get(sessionId.value).then(res => {
      session.value = res;
      setCurrentSession(res);
    })
  }
  function setCurrentChat(value?: ChatInput) {
    chatStore.setCurrentChat(value);
  }

  return {
    chatStore,
    session,
    sessionId,
    sessionTimer,
    currentChat,
    getSession,
    setCurrentChat,
  };
}
