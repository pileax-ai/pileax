<template>
  <o-menu-btn class="text-tips"
              menu-class="pi-menu show-side-icon"
              :anchor="anchor"
              :self="self"
              :min-width="minWidth"
              flat stack>
    <template #label>
      <slot name="label" />
      <template v-if="provider">
        {{ provider.label }}
      </template>
      <template v-else>{{ label }}</template>
    </template>
    <slot></slot>

    <template #menu>
      <tts-option-view icon="graphic_eq" :label="$t('reading.tts.settings')">
        <o-ai-model-select-btn type="tts"
                               icon="mdi-creation"
                               class="expand"
                               :class="{ 'active': provider?.value === 'llm' }"
                               anchor="bottom middle"
                               self="top middle"
                               single local
                               @select="onSelectLLM">
          <template #icon>
            <span class="q-mr-md">LLM</span>
          </template>
          <o-tooltip position="left" transition>
            {{ $t('ai.providers.model.llm') }}
          </o-tooltip>
        </o-ai-model-select-btn>
        <template v-for="(item, index) in options" :key="index">
          <o-common-item v-bind="item"
                         :class="{ 'active': provider?.value === item.value }"
                         @click="onSelect(item)"
                         right-side clickable closable
                         v-if="item.show">
            <template #side>
              <q-icon name="check_circle" color="primary" v-if="provider?.value === item.value" />
            </template>
          </o-common-item>
        </template>
      </tts-option-view>
    </template>
  </o-menu-btn>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { computed } from 'vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import TtsOptionView from './tts-option-view.vue'
import OAiModelSelectBtn from 'components/ai/OAiModelSelectBtn.vue'
import useCommon from 'core/hooks/useCommon'
import useTTS from 'src/hooks/useTTS'
import useReaderSetting from 'src/hooks/useReaderSetting'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  anchor: {
    type: String as PropType<PositionType>,
    default: 'bottom left'
  },
  self: {
    type: String as PropType<PositionType>,
    default: 'top left'
  },
  offset: {
    type: Array as PropType<number[]>,
    default: () => {
      return [0, 4]
    }
  },
  minWidth: {
    type: String,
    default: '360px'
  },
})
const emit = defineEmits(['select'])

const { t } = useCommon()
const { tts } = useTTS()
const { setTTSModel } = useReaderSetting()

const options = computed(() => {
  return [
    { label: 'LLM', value: 'llm', show: false },
    { label: 'Edge', value: 'edge', show: true },
    { label: t('system'), value: 'browser', show: true },
  ] as Indexable[]
})

const provider = computed(() => {
  return options.value.find(o => o.value === tts.options.provider)
})

const onSelect = (item: Indexable) => {
  tts.setProvider(item.value)
  emit('select', item)
}

const onSelectLLM = (item: Indexable) => {
  console.log('llm', item)
  onSelect({ label: 'LLM', value: 'llm' })
  setTTSModel({
    modelProvider: item.provider,
    modelName: item.modelName,
    modelType: item.modelType
  })
}
</script>

<style lang="scss">
.tts-provider-btn-btn {
}

.tts-option-view {
  .o-common-item {
    padding: 8px 16px !important;
    margin-top: 4px !important;
  }
}
</style>
