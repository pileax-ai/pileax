<template>
  <setting-tab :title="$t('appearances.font.family')"
               @close="emit('close')">
    <q-list>
      <template v-for="(item, index) in fontOptions" :key="index">
        <q-item class="bg-accent" clickable
                @click="onFont(item)">
          <q-item-section avatar>
            <q-avatar rounded>
              <o-icon :name="item.icon" size="2rem" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">
              {{item.label}}
            </q-item-label>
            <q-item-label caption>
              {{ $t(item.type) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <span v-if="item.value === 'custom' && settings.font === 'custom'">{{settings.fontName}}</span>
              <q-btn icon="radio_button_checked" color="primary" size="12px"
                     flat round
                     v-if="item.value === settings.font" />
              <q-btn icon="download" color="primary" size="12px" flat round v-if="item.type === 'download'" />
            </div>
          </q-item-section>

          <o-context-menu :list="fonts"
                          :offset="[0, 4]"
                          anchor="bottom left"
                          self="top left"
                          @command="onCustomFont"
                          v-if="item.value === 'custom'" />
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
import OContextMenu from 'core/components/menu/OContextMenu.vue'
const emit = defineEmits(['close'])

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
      icon: 'mdi-format-font',
      type: 'system',
    },
    // {
    //   label: t('download'),
    //   value: 'download',
    //   family: '',
    //   icon: 'font_download',
    //   type: 'download',
    // },
  ]
})

const fonts = computed(() => {
  return [
    { label: 'Arial', value: 'Arial' },
    { label: 'Arial Black', value: 'Arial Black' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Tahoma', value: 'Tahoma' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Courier New', value: 'Courier New', separator: true },
    { label: 'Monaco', value: 'Monaco' },
    { label: 'Monospace', value: 'monospace' },
  ].map(e => ({
    ...e,
    active: settings.value.fontName === e.value,
    style: { fontFamily: e.value }
  }))
})

const onFont = (item: Indexable) => {
  if (item.value === 'custom') {
    return
  }
  setSettingItem('font', item.value)
  setSettingItem('fontName', item.family)
}

const onCustomFont = (item: Indexable) => {
  setSettingItem('font', 'custom')
  setSettingItem('fontName', item.value)
}
</script>

<style lang="scss">

</style>
