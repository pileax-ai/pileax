<template>
  <section class="typography-settings">
    <o-field-label :label="$t('appearances.typography.letterSpacing')"
                   content-class="col" side>
      <q-slider v-model="letterSpacing"
                :min="0" :max="10" :step="1"
                :label-value="`${letterSpacing}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('letterSpacing', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.typography.lineSpacing')"
                   content-class="col" side>
      <q-slider v-model="spacing"
                :min="1" :max="2" :step="0.1"
                :label-value="`${spacing}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('spacing', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.typography.paragraphSpacing')"
                   content-class="col"
                   side>
      <q-slider v-model="paragraphSpacing"
                :min="0" :max="2" :step="0.1"
                :label-value="`${paragraphSpacing}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('paragraphSpacing', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.typography.margin')"
                   content-class="col" side>
      <q-slider v-model="sideMargin"
                :min="1" :max="10" :step="1"
                :label-value="`${sideMargin}%`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('sideMargin', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.typography.pageWidth')"
                   content-class="col" side>
      <q-slider v-model="maxInlineSize"
                :min="720" :max="1440" :step="10"
                :label-value="`${maxInlineSize}px`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('maxInlineSize', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.typography.zoom')"
                   content-class="col" side v-if="false">
      <q-slider v-model="zoom"
                :min="0.5" :max="4" :step="0.1"
                :label-value="`${parseInt(`${zoom * 100}`)}%`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('zoom', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.typography.zoom')" side>
      <q-select v-model="zoom"
                :options="zoomOptions"
                map-options emit-value
                outlined dense
                @update:modelValue="onValueChanged('zoom', $event)" />
    </o-field-label>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'

import useCommon from 'core/hooks/useCommon'
import useReaderSetting from 'src/hooks/useReaderSetting'
const { t } = useCommon()
const { settings, setSettingItem } = useReaderSetting()

const letterSpacing = ref(0)
const spacing = ref(0)
const paragraphSpacing = ref(0)
const sideMargin = ref(0)
const maxInlineSize = ref(720)
const zoom = ref('fit-page')

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

onBeforeMount(() => {
  letterSpacing.value = settings.value.letterSpacing || 0
  spacing.value = settings.value.spacing || 1.7
  paragraphSpacing.value = settings.value.paragraphSpacing || 0
  sideMargin.value = settings.value.sideMargin || 0
  maxInlineSize.value = settings.value.maxInlineSize || 720
  zoom.value = settings.value.zoom || 'fit-page'
})
</script>

<style lang="scss">
.typography-settings {
  .o-field-label {
    margin-top: 24px;

    .label {
      width: 100px;
    }

    .side {
      padding-left: 10px;
      max-width: 80%;
    }
  }
}
</style>
