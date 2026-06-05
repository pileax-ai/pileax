<template>
  <section class="font-settings">
    <o-view-item :label="$t('appearances.font.family')"
                 :value="fontFamily" class="col-12"
                 align="right" arrow clickable
                 @click="emit('next', 'font')" />
    <o-field-label :label="$t('appearances.font.size')"
                   content-class="col" side>
      <q-slider v-model="fontSize"
                :min="16" :max="50" :step="1"
                :label-value="`${fontSize}px`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('fontSize', $event)" />
    </o-field-label>
    <o-field-label :label="$t('appearances.font.weight')"
                   content-class="col" side>
      <q-slider v-model="fontWeight"
                :min="100" :max="900" :step="100"
                :label-value="`${fontWeight}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('fontWeight', $event)" />
    </o-field-label>
    <o-view-item :label="$t('appearances.font.color')"
                 class="col-12 q-mt-md"
                 align="right" arrow clickable right-side>
      <q-menu anchor="bottom right" self="top right" :offset="[0, 4]">
        <setting-view icon="palette" :label="$t('appearances.font.color')">
          <o-color-board :active-color="settings.fontColor"
                         @select="onValueChanged('fontColor', $event)"
                         default-disabled />
        </setting-view>
      </q-menu>

      <template #side>
        <div :style="{ width: '14px', height: '14px', background: settings.fontColor, borderRadius: '2px' }"></div>
      </template>
    </o-view-item>
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
import { stripQuotes } from 'core/utils/format'

const emit = defineEmits(['next'])

const { t } = useCommon()
const fontSize = ref(20)
const fontWeight = ref(400)

const fontFamily = computed(() => {
  const name = ['serif', 'sansSerif', 'mono', 'more', 'custom'].includes(settings.value.font)
    ? settings.value.fontName
    : t(`reading.setting.font.${settings.value.font}`)
  return stripQuotes(name)
})

function onValueChanged(key: string, value: any) {
  setSettingItem(key, value)
}

onBeforeMount(() => {
  fontSize.value = settings.value.fontSize || 20              // default: 20px
  fontSize.value = fontSize.value < 16 ? 22 : fontSize.value  // min: 16px
  fontWeight.value = settings.value.fontWeight || 400         // default: 400
})
</script>

<style lang="scss">
.font-settings {
}
</style>
