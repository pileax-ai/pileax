<template>
  <section class="typography-settings">
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
    <o-field-label :label="$t('appearances.typography.lineSpacing')"
                   content-class="col" side>
      <q-slider v-model="spacing"
                :min="1" :max="3" :step="0.1"
                :label-value="`${spacing}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('spacing', $event)" />
    </o-field-label>
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
    <o-field-label :label="$t('appearances.typography.textIndent')"
                   content-class="col" side>
      <q-slider v-model="textIndent"
                :min="0" :max="10" :step="1"
                :label-value="`${textIndent}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('textIndent', $event)" />
    </o-field-label>
  </section>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'

import useReaderSetting from 'src/hooks/useReaderSetting'

const { settings, setSettingItem } = useReaderSetting()
const letterSpacing = ref(0)
const spacing = ref(0)
const paragraphSpacing = ref(0)
const textIndent = ref(0)

function onValueChanged(key: string, value: any) {
  setSettingItem(key, value)
}

onBeforeMount(() => {
  letterSpacing.value = settings.value.letterSpacing || 0
  spacing.value = settings.value.spacing || 1.7
  paragraphSpacing.value = settings.value.paragraphSpacing || 0
  textIndent.value = settings.value.textIndent || 0
})
</script>

<style lang="scss">
.typography-settings {
}
</style>
