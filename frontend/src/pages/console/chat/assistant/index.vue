<template>
  <o-split-page ref="pageRef"
                class="page-assistant-chat">
    <template #horizontal-side>
      <o-assistant-chat enable-upload @expand="pageRef?.expandHorizontalSide" />
    </template>
  </o-split-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, onActivated } from 'vue';
import { useRoute } from 'vue-router';
import OChatInput from 'components/chat/OChatInput.vue';
import OChatMessage from 'components/chat/OChatMessage.vue';
import OChatToc from 'components/chat/OChatToc.vue';
import ChatActions from 'components/chat/ChatActions.vue';

import { router } from 'src/router';
import { chatService } from 'src/service/remote/chat';
import { chatSessionService } from 'src/service/remote/chat-session';
import { UUID } from 'core/utils/crypto';
import useAi from 'src/hooks/useAi';
import useStream from 'src/hooks/useStream';
import useChatSession from 'src/hooks/useChatSession';
import { ChatInput } from 'src/types/chat'
import OAssistantChat from 'components/chat/OAssistantChat.vue'
import OSplitPage from 'core/page/template/OSplitPage.vue'

const route = useRoute();
const { provider } = useAi();
const {
  session,
  sessionId,
  currentChat,
  chatStore,
  getSession,
} = useChatSession();
const { isLoading, startStream, cancelStream } = useStream();

const pageRef = ref<InstanceType<typeof OSplitPage>>();
const start = ref(true);
const chats = ref<Indexable[]>([]);
const newChat = ref<Indexable>({})
const showScrollBtn = ref(false);
const tocRef = ref<InstanceType<typeof OChatToc>>();
const scrollable = ref(true);

function init() {
  start.value = route.name === 'chat-start';
  sessionId.value = (route.params.id || '') as string;
  if (sessionId.value) {
    getSession();
    getAllChats();

    // Resend after replace router
    if (currentChat.value) {
      onSend(currentChat.value, true);
    }
  }
}

function getAllChats() {
  chatService.getAll({id: sessionId.value}).then(res => {
    chats.value = res as Indexable[];
    scrollToBottom();
  })
}

async function onSend(data: ChatInput, reset = false) {
  newChat.value = data;
  scrollToBottom();

  if (reset) {
    chatStore.setCurrentChat(undefined);
  } else {
    chatStore.setCurrentChat(data);
  }

  if (sessionId.value) {
    chatCompletion(data);
  }
  else {
    start.value = false;
    createSession(data);
  }
}

function onStop() {
  cancelStream();
}

async function createSession(data: Indexable) {
  const message = data.message;
  chatSessionService.save({
    id: UUID(),
    title: message,
    name: message
  }).then(res => {
    sessionId.value = res.id;
    start.value = false;

    // update session list
    chatStore.setSessionTimer(Date.now());

    // replace router
    router.replace({name: 'chat-session', params: {id: sessionId.value}});
  })
}

async function chatCompletion(data: ChatInput) {
  chatStore.setCurrentChat(undefined);
  const payload = {
    ...data,
    id: UUID(),
    sessionId: sessionId.value,
    stream: true,
    provider: provider.value.name,
    // model: data.reasoning ? 'deepseek-reasoner' : 'deepseek-chat'
  }
  newChat.value = payload;

  await startStream('/chat/completions', payload,
    onProgress, onDone, onErrorDone);
}

async function onProgress(reasoningText: string, text: string) {
  newChat.value.content = text;
  newChat.value.reasoningContent = reasoningText;
  scrollToBottom();
}

async function onDone(reasoningText: string, text: string) {
  newChat.value.content = text;
  newChat.value.reasoningContent = reasoningText;
  chats.value.push({...newChat.value})
  newChat.value = {};
  scrollToBottom();
}

async function onErrorDone(chat: Indexable) {
  newChat.value = chat;
  chats.value.push({...newChat.value})
  newChat.value = {};
  scrollToBottom();
}

function onLike(item: Indexable, index: number) {
  chats.value.splice(index, 1, item);
}

function onNewChat() {
  router.replace({name: 'chat-start'});
}

async function scrollToBottom(duration = 0, manual = false) {
  if (!scrollable.value && !manual) return;
  await nextTick();
  setTimeout(() => {
    // pageRef.value?.scrollToBottom(duration);
  }, 0)
}

function onScroll(info: Indexable, direction: string) {
  tocRef.value?.onScroll();
  if (direction === 'up') {
    scrollable.value = false;
  }
}

function onIntersection(entry: Indexable) {
  showScrollBtn.value = !entry.isIntersecting;
  if (entry.isIntersecting) {
    scrollable.value = true;
  }
  console.log('inter', scrollable.value);
}

onActivated(() => {
  init();
})
</script>

<style lang="scss">
.page-assistant-chat {
  .q-splitter--vertical {
    height: calc(100vh - 40px);

    .q-splitter__before {
      overflow: hidden;
    }

    &:has(.after-v:hover, .separator-v:hover) {
      .toggle-v {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
  }

  .q-splitter--horizontal {
    height: calc(100vh - 40px);

    .q-splitter__before {
      overflow: hidden;
    }

    &:has(.after-h:hover, .separator-h:hover) {
      .toggle-h {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
  }

  .toggle-h {
    min-height: unset;
    padding: 0 16px;
    height: 24px;
    margin-top: -12px;
    border-radius: 4px 4px 0 0;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;
  }

  .toggle-v {
    min-width: unset;
    padding: 16px 0;
    width: 24px;
    margin-left: -12px;
    border-radius: 4px 0 0 4px;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;
  }


  &.start {
    padding: 0 1rem;
  }

  header.header {
    position: absolute;
    top: 0;
    left: 0;
    height: 50px;
    padding: 0 10px;
    z-index: 1;
    background: linear-gradient(to right,
      var(--q-secondary) 10%,
      transparent 20%,
      transparent 80%,
      var(--q-secondary) 90%);

    .q-btn {
      width: 32px !important;
      height: 32px !important;
      min-height: 32px;
      min-width: 32px;
      border-radius: 2px;
      margin-left: 8px;
    }
  }

  .o-page-container {
    top: 0;
    bottom: 140px;
    padding: 0 1rem 0 1rem;
  }

  .chat-list {
    width: 100%;
    max-width: 800px;
    padding: 64px 0 1rem 0;
  }

  footer.footer {
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 1rem;

    .warning {
      font-size: 0.8rem;
      //opacity: 0.75;
    }
  }

  .start-panel {
    width: 100%;
    max-width: 800px;

    header, footer, .start-card {
      width: 100%;
    }

    header {
      text-align: center;
      padding-bottom: 20px;
      .welcome {
        font-size: 1.6rem;
        font-weight: 600;

        img {
          display: block;
          height: 32px;
          margin-right: 8px;
        }
      }
      .message {
        margin-top: 4px;
      }
    }

    footer {
      height: 200px;
    }
  }

  .new-chat {
    .q-btn {
      border-radius: 10px;
    }
  }

  .scroll-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: -4px;
    .btn-wrapper {
      width: 100%;
      max-width: 800px;
    }
  }

  .o-chat-toc {
    position: fixed;
    top: 64px;
    right: 1rem;
  }
}
</style>
