<template>
  <o-scroll-section ref="scrollRef"
                    class="chat-session"
                    :class="{ 'start': start }"
                    @scroll="onScroll">
    <section class="row col-12 justify-center">
      <section class="row justify-center start-panel" v-if="start">
        <header>
          <div class="row justify-center items-center welcome">
            <img :src="$public('/logo.png')" alt="Logo" />
            我是PileaX，很高兴遇见你!
          </div>
          <div class="message text-readable">我是你的AI助手，请把你的任务交给我吧~</div>
        </header>
        <footer></footer>
      </section>
      <section class="row col-12 justify-center" v-else>
        <section class="chat-list">
          <template v-for="(item, index) in chats" :key="index">
            <o-chat-message :chat="item"
                            align-right @like="onLike($event, index)" />
          </template>

          <template v-if="isLoading">
            <o-chat-message :chat="newChat"
                            align-right
                            :streaming="isLoading" />
          </template>
        </section>
      </section>
      <section class="row col-12 justify-center q-pb-lg new-chat" v-show="chats.length">
        <q-btn class="bg-primary text-white"
               flat
               @click="onNewChat" v-intersection="onIntersection">
          <q-icon name="add_comment" class="flip-horizontal" />
          <span class="q-ml-sm">开启新对话</span>
        </q-btn>
      </section>

      <transition name="fade">
        <section class="row col-12 justify-center q-pb-lg scroll-bottom" v-if="chats.length && showScrollBtn">
          <div class="row col-12 justify-end btn-wrapper">
            <q-btn icon="south" class="bg-dark text-info" flat round @click="scrollToBottom(500, true)" />
          </div>
        </section>
      </transition>
    </section>

    <o-chat-toc ref="tocRef" :chats="chats" />
  </o-scroll-section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, onActivated } from 'vue';
import { useRoute } from 'vue-router';
import OScrollSection from 'core/page/section/OScrollSection.vue';
import OChatMessage from 'components/chat/OChatMessage.vue';
import OChatToc from 'components/chat/OChatToc.vue';

import { router } from 'src/router';
import { chatService } from 'src/service/remote/chat';
import { chatSessionService } from 'src/service/remote/chat-session';
import { UUID } from 'core/utils/crypto';
import useAi from 'src/hooks/useAi';
import useStream from 'src/hooks/useStream';
import useChatSession from 'src/hooks/useChatSession';
import { ChatInput } from 'src/types/chat';

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

const scrollRef = ref<InstanceType<typeof OScrollSection>>();
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
    name: message,
    assistant: 'chat' // todo
  }).then(res => {
    sessionId.value = res.id;
    start.value = false;

    // update session list
    chatStore.setSessionTimer(Date.now());

    // replace router
    router.replace({
      name: 'chat-session',
      params: { assistant: res.assistant, id: res.id }
    });
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
    scrollRef.value?.scrollToBottom(duration);
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

defineExpose({
  isLoading,
  onSend,
  onStop
})
</script>

<style lang="scss">
.chat-session {
  &.start {
    padding: 0 1rem;
    .q-scrollarea__content {
      display: flex;
      justify-content: center;
      align-items: center;
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
    padding: 1rem 0;
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
    top: 1rem;
    right: 1rem;
  }
}
</style>
