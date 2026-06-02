<template>
  <section class="pagination-settings">
    <o-field-label :label="$t('reading.setting.pagination.flow')" side>
      <q-select v-model="flow"
                :options="flows"
                map-options emit-value
                outlined dense
                :menu-offset="[0, 6]"
                @update:modelValue="onFlowChanged" />
    </o-field-label>
    <o-field-label :label="$t('reading.setting.pagination.animated')" side>
      <q-toggle v-model="animated"
                @update:modelValue="onValueChanged('animated', $event)" />
    </o-field-label>
    <o-field-label :label="$t('reading.setting.pagination.wheel')" side>
      <q-toggle v-model="wheelPageNavigation"
                @update:modelValue="onValueChanged('wheelPageNavigation', $event)" />
    </o-field-label>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'

import useCommon from 'core/hooks/useCommon'
import useReaderSetting from 'src/hooks/useReaderSetting'
import { setManual } from 'src/api/service/ebook/book'
import { BookOperation } from 'src/types/reading'
import { ipcService } from 'src/api/ipc'

const props = defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})

const { t } = useCommon()
const { settings, setSettingItem } = useReaderSetting()
const margin = ref(0)
const horizontalMargin = ref(0)
const verticalMargin = ref(0)
const maxColumnCount = ref(1)
const columnGap = ref(0)
const maxInlineSize = ref(720)
const flow = ref('paginated')
const animated = ref(false)
const wheelPageNavigation = ref(false)

const flows = computed(() => {
  return [
    { label: t('reading.setting.slide'), value: 'paginated', icon: 'public' },
    { label: t('reading.setting.scroll'), value: 'scrolled', icon: 'public' },
  ]
})


function onValueChanged(key: string, value: any) {
  setSettingItem(key, value)
}

function onFlowChanged(value: any) {
  setManual(BookOperation.Load)
  setSettingItem('flow', value)

  if (props.fixedLayout) {
    ipcService.reload(ipcService.windowId, true)
  }
}

onBeforeMount(() => {
  margin.value = settings.value.margin || 0
  horizontalMargin.value = settings.value.horizontalMargin || 0
  verticalMargin.value = settings.value.verticalMargin || 0
  maxColumnCount.value = settings.value.maxColumnCount || 1
  columnGap.value = settings.value.columnGap || 0
  maxInlineSize.value = settings.value.maxInlineSize || 720
  flow.value = settings.value.flow || 'paginated'
  animated.value = settings.value.animated || false
  wheelPageNavigation.value = settings.value.wheelPageNavigation || false
})
</script>

<style lang="scss">
.pagination-settings {
  .o-field-label {
    margin-top: 0 !important;
  }
}
</style>
