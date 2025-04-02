<template>
  <q-item class="o-chat-message user" v-if="role==='user'">
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar" v-if="!alignRight" />
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
          {{message}}
        </div>
        <div class="actions">
          <o-copy-btn :value="message" flat />
          <q-btn icon="edit" flat @click="onEdit" />
        </div>
      </template>
    </q-item-section>
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar" v-if="alignRight" />
      </q-avatar>
    </q-item-section>
  </q-item>

  <q-item class="o-chat-message assistant" v-else>
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar" />
      </q-avatar>
      <div class="line"></div>
    </q-item-section>

    <!-- Column 1 -->
    <q-item-section>
      <q-spinner-dots size="2rem" v-if="streaming && !message" />
      <template v-else>
        <div class="think row items-center text-readable" v-if="think">
          <q-icon name="emoji_objects" size="1.4rem" /> 已深度思考
        </div>

        <div class="message-wrapper">
          <div class="message">
            <o-chat-message-view :message="message" />
            <slot></slot>
          </div>

          <div class="actions" >
            <q-spinner-dots size="2rem" v-if="streaming " />
            <template v-else>
              <o-copy-btn :value="message" flat />
              <q-btn icon="autorenew" flat />
              <q-btn icon="mdi-thumb-up-outline" flat />
              <q-btn icon="mdi-thumb-down-outline" flat />
              <q-btn icon="add" flat />
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
import { onMounted, ref } from 'vue'
import OChatMessageView from 'components/chat/OChatMessageView.vue';

const props = defineProps({
  avatar: {
    type: String,
    default: 'https://cdn.quasar.dev/img/avatar3.jpg'
  },
  message: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  alignRight: {
    type: Boolean,
    default: false
  },
  alternative: {
    type: Boolean,
    default: false
  },
  think: {
    type: Boolean,
    default: false
  },
  streaming: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['send']);

const editable = ref(false);
const userMessage = ref('');

function onEdit() {
  editable.value = true;
}

function onSend() {
  editable.value = false;
  emit('send', {
    role: 'user',
    message: userMessage,
    think: props.think
  })
}

onMounted(() => {
  userMessage.value = props.role === 'user' ? props.message : props.message;
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

    .think {
      width: max-content;
      background: var(--q-dark);
      border-radius: 6px;
      padding: 10px 10px 10px 6px;
      min-height: 42px;
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
    }
    &:hover {
      .q-item__section--avatar {
        .line {
          margin-top: 4px;
          width: 50%;
          height: calc(100% - 62px);
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
