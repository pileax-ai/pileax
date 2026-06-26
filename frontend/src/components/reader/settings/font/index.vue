<template>
  <setting-tab :title="$t('appearances.font.family')"
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
                <span v-if="autoTypes.includes(item.value)">
                  {{ stripQuotes(settings.fontName) }}
                </span>
                <q-btn icon="radio_button_checked" color="primary" size="12px"
                       flat round />
              </template>

              <q-btn color="primary" size="12px" flat round
                     @click.stop="emit('next', 'font-download')"
                     v-if="item.type === 'custom'">
                <o-tooltip>{{$t('download')}}</o-tooltip>
                <o-icon name="icon-download" size="1.6rem" />
              </q-btn>
            </div>
          </q-item-section>

          <o-menu class="pi-menu" :offset="[0, 4]"
                  anchor="bottom left"
                  self="top left"
                  v-if="autoTypes.includes(item.value)">
            <template v-if="getFonts(item.value).length > 0">
              <template v-for="(font, index) in getFonts(item.value)" :key="index">
                <o-common-item clickable closable
                               v-bind="font"
                               right-side
                               @click="onCustomFont(item.value, font)">
                  <template #side>
                    <o-badge dense style="font-family: monospace;"
                             v-if="font.cjk">CJK</o-badge>
                  </template>
                </o-common-item>
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
import { computed, onMounted, ref } from 'vue'
import SettingTab from 'components/reader/settings/setting-tab.vue'
import useCommon from 'core/hooks/useCommon'
import useReaderSetting from 'src/hooks/useReaderSetting'
import OMenu from 'core/components/menu/OMenu.vue'
import { ipcProvider, ipcService } from 'src/api/ipc'
import { stripQuotes } from 'core/utils/format'
const emit = defineEmits(['close', 'next'])

const { t } = useCommon()
const { settings, setSettingItem } = useReaderSetting()
const fonts = ref<Indexable>({})

const autoTypes = ['serif', 'sansSerif', 'mono', 'more', 'custom']

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
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
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
      label: t('more'),
      value: 'more',
      family: 'iawriter-mono, Nitti, Menlo, Courier, monospace',
      icon: 'mdi-format-font',
      type: 'system',
    },
    // {
    //   label: t('reading.setting.font.custom'),
    //   value: 'custom',
    //   family: '',
    //   icon: 'font_download',
    //   type: 'custom',
    // },
  ]
})

const getFonts = (type: string) => {
  let result: Indexable[] = []
  switch (type) {
    case 'serif':
      result = fonts.value.serif || defaultFonts.value.serif
      break
    case 'sansSerif':
      result = fonts.value.sansSerif || defaultFonts.value.sansSerif
      break
    case 'mono':
      result = fonts.value.mono || defaultFonts.value.mono
      break
    case 'more':
      result = fonts.value.more || defaultFonts.value.mono
      break
  }

  return result.map(e => ({
    ...e,
    label: e.name,
    value: e.familyName,
    active: settings.value.fontName === e.familyName,
    style: { fontFamily: e.familyName }
  } as Indexable))
}

const defaultFonts = computed(() => {
  return {
    serif: [
      { name: 'FangSong', familyName: 'FangSong', cjk: true },
      { name: 'KaiTi', familyName: 'KaiTi', cjk: true },
      { name: 'Georgia', familyName: 'Georgia' },
      { name: 'Songti SC', familyName: 'Songti SC', cjk: true },
      { name: 'Times New Roman', familyName: 'Times New Roman' },
    ],
    sansSerif: [
      { name: 'Arial', familyName: 'Arial' },
      { name: 'Arial Black', familyName: 'Arial Black' },
      { name: 'Helvetica', familyName: 'Helvetica' },
      { name: 'Heiti SC', familyName: 'Heiti SC', cjk: true },
      { name: 'PingFang SC', familyName: 'PingFang SC', cjk: true },
      { name: 'Microsoft YaHei', familyName: 'Microsoft YaHei', cjk: true },
    ],
    mono: [
      { name: 'Consolas', familyName: 'Consolas' },
      { name: 'Courier New', familyName: 'Courier New' },
      { name: 'Menlo', familyName: 'Menlo' },
      { name: 'Monaco', familyName: 'Monaco' },
      { name: 'Monospace', familyName: 'monospace' },
    ]
  }
})

const onFont = (item: Indexable) => {
  if (autoTypes.includes(item.value)) {
    return
  }
  setSettingItem('font', item.value)
  setSettingItem('fontName', item.family)
}

const onCustomFont = (type: string, item: Indexable) => {
  setSettingItem('font', type)
  setSettingItem('fontName', item.value)
}

const getSystemFonts = async () => {
  if (ipcProvider === 'electron') {
    fonts.value = await ipcService.getSystemFonts()
  } else {
    fonts.value = defaultFonts.value
  }
}

onMounted(() => {
  getSystemFonts()
})
</script>

<style lang="scss">

</style>
