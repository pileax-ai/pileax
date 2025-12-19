<template>
  <setting-tab :title="$t('appearances.background._')"  @close="emit('close')">
    <q-list>
      <q-item-label class="text-readable">
        {{ $t('appearances.background.image') }}
      </q-item-label>
      <template v-for="(item, index) in list" :key="index">
        <q-item class="bg-accent" clickable
                @click="onBackgroundImage(item)">
          <q-item-section avatar>
            <q-avatar rounded>
              <q-icon :name="item.icon" size="3rem" class="text-tips" v-if="item.icon" />
              <q-img :src="item.url.indexOf('http') === 0 ? item.url : $public(item.url)" v-else />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">
              {{ item.label }}
            </q-item-label>
            <q-item-label caption>
              {{ $t(`appearances.themes.${item.theme}`) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row">
              <q-btn icon="radio_button_checked" color="primary" size="12px"
                     flat round
                     v-if="item.url === backgroundImageUrl" />
            </div>
          </q-item-section>
        </q-item>
      </template>

    </q-list>

    <q-separator class="bg-accent" />
    <q-list>
      <q-item-label class="text-readable">
        {{ $t('appearances.background.blur') }}
      </q-item-label>
      <o-field-label content-class="col-8">
        <q-slider v-model="backgroundBlur"
                  :min="0" :max="200" :step="1"
                  :label-value="`${backgroundBlur}`"
                  label
                  label-always
                  track-size="5px"
                  @update:modelValue="onValueChanged('backgroundBlur', $event)" />
      </o-field-label>
    </q-list>
  </setting-tab>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import SettingTab from 'components/reader/settings/setting-tab.vue'
import useReaderSetting from 'src/hooks/useReaderSetting'
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'
import useCommon from 'core/hooks/useCommon'

const emit = defineEmits(['close'])

const { t, publicPath } = useCommon()
const { settings, setSettingItem } = useReaderSetting()
const backgroundBlur = ref(0)

const list = computed(() => {
  return [
    {
      label: 'None',
      value: 'google',
      icon: 'block',
      theme: 'none',
      url: '',
    },
    {
      label: t('reading.setting.background.bubbleNebula'),
      value: 'bubble_nebula',
      icon: '',
      theme: 'dark',
      url: '/images/book/dark-bubble_nebula.jpg',
    },
    {
      label: t('reading.setting.background.pillarsCreation'),
      value: 'pillars_of_creation',
      icon: '',
      theme: 'dark',
      url: '/images/book/dark-pillars_of_creation.jpg',
    },
    {
      label: t('reading.setting.background.willowBank'),
      value: 'willow_bank',
      icon: '',
      theme: 'light',
      url: '/images/book/light-willow_bank.jpg',
    },
    {
      label: t('reading.setting.background.oldBook'),
      value: 'old_book',
      icon: '',
      theme: 'light',
      url: '/images/book/light-old_book.png',
    },
  ]
})

const backgroundImageUrl = computed(() => settings.value.backgroundImageUrl)

const onBackgroundImage = async (item: Indexable) => {
  const imagePath = await publicPath(item.url)
  console.log('imagePath', imagePath)

  setSettingItem('backgroundImage', imagePath)
  setSettingItem('backgroundImageUrl', item.url)
  const fontColor = item.theme === 'dark' ? '#e9e9e9' : '#262626'
  setSettingItem('fontColor', fontColor)
}

const onValueChanged = (key: string, value: any) => {
  setSettingItem(key, value)
}

onBeforeMount(() => {
  backgroundBlur.value = settings.value.backgroundBlur || 0
})
</script>

<style lang="scss">

</style>
