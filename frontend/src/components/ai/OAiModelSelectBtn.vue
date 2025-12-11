<template>
  <o-menu-btn class="text-tips bg-accent"
              menu-class="pi-menu show-side-icon"
              min-width="360px"
              :anchor="anchor"
              :self="self"
              :dropdown="!iconOnly"
              :enable-hover="enableHover"
              :icon-only="iconOnly"
              flat
              @before-show="onBeforeShow">
    <template #icon>
      <o-icon :name="`icon-${defaultModel.logo}`" v-if="defaultModel?.logo" />
      <q-icon :name="icon" v-else-if="icon" />
    </template>
    <template #label>
      <slot name="label" />

      <template v-if="!iconOnly">
        <span v-if="defaultModel?.modelName">{{ defaultModel.modelName }}</span>
        <span v-else>{{ label }}</span>
      </template>
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
                      v-if="item.llm_name === defaultModel.modelName && item.provider === defaultModel.provider" />
            </template>
          </o-common-item>
        </template>
      </template>
      <o-no-data image v-else />
    </template>

    <slot></slot>
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
  type: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  models: {
    type: Array as PropType<Indexable[]>,
    default: () => {
      return [];
    }
  },
  single: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    required: false
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
  enableHover: {
    type: Boolean,
    required: false
  },
  local: {
    type: Boolean,
    required: false
  },
});
const emit = defineEmits(['selected']);

const {
  localModels,
  defaultModels,
  updateLocalDefaultModels,
  getLocalModel,
  setLocalModel
} = useAi();
const singleModels = ref<Indexable[]>([])

const typeModels = computed(() => {
  return props.single
    ? singleModels.value
    : props.models.filter(m => m.model_type === props.type)
})

const defaultModel = computed(() => {
  if (props.local && localDefaultModel.value) {
    return localDefaultModel.value
  } else {
    const dm = defaultModels.value.find(m => m.modelType === props.type) || {}
    const m = typeModels.value.find(m => m.llm_name === dm.modelName && m.provider === dm.provider) || {}
    return {
      ...m,
      ...dm,
    }
  }
})

const localDefaultModel = computed(() => {
  return localModels.value[props.type]
})

const onSelect = (item: Indexable) => {
  const body = {
    provider: item.provider,
    modelName: item.llm_name,
    modelType: item.model_type
  }
  if (props.local) {
    setLocalModel(props.type, {...body,
      logo: item.logo
    })
  } else {
    pdmService.save(body).then(res => {
      notifyDone()
      updateLocalDefaultModels(res)
    })
  }
}

const initData = async () => {
  if (props.single) {
    providerModelService.findByType(props.type).then(res => {
      singleModels.value = res
    })
  }
}

const onBeforeShow = () => {
  initData()
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss">
.o-ai-model-select-btn {
}
</style>
