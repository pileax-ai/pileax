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
            <template v-if="item.show">
              <q-tab class="o-navi-tab"
                     :name="item.value"
                     :icon="item.icon"
                     :label="item.label" />
            </template>
          </template>
        </q-tabs>
      </template>

      <q-tab-panels v-model="currentTab" class="fit col-12" vertical keep-alive>
        <template v-for="(item, index) of tabs" :key="index">
          <q-tab-panel :name="item.value">
            <template v-if="item.show">
              <component :is="item.component" />
            </template>
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
import ReadingTab from './system/reading-tab.vue'
import EnvTab from './system/env-tab.vue'
import useAccount from 'src/hooks/useAccount'

const { t } = useCommon()
const { account } = useAccount()
const currentTab = ref('storage')
const tabs = computed(() => {
  return [
    {
      label: t('systems.storage'),
      value: 'storage',
      icon: 'mdi-database',
      component: ReadingTab,
      show: true
    },
    {
      label: t('systems.env'),
      value: 'env',
      icon: 'data_object',
      component: EnvTab,
      show: account.value.isSuper
    },
    // { label: t('systems.config'), value: 'config', icon: 'o_tune', component: EnvTab },
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
