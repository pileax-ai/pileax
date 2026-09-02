<template>
  <setting-card class="ai-tab">
    <o-common-card small>
      <q-tab-panels v-model="aiTab" class="fit col-12" vertical keep-alive>
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
import ModelProvidersTab from './ai/model-providers/index.vue'
import SystemProvidersTab from './ai/system-providers-tab.vue'
import ProviderManageTab from './ai/provider-manage/index.vue'
import useCommon from 'core/hooks/useCommon'
import useSetting from 'core/hooks/useSetting'

const { t } = useCommon()
const { ui, setUi } = useSetting()

const aiTab = computed({
  get() {
    return ui.value.aiTab
  },
  set(value: string) {
    setUi('aiTab', value)
  }
})

const tabs = computed(() => {
  return [
    { label: t('ai.providers.title'), value: 'model-providers', component: ModelProvidersTab },
    { label: t('ai.models.default'), value: 'default-models', component: SystemProvidersTab },
    { label: t('ai.providers.manage'), value: 'provider-manage', component: ProviderManageTab },
  ]
})
</script>

<style lang="scss">
.ai-tab {
  .q-tab-panel {
    padding: 0;
  }

  .o-ai-provider-select-btn {
    min-width: 200px;
  }

  .pi-view-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
  }

}
</style>
