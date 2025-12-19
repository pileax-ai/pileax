<template>
  <section class="row col-12 justify-center chat-section"
           :class="{ 'dense': dense }">
    <q-scroll-area ref="scrollRef"
                   class="o-scroll-wrapper xxxx"
                   @scroll="onScroll">
      <o-chat-toc ref="tocRef" :chats="chats" v-show="toc" />
      <header class="row col-12 justify-between header" v-show="header">
        <div>
          <o-hover-menu-btn label="Chat List"
                            anchor="bottom left"
                            self="top left"
                            class="bg-accent"
                            :menu-class="`chat-section-conversation-menu pi-menu ${dense ? 'dense' : ''}`"
                            min-width="200px"
                            :default-open="defaultOpen"
                            flat dropdown persistent>
            <chat-conversations ref="conversationsRef"
                           :ref-type="refType"
                           :ref-id="refId"
                           :active-id="conversationId"
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
              {{ $t('chat.assistant.welcome') }}
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
                            :dense="dense"
                            :note="note"
                            :ref-type="refType"
                            align-right
                            @favorite="onFavorite($event, index)" />
          </template>

          <template v-if="isLoading">
            <o-chat-message :chat="newChat"
                            :dense="dense"
                            :note="note"
                            :ref-type="refType"
                            align-right
                            :streaming="isLoading" />
          </template>
        </section>

        <template v-if="!start && chats.length">
          <section class="row col-12 justify-center q-pb-lg new-chat"
                   v-show="multiSession">
            <q-btn class="bg-primary text-white"
                   flat
                   @click="onNewChat" v-intersection="onIntersection">
              <q-icon name="add_comment" class="flip-horizontal" />
              <span class="q-ml-sm">{{ $t('chat.conversation.new') }}</span>
            </q-btn>
          </section>
          <section class="row col-12 justify-center"
                   v-show="!multiSession">
            <span style="color: transparent;" v-intersection="onIntersection">
              <span class="q-ml-sm">Bottom</span>
            </span>
          </section>
        </template>

        <transition name="fade">
          <section class="row col-12 justify-center q-pb-lg scroll-bottom"
                   v-if="multiSession && chats.length && showScrollBtn">
            <div class="row col-12 justify-end btn-wrapper">
              <q-btn icon="south" class="bg-dark text-info" flat round @click="scrollToBottom(500)" />
            </div>
          </section>
        </transition>
      </section>

      <footer class="row col-12 justify-center footer" v-if="!start">
        <o-chat-input :loading="isLoading"
                      :tag="tag"
                      :dense="dense"
                      @send="onSend"
                      @stop="onStop">
          <template #menu>
            <o-menu class="pi-menu flat no-shadow bg-accent"
                    anchor="top left" self="bottom left"
                    style="box-shadow: none !important;"
                    :min-width="`${chatWidth - 28}px`"
                    :offset="[10, 12]">
              <slot name="menu" />
            </o-menu>
          </template>
        </o-chat-input>

        <div class="row col-12 justify-center q-py-sm bg-secondary text-tips warning">
          {{ $t('ai.generateDisclaimer') }}
        </div>
      </footer>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onActivated, onBeforeMount, watch } from 'vue'
import OChatInput from 'components/chat/OChatInput.vue'
import OChatMessage from 'components/chat/OChatMessage.vue'
import ChatConversations from 'components/chat/ChatConversations.vue'

import { chatService } from 'src/api/service/remote/chat'
import { chatConversationService } from 'src/api/service/remote/chat-conversation'
import { UUID } from 'core/utils/crypto'
import useAi from 'src/hooks/useAi'
import useStream from 'src/hooks/useStream'
import useChatConversation from 'src/hooks/useChatConversation'
import type { ChatInput, ChatConversation } from 'src/types/chat'
import OChatToc from 'components/chat/OChatToc.vue'
import ChatActions from 'components/chat/ChatActions.vue'
import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue'
import { QScrollArea } from 'quasar'
import useNote from 'src/hooks/useNote'

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
  toc: {
    type: Boolean,
    default: false
  },
  header: {
    type: Boolean,
    default: false
  },
  showAction: {
    type: Boolean,
    default: false
  },
  multiSession: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  defaultOpen: {
    type: Boolean,
    default: false
  },
  note: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['chats'])

const { localModels } = useAi()
const { noteStore } = useNote()
const {
  conversation,
  conversationId,
  chatStore,
} = useChatConversation()
const { isLoading, startStream, cancelStream } = useStream()

const scrollRef = ref<InstanceType<typeof QScrollArea>>()
const conversationsRef = ref<InstanceType<typeof ChatConversations>>()
const tocRef = ref<InstanceType<typeof OChatToc>>()
const start = ref(false)
const chats = ref<Indexable[]>([])
const newChat = ref<Indexable>({})
const showScrollBtn = ref(false)
const scrollable = ref(true)
const scrollTop = ref(0)
const scrollDirection = ref('')

const chatWidth = computed(() => (noteStore.value.chatWidth))
const localDefaultModel = computed(() => {
  return localModels.value['chat'] || {}
})

function init(from = '') {
  console.log('init from', from)
  start.value = props.multiSession
  getLatestSession()
  // console.log('init', from, props.refId);
}

function getLatestSession() {
  const query = {
    pageIndex: 1,
    pageSize: 1,
    condition: {
      refType: props.refType,
      refId: props.refId
    },
    sort: {
      updateTime: 'desc'
    }
  }
  chatConversationService.query(query).then(res => {
    const defaultSession = res.list.length
      ? res.list.at(0)
      : {}
    openSession(defaultSession)
  })
}

function openSession(item: ChatConversation) {
  if (item && item.id) {
    start.value = false
    conversation.value = item
    conversationId.value = item.id
    getAllChats()
  } else {
    reset()
  }
}

function getAllChats() {
  chatService.getMessages(conversationId.value).then(res => {
    chats.value = res as Indexable[]
    scrollToBottom()
  })
}

async function onSend(data: ChatInput, reset = false) {
  newChat.value = data
  scrollToBottom()

  if (reset) {
    chatStore.value.removeChat(data.id)
  } else {
    chatStore.value.addChat(data)
  }

  if (conversationId.value) {
    chatCompletion(data)
  }
  else {
    start.value = false
    createSession(data)
  }
}

function onStop() {
  cancelStream()
}

async function createSession(data: ChatInput) {
  const message = data.message
  chatConversationService.save({
    id: UUID(),
    name: message,
    refType: props.refType,
    refId: props.refId,
  }).then(res => {
    conversation.value = res
    conversationId.value = res.id
    start.value = false

    // update conversation list
    conversationsRef.value?.refresh()

    // replace router
    onSend(data)
  })
}

async function chatCompletion(data: ChatInput) {
  chatStore.value.removeChat(data.id)
  const payload = {
    ...data,
    id: UUID(),
    conversationId: conversationId.value,
    stream: true,
  }
  newChat.value = {
    ...payload,
    modelProvider: conversation.value?.modelProvider,
    modelType: conversation.value?.modelType,
    modelName: conversation.value?.modelName,
  }

  await startStream('/chat/completions', payload,
    onProgress, onDone, onErrorDone)
}

async function onProgress(reasoningText: string, text: string) {
  newChat.value.content = text
  newChat.value.reasoningContent = reasoningText
  scrollToBottom()
}

async function onDone(reasoningText: string, text: string) {
  newChat.value.content = text
  newChat.value.reasoningContent = reasoningText
  chats.value.push({...newChat.value})
  newChat.value = {}
  scrollToBottom()
}

async function onErrorDone(chat: Indexable) {
  newChat.value = chat
  chats.value.push({...newChat.value})
  newChat.value = {}
  scrollToBottom()
}

function onFavorite(item: Indexable, index: number) {
  chats.value.splice(index, 1, item)
}

function onNewChat() {
  start.value = true
  reset()
}

async function scrollToBottom(duration = 0) {
  if (!scrollable.value) return
  await nextTick()
  setTimeout(() => {
    // pageRef.value?.scrollToBottom(duration);
    const scrollTarget = scrollRef.value?.getScrollTarget()
    const scrollHeight = scrollTarget?.scrollHeight || 0
    scrollRef.value?.setScrollPosition('vertical', scrollHeight, duration)
  }, 0)
}

function onScroll(info: any) {
  tocRef.value?.onScroll()

  // scroll direction
  if (scrollTop.value) {
    scrollDirection.value = scrollTop.value > info.verticalPosition
      ? 'up'
      : 'down'
    if (scrollDirection.value === 'up') {
      scrollable.value = false
    }
  }
  scrollTop.value = info.verticalPosition
}

function onIntersection(entry: Indexable) {
  showScrollBtn.value = !entry.isIntersecting
  if (entry.isIntersecting) {
    scrollable.value = true
  }
  console.log('inter', scrollable.value)
}

function reset() {
  conversationId.value = ''
  conversation.value = undefined
  chats.value = []
}

const send = (message: string) => {
  onSend({
    id: UUID(),
    message: message,
    modelProvider: localDefaultModel.value.provider,
    modelType: localDefaultModel.value.modelType,
    modelName: localDefaultModel.value.modelName,
  } as ChatInput)
}

watch(chats, (newValue) => {
  emit('chats', newValue)
})

onActivated(() => {
  init('activated')
})

onBeforeMount(() => {
  init('mount')
})

defineExpose({
  send: send
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
    z-index: 2;

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

  &.dense {
    .o-scroll-wrapper {
      top: 0 !important;
      padding-bottom: 160px;
    }
    .chat-list {
      padding: 1rem 1rem 1rem 1rem;
    }
  }
}

.chat-section-conversation-menu {
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

  &.dense {
    display: none;
  }
}
</style>
