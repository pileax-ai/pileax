<template>
  <o-common-card class="chat-input-card" accent>
    <q-input ref="inputRef"
             v-model="input"
             placeholder="发送消息"
             borderless
             autofocus
             autogrow
             @keydown="onKeydown" />
    <div class="row justify-between">
      <div class="row items-end">
        <q-btn icon="emoji_objects" label="深度思考"
               :class="`text-${reasoning ? 'white' : 'readable'}
                            bg-${reasoning ? 'primary' : 'dark'} reasoning`"
               @click="onToggleThink"
               flat dense rounded>
          <o-tooltip position="left" transition>
            先思考后回答，解决推理问题
          </o-tooltip>
        </q-btn>
      </div>
      <div>
        <q-btn icon="add" class="bg-dark" flat round>
          <o-tooltip position="top" transition>
            <div class="title">上传文件</div>
            <div class="caption">最多10个，每个50M，支持各类文档和图片</div>
          </o-tooltip>
        </q-btn>
        <q-btn icon="stop"
               class="bg-primary text-white"
               flat round
               @click="onStop"
               v-if="loading">
          <o-tooltip position="top" transition>
            停止生成
          </o-tooltip>
        </q-btn>
        <q-btn icon="arrow_upward"
               :disable="!input"
               :class="`bg-${input ? 'primary' : 'dark'} text-${input ? 'white' : 'tips'}`"
               flat round
               @click="onSend" v-else>
          <o-tooltip position="top" transition>
            <div class="title">发送</div>
            <div class="caption">发送消息，按<q-icon name="keyboard_return"/>直接发送</div>
          </o-tooltip>
        </q-btn>
      </div>
    </div>
  </o-common-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChatInput } from 'src/types/chat';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['send', 'stop']);

const input = ref('');
const reasoning = ref(false);

function onToggleThink() {
  reasoning.value = !reasoning.value;
}

/**
 * Set behaviors for Enter
 * 1. Enter: send
 * 2. Shift+Enter: line break
 *
 * If want to add line break programmatically, use input.value += '\n'
 * @param event
 */
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
    event.preventDefault();
    onSend();
  }
}

function onSend() {
  const message = input.value ? input.value.trim() : '';
  if (message === '') return;

  console.log('send', input.value);
  emit('send', {
    message: message,
    reasoning: reasoning.value
  } as ChatInput);
  reset();
}

function onStop() {
  emit('stop');
}

function reset() {
  input.value = '';
}
</script>

<style lang="scss">
.chat-input-card {
  margin: 0;
  padding: 10px;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;

  .q-field {
    .q-field__native {
      max-height: 400px;
    }
  }

  .q-chip {
    box-shadow: none!important;
  }

  .q-btn {
    margin-left: 4px;
    min-width: 36px;
    min-height: 36px;

    &.reasoning {
      margin: 0;
      padding: 4px 12px 4px 8px;
      min-height: unset;

      .q-icon {
        margin-right: 2px;
      }
    }
  }
}
</style>
