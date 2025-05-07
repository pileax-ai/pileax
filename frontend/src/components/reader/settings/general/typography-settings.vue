<template>
  <section class="typography-settings">
    <o-field-label label="字间距" content-class="col-8" side>
      <q-slider v-model="letterSpacing"
                :min="0" :max="10" :step="1"
                :label-value="`${letterSpacing}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('letterSpacing', $event)" />
    </o-field-label>
    <o-field-label label="行间距" content-class="col-8" side>
      <q-slider v-model="spacing"
                :min="1" :max="2" :step="0.1"
                :label-value="`${spacing}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('spacing', $event)" />
    </o-field-label>
    <o-field-label label="段间距" content-class="col-8" side>
      <q-slider v-model="paragraphSpacing"
                :min="0" :max="2" :step="0.1"
                :label-value="`${paragraphSpacing}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('paragraphSpacing', $event)" />
    </o-field-label>
    <o-field-label label="边距" content-class="col-8" side>
      <q-slider v-model="sideMargin"
                :min="1" :max="10" :step="1"
                :label-value="`${sideMargin}%`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('sideMargin', $event)" />
    </o-field-label>
    <o-field-label label="页宽" content-class="col-8" side>
      <q-slider v-model="maxInlineSize"
                :min="720" :max="1440" :step="10"
                :label-value="`${maxInlineSize}px`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('maxInlineSize', $event)" />
    </o-field-label>
  </section>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

import useReaderSetting from 'src/hooks/useReaderSetting';
const { settings, setSettingItem } = useReaderSetting();
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue';

const letterSpacing = ref(0);
const spacing = ref(0);
const paragraphSpacing = ref(0);
const sideMargin = ref(0);
const maxInlineSize = ref(720);

function onValueChanged(key: string, value: any) {
  setSettingItem(key, value);
}

onBeforeMount(() => {
  letterSpacing.value = settings.value.letterSpacing || 0;
  spacing.value = settings.value.spacing || 1.7;
  paragraphSpacing.value = settings.value.paragraphSpacing || 0;
  sideMargin.value = settings.value.sideMargin || 0;
  maxInlineSize.value = settings.value.maxInlineSize || 720;
})
</script>

<style lang="scss">
.typography-settings {

}
</style>
