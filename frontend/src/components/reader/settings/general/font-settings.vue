<template>
  <section class="font-settings">
    <o-view-item :label="$t('appearances.font.family')"
                 :value="fontFamily" class="col-12"
                 align="right" arrow clickable
                 @click="emit('next', 'font')" />
    <o-view-item :label="$t('appearances.font.color')"
                 class="col-12 q-mb-md"
                 align="right" arrow clickable>
      <q-menu :offset="[0, 2]">
        <setting-view icon="palette" :label="$t('appearances.font.color')">
          <o-color-board :active-color="settings.fontColor"
                         @select="onValueChanged('fontColor', $event)"
                         default-disabled />
        </setting-view>
      </q-menu>
    </o-view-item>
    <o-field-label :label="$t('appearances.font.size')"
                   content-class="col-8" side>
      <q-slider v-model="fontSize"
                :min="1" :max="2" :step="0.1"
                :label-value="`${fontSize}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('fontSize', $event)" />
    </o-field-label>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { OColorBoard } from '@yiitap/vue'

import useReaderSetting from 'src/hooks/useReaderSetting'
const { settings, setSettingItem } = useReaderSetting()
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'
import SettingView from 'components/reader/settings/setting-view.vue'
import useCommon from 'core/hooks/useCommon'

const emit = defineEmits(['next'])

const { t } = useCommon()
const fontSize = ref(1.2)
const fontFamily = computed(() => {
  return settings.value.font === 'custom'
    ? settings.value.fontName
    :  t(`reading.setting.font.${settings.value.font}`)
})

function onValueChanged(key: string, value: any) {
  setSettingItem(key, value)
}

onBeforeMount(() => {
  fontSize.value = settings.value.fontSize || 1.2
})
</script>

<style lang="scss">
.font-settings {
}
</style>
