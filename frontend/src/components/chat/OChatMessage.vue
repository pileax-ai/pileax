<template>
  <q-item class="o-chat-message user" :id="chat.id">
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar || account.avatar || $public('/logo.png')"
             alt="Avatar"
             v-if="!alignRight" />
      </q-avatar>
    </q-item-section>
    <q-item-section :align="alignRight ? 'right' : 'left'">
      <template v-if="editable">
        <div class="message editable">
          <q-input v-model="userMessage" autofocus autogrow borderless />
        </div>
        <div class="actions editable">
          <q-btn icon="close" class="bg-dark text-readable" flat @click="editable=false">
            <o-tooltip position="bottom">取消</o-tooltip>
          </q-btn>
          <q-btn icon="arrow_upward" class="bg-primary text-white" flat @click="onSend">
            <o-tooltip position="bottom">发送</o-tooltip>
          </q-btn>
        </div>
      </template>
      <template v-else>
        <div class="message readonly">
          {{ chat.message }}
        </div>
        <div class="actions">
          <o-copy-btn :value="chat.message" flat>
            <o-tooltip position="bottom">复制</o-tooltip>
          </o-copy-btn>
          <q-btn icon="edit" flat @click="onEdit">
            <o-tooltip position="bottom">编辑</o-tooltip>
          </q-btn>
        </div>
      </template>
    </q-item-section>
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar || account.avatar || $public('/logo.png')"
             alt="Avatar"
             v-if="alignRight" />
      </q-avatar>
    </q-item-section>
  </q-item>

  <q-item class="o-chat-message assistant">
    <q-item-section avatar>
      <q-avatar color="accent">
        <o-svg-icon :name="chat.provider" size="2rem" />
      </q-avatar>
      <div class="line"></div>
    </q-item-section>

    <!-- Column 1 -->
    <q-item-section>
      <q-spinner-dots size="2rem"
                      v-if="streaming && !chat.content && !chat.reasoningContent" />
      <template v-else>
        <div class="message-wrapper" :class="{'reasoning': chat.reasoningContent}">
          <q-expansion-item header-class="text-readable"
                            default-opened
                            v-if="chat.reasoningContent">
            <template #header>
              <q-item-section avatar>
                <q-avatar size="24px">
                  <o-svg-icon name="reasoning" size="1.4rem" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                已深度思考
              </q-item-section>
            </template>
            <o-chat-message-view :message="chat.reasoningContent" />
          </q-expansion-item>


          <div class="message">
            <o-chat-message-view :message="chat.content"
                                 :class="{'error': chat.result===-1}" />
          </div>

          <div class="actions" >
            <q-spinner-dots size="32px" v-if="streaming" />
            <template v-else>
              <o-copy-btn :value="chat.content" flat notify>
                <o-tooltip position="bottom">复制</o-tooltip>
              </o-copy-btn>
              <q-btn icon="autorenew" flat>
                <o-tooltip position="bottom">重新生产</o-tooltip>
              </q-btn>
              <q-btn :icon="chat.like===1 ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
                     flat @click="onLike(1)">
                <o-tooltip position="bottom">喜欢</o-tooltip>
              </q-btn>
              <q-btn :icon="chat.like===-1 ? 'mdi-thumb-down' : 'mdi-thumb-down-outline'" flat @click="onLike(-1)">
                <o-tooltip position="bottom">不喜欢</o-tooltip>
              </q-btn>
              <q-btn icon="post_add" flat @click="onNote">
                <o-tooltip position="bottom">创建笔记</o-tooltip>
              </q-btn>
            </template>
          </div>
        </div>
      </template>
    </q-item-section>

    <!-- Column 2 -->
    <q-item-section v-if="alternative">
      <div class="message">
        <slot name="alternative"></slot>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue'
import OChatMessageView from 'components/chat/OChatMessageView.vue';
import { chatService } from 'src/service/remote/chat';
import useAccount from 'src/hooks/useAccount';
import useDialog from 'core/hooks/useDialog';
import { useNoteStore } from 'stores/note';

const props = defineProps({
  avatar: {
    type: String,
    default: ''
  },
  chat: {
    type: Object as PropType<Indexable>,
    default: () => {}
  },
  streaming: {
    type: Boolean,
    default: false
  },
  alignRight: {
    type: Boolean,
    default: false
  },
  alternative: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['like', 'send']);

const { account } = useAccount();
const { openDialog } = useDialog();
const noteStore = useNoteStore();
const editable = ref(false);
const userMessage = ref('');

function onEdit() {
  editable.value = true;
}

function onSend() {
  editable.value = false;
  emit('send', {
    message: userMessage,
    reasoning: props.chat.reasoning
  })
}

function onLike(like: number) {
  chatService.save({
    id: props.chat.id,
    like: like
  }).then(res => {
    emit('like', res);
  })
}

function onNote() {
  noteStore.setChatContent(props.chat.content);
  openDialog({
    type: 'chat-note-select'
  })
}

onMounted(() => {
  userMessage.value = props.chat.message;
})
</script>

<style lang="scss">
.o-chat-message {
  padding: 0;

  .q-item__section {
    min-width: 0;
    &[align="right"] {
      align-items: end;
      text-align: left;
    }

    .message {
      max-width: 100%;
      min-height: 42px;
      justify-content: start;
    }

    &--avatar {
      justify-content: start;
    }

    .actions {
      margin-top: 4px;
      visibility: hidden;
      &.editable {
        visibility: visible;
      }

      .q-btn {
        width: 32px;
        height: 32px;
        min-height: unset;
        margin-left: 4px;

        .q-icon {
          font-size: 18px;
        }
      }
    }
  }

  &.user {
    .message {
      width: 100%;
      background: var(--q-dark);
      border-radius: 6px;
      padding: 10px 10px;

      &.editable {
        width: 100%;
        outline: solid 2px var(--q-primary);

        .q-field__control {
          min-height: unset;
        }

        .q-field__native {
          padding: 0;
          min-height: unset;
        }
      }

      &.readonly {
        width: max-content;
        white-space: pre-line;
      }
    }
  }

  &.assistant {
    .q-item__section--avatar {
      align-items: end;
      .line {
        border: solid 2px transparent;
      }
    }

    .message-wrapper {
      margin: 4px 0;
      outline: solid 2px transparent;

      &.reasoning {
        margin: 0;
      }

      .q-item {
        width: 240px;
        min-height: 42px;
        padding: 8px 8px;
        background: var(--q-dark);
        border-radius: 6px;

        .q-item__section--side {
          padding-right: 0;
          .q-icon {
            font-size: 20px;
            margin-top: 3px;
          }
        }
      }

      .q-expansion-item__content {
        padding: 0 0 0 1rem;
        border-left: solid 1px var(--q-dark);

        .yiitap * {
          color: var(--yii-tips-color) !important;
        }

        .yiitap p {
          font-size: 14px;
        }
      }
    }
    &:hover {
      .q-item__section--avatar {
        .line {
          margin-top: 4px;
          width: 50%;
          height: calc(100% - 60px);
          border-radius: 0 0 0 8px;
          border-left: solid 2px var(--q-dark);
          border-bottom: solid 2px var(--q-dark);
          transition: border 1s ease-in-out;
        }
      }
      .message-wrapper {
        margin: 4px -10px;
        padding: 0 10px;
        border-radius: 6px;
        //outline: solid 2px var(--q-dark);
        //transition: outline 0.5s ease-in-out;

        &.reasoning {
          margin: 0 -10px;
        }
      }
    }
  }

  &:hover {
    .actions {
      visibility: visible;
    }
  }
}
</style>
