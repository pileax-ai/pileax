<template>
  <setting-card class="ai-tab">
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
import SettingCard from './setting-card.vue'
import AllProvidersTab from './ai/all-providers-tab.vue'
import SystemProvidersTab from './ai/system-providers-tab.vue'
import useCommon from 'core/hooks/useCommon'

const { t } = useCommon()
const currentTab = ref('model-providers')

const tabs = computed(() => {
  return [
    { label: t('ai.providers.title'), value: 'model-providers', component: AllProvidersTab },
    { label: t('ai.models.system'), value: 'system-settings', component: SystemProvidersTab },
  ]
})
</script>

<style lang="scss">
.ai-tab {
  .o-ai-provider-select-btn {
    min-width: 200px;
  }

  .pi-view-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
  }

}
</style>
