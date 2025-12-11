<template>
  <q-btn class="o-ai-provider-select-btn"
         :icon-right="iconRight"
         flat>
    <template v-if="single">
      <o-svg-icon :name="provider.name" size="1.8rem" v-if="provider.title" />
      <q-icon name="mdi-creation" v-else />
      <slot></slot>
    </template>
    <template v-else>
      <div class="row">
        <o-svg-icon :name="provider.name" size="1.8rem" class="q-mr-sm" v-if="provider.title" />
        <q-icon name="mdi-creation" class="q-mr-sm" v-else />
        {{ provider.title || 'AI Provider' }}
      </div>
      <q-space />
    </template>
    <q-menu v-model="menu"
            :anchor="anchor"
            :self="self"
            :offset="offset">
      <o-ai-provider-search @select="onSelect" :enabled-only="enabledOnly" />
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { computed, onMounted, ref } from 'vue'
import OAiProviderSearch from 'components/ai/OAiProviderSearch.vue'
import useAi from 'src/hooks/useAi'

const props = defineProps({
  single: {
    type: Boolean,
    default: false
  },
  enabledOnly: {
    type: Boolean,
    default: false
  },
  persist: {
    type: Boolean,
    default: false
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
})
const emit = defineEmits(['select'])
const { aiStore, provider } = useAi()

const menu = ref(false)
const iconRight = computed(() => {
  return props.single ? 'none' : 'mdi-chevron-down'
})

function onSelect(value: Indexable) {
  menu.value = false
  if (props.persist) {
    aiStore.value.setProvider(value)
  }

  emit('select', value)
}

onMounted(() => {
  //
})
</script>

<style lang="scss">
.o-ai-provider-select-btn {
}
</style>
