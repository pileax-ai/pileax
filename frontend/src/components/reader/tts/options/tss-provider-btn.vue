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
      <tss-option-view icon="mdi-account-tie-voice-outline" label="TTS设置">
        <template v-for="(item, index) in options" :key="index">
          <o-common-item v-bind="item"
                         :class="{ 'active': provider?.value === item.value }"
                         @click="onSelect(item)"
                         right-side clickable closable>
            <template #side>
              <q-icon name="check_circle" color="primary" v-if="provider?.value === item.value" />
            </template>
          </o-common-item>
        </template>
      </tss-option-view>
    </template>
  </o-menu-btn>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { computed, onMounted, ref } from 'vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import TssOptionView from './tss-option-view.vue'
import useTTS from 'src/hooks/useTTS'

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

const { tts } = useTTS()

const options = computed(() => {
  return [
    { label: 'Edge', value: 'edge' },
    { label: 'System', value: 'browser' },
  ]
})

const provider = computed(() => {
  return options.value.find(o => o.value === tts.options.provider)
})

const onSelect = (item: Indexable) => {
  tts.setProvider(item.value)
  emit('select', item)
}
</script>

<style lang="scss">
.o-ai-model-select-btn {
}
</style>
