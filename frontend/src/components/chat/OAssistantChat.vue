<template>
  <section class="column col-12 fit o-assistant-chat">
    <header class="row col-auto justify-between text-tips">
      <div class="row">
        <o-ai-provider-select-btn round single persist enabled-only>
          <o-tooltip position="left" transition>
            {{provider.title}}
          </o-tooltip>
        </o-ai-provider-select-btn>
        <q-btn icon="language" flat />
        <q-btn flat>
          <q-icon name="attachment" class="rotate-315" />
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
        <kbd>⌘</kbd> <kbd><q-icon name="keyboard_return" /></kbd> 发送，
        <kbd>⇧</kbd> <kbd><q-icon name="keyboard_return" /></kbd> 换行
      </div>
      <div>
        <q-btn icon="add" class="bg-dark" flat round v-if="enableUpload">
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

        <q-btn-group flat v-if="false">
          <q-btn icon="arrow_upward"
                 label="发送"
                 class="bg-accent send"
                 flat round
                 @click="onSend">
            <o-tooltip position="top" transition>
              <div class="title">发送</div>
              <div class="caption">发送消息，按<q-icon name="keyboard_return"/>直接发送</div>
            </o-tooltip>
          </q-btn>
        </q-btn-group>

        <q-btn-dropdown icon="arrow_upward"
                        label="发送"
                        class="bg-primary text-white"
                        content-class="pi-menu"
                        :menu-offset="[0, 4]"
                        split flat>
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
import { ref } from 'vue';
import { ChatInput } from 'src/types/chat';
import useAi from 'src/hooks/useAi';
import OAiProviderSelectBtn from 'components/ai/OAiProviderSelectBtn.vue';

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

const { provider } = useAi();
const input = ref();
const reasoning = ref(false);
const expanded = ref(false);

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
      width: 1.6rem;
      height: 1.6rem;
    }

    &:not(:last-child) {
      margin-right: 8px;
    }

    &.send {
      width: unset;
    }


    &.reasoning {
      padding: 0 16px 0 12px;
      min-height: 36px;

      .q-icon {
        margin-right: 2px;
      }
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

  .tag {
    position: absolute;
    right: 12px;
    top: 4px;
  }
}
</style>
