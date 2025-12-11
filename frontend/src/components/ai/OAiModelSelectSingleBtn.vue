<template>
  <o-menu-btn class="text-tips bg-accent"
              menu-class="pi-menu show-side-icon"
              self="top left"
              anchor="bottom left"
              min-width="360px"
              flat>
    <template #label>
      <slot name="label" />
      <template v-if="defaultModel?.id">
        <o-icon :name="`icon-${defaultModel.logo}`" />
      </template>
      <template v-else>{{ label }}</template>
      <slot></slot>
    </template>

    <template #menu>
      <template v-if="typeModels.length">
        <template v-for="(item, index) in typeModels" :key="index">
          <o-common-item :icon="`icon-${item.logo}`"
                         :label="item.llm_name"
                         @click="onSelect(item)"
                         right-side clickable closable>
            <template #label>
              <template v-for="(tag, index) in item.tags.split(',')" :key="index">
                <q-chip size="10px" dense square v-if="tag">{{tag}}</q-chip>
              </template>
            </template>
            <template #side>
              <q-icon name="check_circle" color="primary"
                      v-if="item.llm_name === defaultModel.modelName
                    && item.provider === defaultModel.provider" />
            </template>
          </o-common-item>
        </template>
      </template>
      <o-no-data image v-else />
    </template>
  </o-menu-btn>
</template>

<script setup lang="ts">
import type { PropType} from 'vue';
import { computed, onMounted, ref } from 'vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import ONoData from 'core/components/misc/ONoData.vue'
import { providerModelService, pdmService } from 'src/api/service/remote';
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
});
const emit = defineEmits(['selected']);

const { defaultModels, updateLocalDefaultModels } = useAi();
const typeModels = ref<Indexable[]>([])

const defaultModel = computed(() => {
  const dm = defaultModels.value.find(m => m.modelType === props.type) || {}
  const m = typeModels.value.find(m => m.llm_name === dm.modelName && m.provider === dm.provider) || {}
  return {
    ...m,
    ...dm
  }
})

const onSelect = (item: Indexable) => {
  const body = {
    provider: item.provider,
    modelName: item.llm_name,
    modelType: item.model_type
  }
  pdmService.save(body).then(res => {
    notifyDone()
    updateLocalDefaultModels(res)
  })
}

const initData = async () => {
  try {
    typeModels.value = await providerModelService.findByType(props.type)
  } catch (err) {
    //
  }
}


onMounted(() => {
  initData()
})
</script>

<style lang="scss">
.o-ai-model-select-btn {
}
</style>
