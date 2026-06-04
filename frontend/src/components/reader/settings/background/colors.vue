<template>
  <q-list class="background-colors">
    <section class="images-container pi-view-grid">
      <template v-for="(item, index) in themedList" :key="index">
        <div @click="onBackgroundColor(item)">
          <q-responsive :ratio="16/9">
            <q-card class="cover-item none"
                    :style="`background: ${item.background}`"
                    flat v-ripple>
              <q-icon name="block" size="3rem" class="text-tips" v-if="item.value === 'none'" />
              <q-icon name="check" size="1.6rem" class="selected"
                      v-if="item.background === backgroundColor" />
            </q-card>
          </q-responsive>

          <div class="row col-12 justify-between items-center">
            <div class="col text-bold ellipsis">
              {{item.label}}
            </div>
          </div>
        </div>
      </template>
    </section>
  </q-list>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import useReaderSetting from 'src/hooks/useReaderSetting'
import useCommon from 'core/hooks/useCommon'
import useSetting from 'core/hooks/useSetting'

const emit = defineEmits(['close'])

const { t } = useCommon()
const { theme, darkMode } = useSetting()
const { settings, setSettingItem } = useReaderSetting()

const list = computed(() => {
  return [
    {
      label: 'None',
      value: 'none',
      theme: 'none',
      background: '',
    },
    {
      label: t('appearances.colors.blue'),
      value: 'blue',
      theme: 'light',
      background: 'linear-gradient(to bottom, #B8D6FF 10%, transparent 100%)',
    },
    {
      label: t('appearances.colors.yellow'),
      value: 'yellow',
      theme: 'light',
      background: 'linear-gradient(to bottom, #F2DFB3 10%, transparent 100%)',
    },
    {
      label: t('appearances.colors.green'),
      value: 'green',
      theme: 'light',
      background: 'linear-gradient(to bottom, #97CDA1 10%, transparent 100%)',
    },
    {
      label: t('appearances.colors.blue'),
      value: 'dark-blue',
      theme: 'dark',
      background: 'radial-gradient(\n' +
        '    circle at center,\n' +
        '    rgba(184, 214, 255, 0.45) 0%,\n' +
        '    rgba(95, 115, 145, 0.6) 55%,\n' +
        '    rgba(25, 32, 45, 0.85) 85%,\n' +
        '    rgba(0, 0, 0, 1) 100%\n' +
        '  )',
    },
    {
      label: t('appearances.colors.yellow'),
      value: 'dark-yellow',
      theme: 'dark',
      background: 'radial-gradient(\n' +
        '    circle at center,\n' +
        '    rgba(242, 223, 179, 0.45) 0%,\n' +
        '    rgba(140, 125, 95, 0.6) 55%,\n' +
        '    rgba(40, 35, 25, 0.85) 85%,\n' +
        '    rgba(0, 0, 0, 1) 100%\n' +
        '  )',
    },
    {
      label: t('appearances.colors.green'),
      value: 'dark-green',
      theme: 'dark',
      background: 'radial-gradient(\n' +
        '    circle at center,\n' +
        '    rgba(151, 205, 161, 0.45) 0%,\n' +
        '    rgba(80, 115, 87, 0.6) 55%,\n' +
        '    rgba(25, 40, 29, 0.85) 85%,\n' +
        '    rgba(0, 0, 0, 1) 100%\n' +
        '  )',
    },
  ]
})

const themedList = computed(() => {
  const themeName = darkMode.value ? 'dark' : 'light'
  return list.value.filter(item => ['none', themeName].includes(item.theme))
})

const backgroundColor = computed(() => settings.value.backgroundColor)

const onBackgroundColor = async (item: Indexable) => {
  let fontColor = item.theme === 'dark' ? '#e9e9e9' : '#262626'
  if (item.theme === 'none') {
    switch (theme.value.name) {
      case 'light':
        fontColor = '#000000'
        break
      case 'dark':
        fontColor = '#f2f2f7'
        break
      case 'darkBlue':
        fontColor = '#E2E2F0'
        break
    }
  }

  setSettingItem('fontColor', fontColor)
  setSettingItem('backgroundColor', item.background)
}

onBeforeMount(() => {
  //
})
</script>

<style lang="scss">
.background-colors {
  .cover-item {}
}
</style>
