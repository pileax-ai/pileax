<template>
  <setting-card :title="$t('appearance')" class="appearance-tab">
    <o-common-card :title="$t('appearances.theme')" small header padding>
      <section class="col-12">
        <q-list no-border link>
          <!-- Theme -->
          <o-common-item :label="$t('appearances.theme')"
                         :sublabel="$t('appearances.theme-tips')">
            <theme-select class="row items-center" item-class="q-ml-md" />
          </o-common-item>
          <section class="sub-items">
            <o-common-item :label="$t('appearances.theme-color')">
              <theme-color-select class="row items-center" item-class="q-ml-md" />
            </o-common-item>
            <o-common-item :label="$t('appearances.modes.color-blind')">
              <q-toggle v-model="themeWeak" @update:model-value="setThemeWeak" />
            </o-common-item>
            <o-common-item :label="$t('appearances.modes.color-blind')">
              <q-toggle v-model="themeGray" @update:model-value="setThemeGray" />
            </o-common-item>
          </section>
        </q-list>
      </section>
    </o-common-card>
    <o-common-card :title="$t('appearances.layout')" small header>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item :label="$t('appearances.layouts.navi')"
                         :sublabel="$t('appearances.layouts.navi-tips')">
            <navi-select class="row items-center" item-class="q-ml-md" />
          </o-common-item>
        </q-list>
      </section>
    </o-common-card>
  </setting-card>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import useSetting from 'core/hooks/useSetting'

import SettingCard from './setting-card.vue'
import ThemeSelect from '../common/theme-select.vue'
import ThemeColorSelect from '../common/theme-color-select.vue'
import NaviSelect from '../common/navi-select.vue'
import TabbarPositionToggle from '../common/tabbar-position-toggle.vue'
import TabbarStyleToggle from '../common/tabbar-style-toggle.vue'
import BreadcrumbStyleToggle from '../common/breadcrumb-style-toggle.vue'

const {
  setting,
  theme,
  navi,
  tabBar,
  breadcrumb,

  setThemeGray,
  setThemeWeak,
  setTabBar,
  setBreadcrumb,
} = useSetting()

const themeGray = ref(false)
const themeWeak = ref(false)
const tabBarSetting = ref({})
const breadcrumbSetting = ref({})

onBeforeMount(() => {
  themeGray.value = theme.value.gray
  themeWeak.value = theme.value.weak
  tabBarSetting.value = tabBar.value
  breadcrumbSetting.value = breadcrumb.value
})
</script>

<style lang="scss">
.appearance-tab {
  .q-btn-group {
    .q-btn {
      min-width: 64px;
      min-height: unset;
      max-height: 32px;
      padding: 2px 8px;
    }
  }

  .o-common-item {
    align-items: center;
  }
}
</style>
