<template>
  <div class="row">
    <q-tabs v-model="aiTab"
            class="ai-tabs"
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
    { label: t('ai.providers.title'), value: 'model-providers' },
    { label: t('ai.models.default'), value: 'default-models' },
    { label: t('ai.providers.manage'), value: 'provider-manage' },
  ]
})
</script>

<style lang="scss">
.ai-tabs {
  .o-ai-provider-select-btn {
    min-width: 200px;
  }

  .pi-view-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
  }

}
</style>
