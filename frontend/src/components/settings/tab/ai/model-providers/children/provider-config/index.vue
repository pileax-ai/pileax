<template>
  <component :is="component"
             :id="id"
             :data="data"
             @success="emit('success')" />
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'

import CommonProviderConfig from './CommonProviderConfig.vue'
import NewApiProviderConfig from './NewApiProviderConfig.vue'
import OllamaProviderConfig from './OllamaProviderConfig.vue'
import VolcEngineProviderConfig from './VolcEngineProviderConfig.vue'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  data: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})
const emit = defineEmits(['success'])

const component = computed(() => {
  switch (props.data.name) {
    case 'NewAPI':
      return NewApiProviderConfig
    case 'Ollama':
      return OllamaProviderConfig
    case 'VolcEngine':
      return VolcEngineProviderConfig
    default:
      return CommonProviderConfig
  }
})
</script>

<style lang="scss">

</style>
