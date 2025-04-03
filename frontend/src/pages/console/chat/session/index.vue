<template>
  <o-common-page ref="pageRef"
                 class="page-chat"
                 :class="{ 'row justify-center items-center start': start }"
                 :content-class="start ? 'justify-center' : ''"
                 header
                 :footer="!start"
                 :scrollable="!start">
    <template #header>
      <o-ai-provider-select-btn />
    </template>

    <section class="row justify-center start-panel" v-if="start">
      <header>
        <div class="row justify-center items-center welcome">
          <img src="/logo.png" alt="Logo" />
          我是PileaX，很高兴遇见你!
        </div>
        <div class="message text-readable">我是你的AI助手，请把你的任务交给我吧~</div>
      </header>
      <o-chat-input @send="onSend" />
      <footer></footer>
    </section>
    <section class="row col-12 justify-center" v-else>
      <section class="chat-list">
        <template v-for="(item, index) in chats" :key="index">
          <o-chat-message :message="item.message"
                          role="user"
                          align-right />
          <o-chat-message :message="item.response"
                          role="assistant" />
        </template>

        <template v-if="isLoading">
          <o-chat-message :message="message"
                          role="user"
                          align-right />
          <o-chat-message :message="response"
                          role="assistant"
                          :streaming="isLoading" />
        </template>
      </section>
    </section>

    <template #footer>
      <o-chat-input :loading="isLoading"
                    @send="onSend"
                    @stop="onStop" />

      <div class="row col-12 justify-center q-py-sm bg-secondary text-tips warning">
        内容由 AI 生成，请仔细甄别
      </div>
    </template>
  </o-common-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, onActivated } from 'vue';
import { useRoute } from 'vue-router';
import OCommonPage from 'core/page/template/OCommonPage.vue';
import OChatInput from 'components/chat/OChatInput.vue';
import OAiProviderSelectBtn from 'components/ai/OAiProviderSelectBtn.vue';
import OChatMessage from 'components/chat/OChatMessage.vue';

import { router } from 'src/router';
import { chatService } from 'src/service/remote/chat';
import { chatSessionService } from 'src/service/remote/chat-session';
import { UUID } from 'core/utils/crypto';
import useStream from 'src/hooks/useStream';
import useChatSession from 'src/hooks/useChatSession';
import { ChatInput } from 'src/types/chat'

const route = useRoute();
const {
  sessionId,
  currentChat,
  chatStore,
  getSession,
} = useChatSession();
const { isLoading, startStream, cancelStream } = useStream();

const pageRef = ref<InstanceType<typeof OCommonPage>>();
const start = ref(true);
const message = ref('');
const response = ref('');
const chats = ref<Indexable[]>([]);

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
  message.value = data.message;
  response.value = '';
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

async function chatCompletion(data: Indexable) {
  chatStore.setCurrentChat(undefined);
  const payload = {
    ...data,
    id: UUID(),
    sessionId: sessionId.value,
    stream: true,
    model: 'deepseek-chat'
  }

  await startStream('/chat/completions', payload, onProgress, onDone);
}

async function onProgress(text: string) {
  response.value = text;
  scrollToBottom();
}

async function onDone(text: string) {
  chats.value.push({
    message: message.value,
    response: text
  })
  response.value = '';
  scrollToBottom();
}

async function scrollToBottom() {
  await nextTick();
  setTimeout(() => {
    pageRef.value?.scrollToBottom();
  }, 0)
}

onActivated(() => {
  init();
})
</script>

<style lang="scss">
.page-chat {
  &.start {
    padding: 0 1rem;
  }

  header.header {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
    z-index: 1;
  }

  .o-page-container {
    top: 64px;
    bottom: 140px;
    padding: 0 1rem 1rem 1rem;
  }

  .chat-list {
    width: 100%;
    max-width: 800px;
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
}
</style>
