<template>
  <section class="column col-12 fit o-assistant-chat">
    <header class="row col-auto justify-between text-tips">
      <div class="row">
        <o-ai-model-select-btn type="chat" single icon-only local>
          <o-tooltip position="left" transition>
            AI Model
          </o-tooltip>
        </o-ai-model-select-btn>
        <q-btn icon="language" flat />
        <q-btn flat>
          <q-icon name="attachment" class="rotate-315" />
          <o-tooltip position="top" transition>
            <div class="title">上传文件</div>
            <div class="caption">最多10个，每个50M，支持各类文档和图片</div>
          </o-tooltip>
        </q-btn>
        <q-btn flat>
          <o-icon name="icon-knowledge-base" size="1.6rem" />
        </q-btn>
        <q-btn icon="tune" flat />
        <q-btn icon="mic" flat />
        <q-btn icon="o_dashboard_customize" class="rotate-270" flat />
      </div>
      <div>
        <q-btn flat round @click="onToggleExpand">
          <o-icon :name="expanded ? 'icon-collapse-content' : 'icon-expand-content'" />
        </q-btn>
      </div>
    </header>
    <section class="col relative-position">
      <q-scroll-area class="o-scroll-wrapper">
        <q-input ref="inputRef"
                 v-model="input"
                 placeholder="发送消息"
                 autogrow
                 borderless
                 autofocus
                 @keydown="onKeydown" />
      </q-scroll-area>
    </section>
    <footer class="row col-auto justify-between text-tips">
      <div class="row items-center">
        <o-badge color="grey">
          {{localDefaultModel.provider}}
        </o-badge>
      </div>
      <div class="row">

        <q-btn class="bg-dark" flat>
          <q-icon name="keyboard" />
          <o-tooltip position="top" transition>
            <div class="caption">快捷键</div>
            <div class="row items-center ">
              <kbd>⌘</kbd> <kbd><q-icon name="keyboard_return" /></kbd> 发送，
              <kbd>⇧</kbd> <kbd><q-icon name="keyboard_return" /></kbd> 换行
            </div>
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

        <q-btn-dropdown icon="arrow_upward"
                        label="发送"
                        :class="`
                          bg-${input ? 'primary' : 'dark'}
                          text-${input ? 'white' : 'tips'}
                        `"
                        content-class="pi-menu"
                        :disable="!input"
                        :menu-offset="[0, 4]"
                        split flat
                        @click="onSend"
                        v-else>
          <q-list>
            <o-common-item icon="check" size="2rem" label="按 Enter 发送" clickable closable />
            <o-common-item icon="none" size="2rem" label="按 ⌘ + Enter 发送" clickable closable />
          </q-list>
        </q-btn-dropdown>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChatInput } from 'src/types/chat';
import useAi from 'src/hooks/useAi';
import OAiModelSelectBtn from 'components/ai/OAiModelSelectBtn.vue';
import { UUID } from 'core/utils/crypto'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  tag: {
    type: String,
    default: ''
  },
  enableUpload: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['send', 'stop', 'expand']);

const { localModels } = useAi();
const input = ref();
const reasoning = ref(false);
const expanded = ref(false);

const localDefaultModel = computed(() => {
  return localModels.value['chat'] || {}
})

function onToggleExpand() {
  expanded.value = !expanded.value;
  emit('expand', expanded.value);
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

  emit('send', {
    id: UUID(),
    message: message,
    modelProvider: localDefaultModel.value.provider,
    modelType: localDefaultModel.value.modelType,
    modelName: localDefaultModel.value.modelName,
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
.o-assistant-chat {
  margin: 0;
  padding: 8px;

  .card-content {
    padding: 10px;
  }

  .q-field {
    .q-field__native {
      max-height: 400px;
      padding: 8px 4px;
    }
  }

  .q-chip {
    box-shadow: none!important;
  }

  .q-btn {
    min-width: unset;
    min-height: unset;
    width: 36px;
    height: 36px;
    padding: 4px;
    border-radius: 8px;
    .q-icon {
      font-size: 1.7rem;
    }
    .o-icon {
      width: 1.6rem !important;
      height: 1.6rem !important;
      margin: 0 !important;
    }

    &:not(:last-child) {
      margin-right: 8px;
    }

    &.send {
      width: unset;
    }

    &.bg-primary {
      color: var(--q-primary) !important;
      background: transparent!important;

      &:before {
        background: var(--q-primary) !important;
        opacity: 0.1;
      }
    }
  }

  .q-btn-group {
    border-radius: 8px;
    .q-btn {
      width: unset;
      margin: 0;

      &:first-child {
        min-width: 80px;
        padding: 0 20px 0 10px;
      }
    }
  }
}
</style>
