<template>
  <o-common-page ref="pageRef"
                 class="page-chat"
                 :class="{ 'row justify-center items-center start': start }"
                 :content-class="start ? 'justify-center' : ''"
                 header
                 :footer="!start"
                 :scrollable="!start"
                 @scroll="onScroll">
    <template #header>
    </template>
    <template #right>
      <chat-actions :conversation="conversation" />
    </template>

    <section class="row justify-center start-panel" v-if="start">
      <header>
        <div class="row justify-center items-center welcome">
          <img :src="$public('/logo.png')" alt="Logo" />
          我是PileaX，很高兴遇见你!
        </div>
        <div class="message text-readable">我是你的AI助手，请把你的任务交给我吧~</div>
      </header>
      <o-chat-input @send="onSend" enable-upload />
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

    <o-chat-toc ref="tocRef" :chats="chats" />

    <template #footer>
      <o-chat-input :loading="isLoading"
                    enable-upload
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
import OChatMessage from 'components/chat/OChatMessage.vue';
import OChatToc from 'components/chat/OChatToc.vue';
import ChatActions from 'components/chat/ChatActions.vue';

import { router } from 'src/router';
import { chatService } from 'src/service/remote/chat';
import { chatConversationService } from 'src/service/remote/chat-conversation';
import { UUID } from 'core/utils/crypto';
import useAi from 'src/hooks/useAi';
import useStream from 'src/hooks/useStream';
import useChatConversation from 'src/hooks/useChatConversation';
import { ChatInput } from 'src/types/chat'

const route = useRoute();
const { provider } = useAi();
const {
  appId,
  conversation,
  conversationId,
  currentChat,
  chatStore,
  getConversation,
} = useChatConversation();
const { isLoading, startStream, cancelStream } = useStream();

const pageRef = ref<InstanceType<typeof OCommonPage>>();
const start = ref(true);
const chats = ref<Indexable[]>([]);
const newChat = ref<Indexable>({})
const showScrollBtn = ref(false);
const tocRef = ref<InstanceType<typeof OChatToc>>();
const scrollable = ref(true);

function init() {
  start.value = route.name === 'chat-start';
  appId.value = (route.params.appId || '') as string;
  conversationId.value = (route.params.id || '') as string;
  if (conversationId.value) {
    getConversation();
    getAllChats();

    // Resend after replace router
    if (currentChat.value) {
      onSend(currentChat.value, true);
    }
  }
}

function getAllChats() {
  chatService.getMessages(conversationId.value).then(res => {
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

  if (conversationId.value) {
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
  chatConversationService.save({
    id: UUID(),
    name: message
  }).then(res => {
    conversationId.value = res.id;
    start.value = false;

    // update conversation list
    chatStore.setSessionTimer(Date.now());

    // replace router
    router.replace({name: 'chat-conversation', params: {id: conversationId.value}});
  })
}

async function chatCompletion(data: ChatInput) {
  chatStore.setCurrentChat(undefined);
  const payload = {
    ...data,
    id: UUID(),
    appId: appId.value,
    conversationId: conversationId.value,
    stream: true,
    provider: provider.value.name,
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
    pageRef.value?.scrollToBottom(duration);
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
.page-chat {
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
