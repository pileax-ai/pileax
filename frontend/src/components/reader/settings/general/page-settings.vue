<template>
  <section class="page-settings">
    <o-field-label :label="$t('appearances.page.margin')"
                   content-class="col" side v-if="!fixedLayout">
      <q-slider v-model="margin"
                :min="0" :max="80" :step="1"
                :label-value="`${margin}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('margin', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.page.verticalMargin')"
                   content-class="col" side>
      <q-slider v-model="verticalMargin"
                :min="0" :max="80" :step="1"
                :label-value="`${verticalMargin}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('verticalMargin', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.page.horizontalMargin')"
                   content-class="col" side v-if="!fixedLayout">
      <q-slider v-model="horizontalMargin"
                :min="0" :max="80" :step="1"
                :label-value="`${horizontalMargin}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('horizontalMargin', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.page.maxColumnCount')"
                   content-class="col" side>
      <q-slider v-model="maxColumnCount"
                :min="1" :max="fixedLayout ? 2 : 4" :step="1"
                :label-value="`${maxColumnCount}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('maxColumnCount', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.page.columnGap')"
                   content-class="col" side v-if="!fixedLayout">
      <q-slider v-model="columnGap"
                :min="0" :max="20" :step="1"
                :label-value="`${columnGap}%`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('columnGap', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.page.pageWidth')"
                   content-class="col" side v-if="!fixedLayout">
      <q-slider v-model="maxInlineSize"
                :min="720" :max="1440" :step="10"
                :label-value="`${maxInlineSize}px`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('maxInlineSize', $event)" />
    </o-field-label>
    <o-field-label :label="$t('reading.setting.pageTurningMode')" side>
      <q-select v-model="pageTurnStyle"
                :options="turnStyles"
                map-options emit-value
                outlined dense
                :menu-offset="[0, 6]"
                @update:modelValue="onPageTurningChanged" />
    </o-field-label>
    <o-field-label :label="$t('appearances.page.zoom')" side v-if="fixedLayout">
      <q-select v-model="zoom"
                :options="zoomOptions"
                map-options emit-value
                outlined dense
                :menu-offset="[0, 6]"
                @update:modelValue="onValueChanged('zoom', $event)" />
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
const pageTurnStyle = ref('slide')
const zoom = ref('fit-width')


const turnStyles = computed(() => {
  return [
    { label: t('reading.setting.slide'), value: 'slide', icon: 'public' },
    { label: t('reading.setting.scroll'), value: 'scroll', icon: 'public' },
  ]
})

const zoomOptions = computed(() => {
  return [
    { label: '50%', value: '0.5' },
    { label: '100%', value: '1' },
    { label: '125%', value: '1.25' },
    { label: '150%', value: '1.5' },
    { label: '175%', value: '1.75' },
    { label: '200%', value: '2' },
    { label: '300%', value: '3' },
    { label: '400%', value: '4' },
    { label: '800%', value: '8' },
    { label: '1000%', value: '10' },
    { label: t('appearances.typography.fitWidth'), value: 'fit-width' },
    { label: t('appearances.typography.fitPage'), value: 'fit-page' },
  ]
})

function onValueChanged(key: string, value: any) {
  setSettingItem(key, value)
}

function onPageTurningChanged(value: any) {
  setManual(BookOperation.Load)
  setSettingItem('pageTurnStyle', value)

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
  pageTurnStyle.value = settings.value.pageTurnStyle || 'slide'
  zoom.value = settings.value.zoom || 'fit-page'
})
</script>

<style lang="scss">
.page-settings {
}
</style>
