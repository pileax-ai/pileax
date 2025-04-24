<template>
  <section class="row col-12 justify-center chat-section">
    <q-scroll-area ref="scrollRef"
                   class="o-scroll-wrapper"
                   @scroll="onScroll">
      <o-chat-toc ref="tocRef" :chats="chats" />
      <header class="row col-12 justify-between header">
        <div>
          <o-hover-menu-btn label="Chat List"
                            anchor="bottom left"
                            self="top left"
                            class="bg-accent"
                            menu-class="chat-section-session-menu pi-menu"
                            min-width="240px"
                            flat default-open dropdown persistent>
            <chat-sessions ref="sessionsRef"
                           :ref-type="refType"
                           :ref-id="refId"
                           :active-id="sessionId"
                           default-open
                           @open="openSession" />
          </o-hover-menu-btn>
        </div>
        <chat-actions v-if="showAction" />
      </header>

      <section class="row col-12 justify-center">
        <section class="row col-12 justify-center start-panel" v-if="start">
          <header>
            <div class="row justify-center items-center welcome">
              <img :src="$public('/logo.png')" alt="Logo" />
              我是PileaX，很高兴遇见你!
            </div>
            <div class="message text-readable">
              {{ description }}
            </div>
          </header>
          <o-chat-input @send="onSend" :tag="tag" />
          <footer></footer>
        </section>
        <section class="chat-list" v-else>
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

        <section class="row col-12 justify-center q-pb-lg new-chat"
                 v-show="!start && chats.length">
          <q-btn class="bg-primary text-white"
                 flat
                 @click="onNewChat" v-intersection="onIntersection">
            <q-icon name="add_comment" class="flip-horizontal" />
            <span class="q-ml-sm">开启新对话</span>
          </q-btn>
        </section>

        <transition name="fade">
          <section class="row col-12 justify-center q-pb-lg scroll-bottom"
                   v-if="chats.length && showScrollBtn">
            <div class="row col-12 justify-end btn-wrapper">
              <q-btn icon="south" class="bg-dark text-info" flat round @click="scrollToBottom(500)" />
            </div>
          </section>
        </transition>
      </section>

      <footer class="row col-12 justify-center footer" v-if="!start">
        <o-chat-input :loading="isLoading"
                      :tag="tag"
                      @send="onSend"
                      @stop="onStop" />

        <div class="row col-12 justify-center q-py-sm bg-secondary text-tips warning">
          内容由 AI 生成，请仔细甄别
        </div>
      </footer>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import { computed, PropType, ref, nextTick, onBeforeMount, onActivated } from 'vue'
import { useRoute } from 'vue-router';
import OChatInput from 'components/chat/OChatInput.vue';
import OChatMessage from 'components/chat/OChatMessage.vue';
import ChatSessions from 'components/chat/ChatSessions.vue';

import { router } from 'src/router';
import { chatService } from 'src/service/remote/chat';
import { chatSessionService } from 'src/service/remote/chat-session';
import { UUID } from 'core/utils/crypto';
import useAi from 'src/hooks/useAi';
import useStream from 'src/hooks/useStream';
import useChatSession from 'src/hooks/useChatSession';
import { ChatInput, ChatSession } from 'src/types/chat'
import OChatToc from 'components/chat/OChatToc.vue'
import ChatActions from 'components/chat/ChatActions.vue'
import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue'
import { QScrollArea } from 'quasar'

const props = defineProps({
  refType: {
    type: String,
    required: true
  },
  refId: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: ''
  },
  showAction: {
    type: Boolean,
    default: false
  },
});

const { provider } = useAi();
const {
  session,
  sessionId,
  chatStore,
} = useChatSession();
const { isLoading, startStream, cancelStream } = useStream();

const scrollRef = ref<InstanceType<typeof QScrollArea>>();
const sessionsRef = ref<InstanceType<typeof ChatSessions>>();
const tocRef = ref<InstanceType<typeof OChatToc>>();
const start = ref(true);
const chats = ref<Indexable[]>([]);
const newChat = ref<Indexable>({})
const showScrollBtn = ref(false);
const scrollable = ref(true);
const scrollTop = ref(0);
const scrollDirection = ref('');

function init() {
  console.log('init');
}

function openSession(item: ChatSession) {
  start.value = false;
  session.value = item;
  sessionId.value = item.id;
  getAllChats();
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

async function createSession(data: ChatInput) {
  const message = data.message;
  chatSessionService.save({
    id: UUID(),
    title: message,
    name: message,
    refType: props.refType,
    refId: props.refId,
  }).then(res => {
    sessionId.value = res.id;
    start.value = false;

    // update session list
    sessionsRef.value?.refresh();

    // replace router
    onSend(data);
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
  start.value = true;
  sessionId.value = '';
  session.value = undefined;
  chats.value = [];
}

async function scrollToBottom(duration = 0) {
  await nextTick();
  setTimeout(() => {
    // pageRef.value?.scrollToBottom(duration);
    const scrollTarget = scrollRef.value?.getScrollTarget();
    const scrollHeight = scrollTarget?.scrollHeight || 0;
    scrollRef.value?.setScrollPosition('vertical', scrollHeight, duration);
  }, 0)
}

function onScroll(info: any) {
  tocRef.value?.onScroll();

  // scroll direction
  if (scrollTop.value) {
    scrollDirection.value = scrollTop.value > info.verticalPosition
      ? 'up'
      : 'down';
    if (scrollDirection.value === 'up') {
      scrollable.value = false;
    }
  }
  scrollTop.value = info.verticalPosition;
}

function onIntersection(entry: Indexable) {
  showScrollBtn.value = !entry.isIntersecting;
  if (entry.isIntersecting) {
    scrollable.value = true;
  }
}

onActivated(() => {
  init();
})
</script>

<style lang="scss">
.chat-section {
  .o-scroll-wrapper {
    padding-bottom: 145px;
  }

  .start-panel {
    width: 100%;
    max-width: 800px;
    padding-top: 150px;

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

  .chat-list {
    width: 100%;
    max-width: 800px;
    padding: 64px 0 1rem 0;
  }

  header.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    padding: 0 21px;
    z-index: 1;
    background: linear-gradient(to right,
      var(--q-secondary) 15%,
      transparent 50%,
      var(--q-secondary) 85%);

    .q-btns {
      width: 32px !important;
      height: 32px !important;
      min-height: 32px;
      min-width: 32px;
      border-radius: 2px;
    }
  }

  footer.footer {
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 1rem;

    .warning {
      font-size: 0.8rem;
      //opacity: 0.75;
    }
  }

  .o-chat-toc {
    position: fixed;
    top: 1rem;
    right: 28px;
    z-index: 2;
  }


  .scroll-bottom {
    position: fixed;
    right: 0;
    bottom: 140px;
    z-index: 1000;
    .btn-wrapper {
      width: 100%;
      max-width: 800px;
    }
  }
}

.chat-section-session-menu {
  box-shadow: none;
  outline: solid 1px var(--q-dark);
  .q-list {
    .q-list {
      padding: 0;

      .q-item {
        padding: 0 4px !important;
        min-height: 42px;

        &:before {
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
