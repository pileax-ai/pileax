<template>
  <setting-card class="reading-tab">
    <o-common-card small header>
      <template #header>
        <q-tabs v-model="currentTab"
                active-color="white"
                active-bg-color="primary"
                indicator-color="transparent"
                content-class="pi-btn-group"
                inline-label dense>
          <template v-for="(item, index) of tabs" :key="index">
            <q-tab class="o-navi-tab"
                   :name="item.value"
                   :icon="item.icon"
                   :label="item.label" />
          </template>
        </q-tabs>
      </template>

      <q-tab-panels v-model="currentTab" class="fit col-12" vertical keep-alive>
        <template v-for="(item, index) of tabs" :key="index">
          <q-tab-panel :name="item.value">
            <component :is="item.component" />
          </q-tab-panel>
        </template>
      </q-tab-panels>
    </o-common-card>
  </setting-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useCommon from 'core/hooks/useCommon'
import SettingCard from './setting-card.vue'
import LibraryTab from './reading/library-tab.vue'

const { t } = useCommon()
const currentTab = ref('library')
const tabs = computed(() => {
  return [
    { label: t('reading.library'), value: 'library', component: LibraryTab },
    { label: t('reading.reader'), value: 'reader', component: LibraryTab },
  ]
})

const tab = computed(() => {
  return tabs.value.find(t => t.value === currentTab.value)
})
</script>

<style lang="scss">
.reading-tab {
}
</style>
