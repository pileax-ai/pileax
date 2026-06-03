<template>
  <setting-tab :title="$t('reading.setting.font.download')"
               @close="emit('close')">
    <q-list>
      <template v-for="(item, index) in fontOptions" :key="index">
        <q-item class="bg-accent" clickable
                @click="onFont(item)">
          <q-item-section avatar>
            <q-avatar rounded>
              <span :style="{ fontFamily: item.family }">
                A
              </span>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">
              {{item.label}}
            </q-item-label>
            <q-item-label caption>
              {{ item.type === 'custom' ? $t('reading.setting.font.custom') : $t(item.type) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <template v-if="item.value === settings.font">
                <span v-if="['serif', 'sansSerif', 'mono', 'custom'].includes(item.value)">{{settings.fontName}}</span>
                <q-btn icon="radio_button_checked" color="primary" size="12px"
                       flat round />
              </template>

              <q-btn color="primary" size="12px" flat round
                     @click="emit('next', 'font-download')"
                     v-if="item.type === 'custom'">
                <o-icon name="icon-download" size="1.6rem" />
              </q-btn>
            </div>
          </q-item-section>

          <o-menu class="pi-menu" :offset="[0, 4]"
                  anchor="bottom left"
                  self="top left"
                  v-if="['serif', 'sansSerif', 'mono', 'custom'].includes(item.value)">
            <template v-if="getFonts(item.value).length > 0">
              <template v-for="(font, index) in getFonts(item.value)" :key="index">
                <o-common-item clickable closable
                               v-bind="font"
                               @click="onCustomFont(item.value, font)" />
              </template>
            </template>
            <o-no-data image v-else />
          </o-menu>
        </q-item>
      </template>
    </q-list>
  </setting-tab>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SettingTab from 'components/reader/settings/setting-tab.vue'
import useCommon from 'core/hooks/useCommon'
import useReaderSetting from 'src/hooks/useReaderSetting'
import OMenu from 'core/components/menu/OMenu.vue'
const emit = defineEmits(['close', 'next'])

const { t } = useCommon()
const { settings, setSettingItem } = useReaderSetting()

const fontOptions = computed(() => {
  return [
    {
      label: t('reading.setting.font.book'),
      value: 'book',
      family: 'book',
      icon: 'mdi-format-font',
      type: 'system',
    },
    {
      label: t('reading.setting.font.system'),
      value: 'system',
      family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI',
      icon: 'mdi-format-font',
      type: 'system',
    },
    {
      label: t('reading.setting.font.serif'),
      value: 'serif',
      family: 'Lyon-Text, Georgia, "Songti SC", SimSun, serif',
      icon: 'mdi-format-font',
      type: 'system',
    },
    {
      label: t('reading.setting.font.sansSerif'),
      value: 'sansSerif',
      family: '',
      icon: 'mdi-format-font',
      type: 'system',
    },
    {
      label: t('reading.setting.font.mono'),
      value: 'mono',
      family: 'iawriter-mono, Nitti, Menlo, Courier, monospace',
      icon: 'mdi-format-font',
      type: 'system',
    },
    {
      label: t('reading.setting.font.custom'),
      value: 'custom',
      family: '',
      icon: 'font_download',
      type: 'custom',
    },
  ]
})

const getFonts = (type: string) => {
  let fonts: Indexable[] = []
  switch (type) {
    case 'serif':
      fonts = serifFonts.value
      break
    case 'sansSerif':
      fonts = sansSerifFonts.value
      break
    case 'mono':
      fonts = monoFonts.value
      break
  }

  return fonts.map(e => ({
    ...e,
    active: settings.value.fontName === e.value,
    style: { fontFamily: e.value }
  }))
}

const serifFonts = computed(() => {
  return [
    { label: 'KaiTi', value: 'KaiTi' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Songti SC', value: 'Songti SC' },
    { label: 'Times New Roman', value: 'Times New Roman' },
  ]
})

const sansSerifFonts = computed(() => {
  return [
    { label: 'Arial', value: 'Arial' },
    { label: 'Arial Black', value: 'Arial Black' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Heiti SC', value: 'Heiti SC' },
    { label: 'PingFang SC', value: 'PingFang SC' },
  ]
})

const monoFonts = computed(() => {
  return [
    { label: 'Consolas', value: 'Consolas' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Menlo', value: 'Menlo' },
    { label: 'Monaco', value: 'Monaco' },
    { label: 'Monospace', value: 'monospace' },
  ]
})

const onFont = (item: Indexable) => {
  if (['serif', 'sansSerif', 'mono', 'custom'].includes(item.value)) {
    return
  }
  setSettingItem('font', item.value)
  setSettingItem('fontName', item.family)
}

const onCustomFont = (type: string, item: Indexable) => {
  setSettingItem('font', type)
  setSettingItem('fontName', item.value)
}
</script>

<style lang="scss">

</style>
