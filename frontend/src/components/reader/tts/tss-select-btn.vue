<template>
  <o-menu-btn class="text-tips"
              menu-class="pi-menu show-side-icon"
              :anchor="anchor"
              :self="self"
              :min-width="minWidth"
              flat stack>
    <template #label>
      <slot name="label" />
      <template v-if="defaultModel?.id">
        <o-icon :name="`icon-${defaultModel.logo}`" />
      </template>
      <template v-else>{{ label }}</template>
      <slot></slot>
    </template>

    <template #menu>
      <template v-for="(item, index) in options" :key="index">
        <o-common-item v-bind="item"
                       @click="onSelect(item)"
                       right-side clickable closable>
          <template #side>
            <q-icon name="check_circle" color="primary" />
          </template>
        </o-common-item>
      </template>
    </template>
  </o-menu-btn>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref } from 'vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import ONoData from 'core/components/misc/ONoData.vue'
import { providerModelService, tdmService } from 'src/api/service/remote';
import { notifyDone } from 'core/utils/control'
import useAi from 'src/hooks/useAi'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
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
      return [0, 4];
    }
  },
  minWidth: {
    type: String,
    default: '360px'
  },
});
const emit = defineEmits(['selected']);

const options = computed(() => {
  return [
    { label: 'Edge', value: 'edge' },
    { label: 'System', value: 'browser' },
  ]
})

const onSelect = (item: Indexable) => {
  const body = {
    provider: item.provider,
    modelName: item.llm_name,
    modelType: item.model_type
  }
  tdmService.save(body).then(res => {
    notifyDone()
    updateLocalDefaultModels(res)
  })
}
</script>

<style lang="scss">
.o-ai-model-select-btn {
}
</style>
