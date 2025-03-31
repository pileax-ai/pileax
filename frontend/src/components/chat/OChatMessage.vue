<template>
  <q-item class="o-chat-message sent" v-if="role==='user'">
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar" v-if="!alignRight" />
      </q-avatar>
    </q-item-section>
    <q-item-section :align="alignRight ? 'right' : 'left'">
      <div class="message">
        <q-input v-model="userMessage" autogrow borderless />
      </div>
      <div class="actions">
        <q-btn icon="content_copy" flat />
        <q-btn icon="edit" flat />
      </div>
    </q-item-section>
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar" v-if="alignRight" />
      </q-avatar>
    </q-item-section>
  </q-item>

  <q-item class="o-chat-message" v-else>
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar" />
      </q-avatar>
    </q-item-section>

    <!-- Column 1 -->
    <q-item-section>
      <q-spinner-dots size="2rem" v-if="streaming" />
      <template v-else>
        <div class="think row items-center text-readable" v-if="think">
          <q-icon name="emoji_objects" size="1.4rem" /> 已深度思考
        </div>
        <div class="message">
          <o-chat-message-view :message="message" />
          <slot></slot>
        </div>

        <div class="actions">
          <q-btn icon="content_copy" flat />
          <q-btn icon="autorenew" flat />
          <q-btn icon="mdi-thumb-up-outline" flat />
          <q-btn icon="mdi-thumb-down-outline" flat />
          <q-btn icon="add" flat />
        </div>
      </template>
    </q-item-section>

    <!-- Column 2 -->
    <q-item-section v-if="alternative">
      <div class="message">
        <slot name="alternative"></slot>
      </div>
    </q-item-section>

    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar" v-if="false" />
      </q-avatar>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import OChatMessageView from 'components/chat/OChatMessageView.vue';

const userMessage = ref('')

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
    default: true
  },
})
const emit = defineEmits(['send']);

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
      justify-content: start;
    }

    .think {
      width: max-content;
      background: var(--q-dark);
      border-radius: 6px;
      padding: 10px 10px 10px 6px;
    }

    &--avatar {
      justify-content: start;
    }

    .actions {
      margin-top: 2px;
      visibility: hidden;

      .q-btn {
        width: 32px;
        height: 32px;
        min-height: unset;

        .q-icon {
          font-size: 18px;
        }
      }
    }
  }

  &.sent {
    margin-top: 2px;
    .message {
      width: max-content;
      max-width: 100%;
      background: var(--q-dark);
      border-radius: 6px;
      padding: 10px 6px;

      .q-field, .q-inner, .q-field__control, textarea {
        width: auto !important; /* 移除固定宽度 */
        min-width: unset !important;
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
