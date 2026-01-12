<template>
  <o-common-card class="chat-input-card" accent>
    <header class="row col-12 justify-between items-center">
      <div class="menu">
        <q-btn icon="mdi-creation"
               class="text-tips bg-accent"
               flat round dense>
          <slot name="menu" />
        </q-btn>
      </div>
      <div class="tag" v-if="tag">
        <o-chip color="blue" dense>@{{ tag }}</o-chip>
      </div>
    </header>
    <q-input ref="inputRef"
             v-model="input"
             :placeholder="$t('chat.sendMessage')"
             autogrow
             borderless
             autofocus
             @keydown="onKeydown" />
    <div class="row justify-between">
      <div class="row items-end">
        <o-ai-model-select-btn type="chat" single icon-only local round>
          <o-tooltip position="left" transition>
            AI Model
          </o-tooltip>
        </o-ai-model-select-btn>
      </div>
      <div>
        <q-btn icon="add" class="bg-dark" flat round v-if="enableUpload">
          <o-tooltip position="top" transition>
            <div class="title">{{ $t('chat.fileUpload') }}</div>
            <div class="caption">{{ $t('chat.fileUploadTips') }}</div>
          </o-tooltip>
        </q-btn>
        <q-btn icon="stop"
               class="bg-primary text-white"
               flat round
               @click="onStop"
               v-if="loading">
          <o-tooltip position="top" transition>
            {{ $t('chat.stopGeneration') }}
          </o-tooltip>
        </q-btn>
        <q-btn icon="arrow_upward"
               :disable="!input"
               :class="`bg-${input ? 'primary' : 'dark'} text-${input ? 'white' : 'tips'}`"
               flat round
               @click="onSend" v-else>
          <o-tooltip position="top" transition>
            <div class="title">{{ $t('chat.send') }}</div>
          </o-tooltip>
        </q-btn>
      </div>
    </div>

    <slot></slot>
  </o-common-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChatInput } from 'src/types/chat'
import useAi from 'src/hooks/useAi'
import OAiModelSelectBtn from 'components/ai/OAiModelSelectBtn.vue'
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
const emit = defineEmits(['send', 'stop'])

const { localModels } = useAi()
const input = ref()
const reasoning = ref(false)

const localDefaultModel = computed(() => {
  return localModels.value['chat'] || {}
})

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
    event.preventDefault()
    onSend()
  }
}

function onSend() {
  const message = input.value ? input.value.trim() : ''
  if (message === '') return

  emit('send', {
    id: UUID(),
    message: message,
    modelProvider: localDefaultModel.value.provider,
    modelType: localDefaultModel.value.modelType,
    modelName: localDefaultModel.value.modelName,
  } as ChatInput)

  reset()
}

function onStop() {
  emit('stop')
}

function reset() {
  input.value = ''
}
</script>

<style lang="scss">
.chat-input-card {
  margin: 0;
  //padding: 10px;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;

  textarea {
    height: 52px !important;
    padding-top: 0 !important;
  }

  .card-content {
    padding: 6px 10px 10px 10px;

    .menu {
      .q-icon {
        font-size: 1.2rem;
      }
    }
  }

  .q-field {
    .q-field__native {
      max-height: 400px;
    }
  }

  .q-chip {
    box-shadow: none!important;
  }

  .q-btn {
    min-width: 36px;
    min-height: 36px;

    &:not(:first-child) {
      margin-left: 4px;
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

  .tag {
    //position: absolute;
    //right: 12px;
    //top: 4px;
  }
}
</style>
