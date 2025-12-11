<template>
  <setting-tab title="字体" @close="emit('close')">
    <q-list>
      <template v-for="(item, index) in fonts" :key="index">
        <q-item class="bg-accent" clickable>
          <q-item-section avatar>
            <q-avatar rounded>
              <o-icon :name="item.icon" size="40px" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">
              {{item.label}}
            </q-item-label>
            <q-item-label caption>
              {{item.label}}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row">
              <q-btn icon="add" color="primary" size="12px" flat round />
              <q-btn icon="download" color="primary" size="12px" flat round />
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </setting-tab>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SettingTab from 'components/reader/settings/setting-tab.vue'
const emit = defineEmits(['close'])

const fonts = computed(() => {
  return [
    {
      label: "Google",
      value: "google",
      icon: "icon-google-color",
      type: "service",
      url: "https://www.google.com/search?q={word}",
    },
    {
      label: "Google Dictionary",
      value: "google_dictionary",
      icon: "icon-google-color",
      type: "service",
      url: "https://www.google.com/search?q=define:{word}",
    },
    {
      label: "Bing",
      value: "bing",
      icon: "icon-bing-color",
      type: "service",
      url: "https://www.bing.com/search?q={word}",
    },
    {
      label: "汉典",
      value: "zdic",
      icon: "png-zdict",
      type: "service",
      url: "https://www.zdic.net/hans/{word}",
    },
    {
      label: "欧路词典",
      value: "eudic",
      icon: "png-eudic",
      type: "service",
      url: "https://dict.eudic.net/dicts/en/{word}",
    },
  ]
})
</script>

<style lang="scss">

</style>
