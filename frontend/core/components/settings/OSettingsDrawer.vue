<template>
  <q-drawer v-model="settingsDrawerOpen"
            :width="360"
            side="right"
            behavior="mobile"
            overlay
            class="bg-secondary shadow-3 o-settings-drawer">
    <q-list class="rounded-borders">
      <q-expansion-item label="主题风格" default-opened>
        <theme-select class="row col-12 justify-between" />
      </q-expansion-item>

      <q-expansion-item label="主题色" default-opened>
        <theme-color-select class="row col-12 justify-between" />
        <section class="col-12 q-py-sm">
          <o-common-item label="色弱模式">
            <div class="row items-center">
              <q-toggle v-model="themeWeak" @update:model-value="setThemeWeak" />
            </div>
          </o-common-item>
          <o-common-item label="灰色模式">
            <div class="row items-center">
              <q-toggle v-model="themeGray" @update:model-value="setThemeGray" />
            </div>
          </o-common-item>
        </section>
      </q-expansion-item>

      <q-expansion-item label="导航" default-opened>
        <navi-select class="row col-12 justify-between" />
      </q-expansion-item>

      <!-- Tabbar -->
      <q-expansion-item label="标签栏" default-opened>
        <o-common-item label="启用" help="显示已打开的页面标签">
          <div class="row items-center">
            <q-toggle v-model="tabBarSetting.enable"
                      @update:model-value="setTabBar('enable', $event)" />
          </div>
        </o-common-item>
        <o-common-item label="位置">
          <tabbar-position-toggle />
        </o-common-item>
        <o-common-item label="样式" class="q-mt-sm">
          <tabbar-style-toggle />
        </o-common-item>
      </q-expansion-item>

      <!-- Breadcrumb -->
      <q-expansion-item label="面包屑导航" default-opened>
        <o-common-item label="启用" help="在页面顶部显示面包屑">
          <div class="row items-center">
            <q-toggle v-model="breadcrumbSetting.enable"
                      @update:model-value="setBreadcrumb('enable', $event)" />
          </div>
        </o-common-item>
        <o-common-item label="图标">
          <q-toggle v-model="breadcrumbSetting.icon"
                    @update:model-value="setBreadcrumb('icon', $event)" />
        </o-common-item>
        <o-common-item label="样式" class="q-mt-sm">
          <breadcrumb-style-toggle />
        </o-common-item>
      </q-expansion-item>

      <!-- Animation -->
      <q-expansion-item label="动画" default-opened>
        <o-common-item label="页面进度" help="页面顶部显示进度条">
          <div class="row items-center">
            <q-toggle v-model="pageLoadingSetting.enable"
                      @update:model-value="setPageLoading('enable', $event)" />
          </div>
        </o-common-item>
        <o-common-item label="页面切换" help="页面切换时显示过渡动画">
          <q-toggle v-model="pageTransitionSetting.enable"
                    @update:model-value="setPageTransition('enable', $event)" />
        </o-common-item>
        <o-common-item label="切换动画" class="q-mt-sm">
          <PageTransitionDropdown />
        </o-common-item>
      </q-expansion-item>
    </q-list>

    <!-- Footer -->
    <q-btn icon="close" class="text-tips close" size="0.8rem"
           round flat @click="onToggle" v-if="false" />
    <div class="drawer-handler bg-primary" @click="onToggle">
      <q-icon :name="settingsDrawerOpen ? 'close' : 'settings'" color="white" size="1.6rem" />
    </div>

    <footer class="row col-12 justify-center items-center bg-secondary">
      <o-copy-btn label="复制配置"
             color="primary"
             class="col-12"
             outline
             :value="settingJsonString" />
    </footer>
  </q-drawer>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, ref} from 'vue';
import useCommon from 'core/hooks/useCommon';
import useSetting from 'core/hooks/useSetting';

import OCopyBtn from 'core/components/button/OCopyBtn.vue';
import ThemeSelect from './common/theme-select.vue';
import ThemeColorSelect from './common/theme-color-select.vue';
import NaviSelect from './common/navi-select.vue';
import TabbarPositionToggle from './common/tabbar-position-toggle.vue';
import TabbarStyleToggle from './common/tabbar-style-toggle.vue';
import BreadcrumbStyleToggle from './common/breadcrumb-style-toggle.vue';
import PageTransitionDropdown from './common/page-transition-dropdown.vue';

const { copy } = useCommon();

const {
  setting,
  theme,
  navi,
  tabBar,
  breadcrumb,
  pageLoading,
  pageTransition,

  setThemeGray,
  setThemeWeak,
  setTabBar,
  setBreadcrumb,
  setPageLoading,
  setPageTransition,
} = useSetting();

const settingsDrawerOpen = ref(false);
const themeGray = ref(false);
const themeWeak = ref(false);
const tabBarSetting = ref({});
const breadcrumbSetting = ref({});
const pageLoadingSetting = ref({});
const pageTransitionSetting = ref({});

const settingJsonString = computed(() => {
  return JSON.stringify(setting.value, null, '\t');
}) ;

function onToggle () {
  settingsDrawerOpen.value = !settingsDrawerOpen.value
}
function onCopySetting () {
  copy(JSON.stringify(setting.value, null, '\t'));
}

onBeforeMount(() => {
  themeGray.value = theme.value.gray;
  themeWeak.value = theme.value.weak;
  tabBarSetting.value = tabBar.value;
  breadcrumbSetting.value = breadcrumb.value;
  pageLoadingSetting.value = pageLoading.value;
  pageTransitionSetting.value = pageTransition.value;
})
</script>

<style lang="scss">
.o-settings-drawer {
  padding-bottom: 80px;

  .q-expansion-item {
    .q-link {
      font-weight: bold;
      border-bottom: solid 1px var(--q-accent);

      .q-icon {
        font-size: 18px;
        opacity: 0.3;
      }
    }
    .q-expansion-item__content {
      padding: 10px 21px;
    }


    .o-common-item {
      min-height: unset;
      .q-btn {
        min-width: 64px;
        min-height: unset;
        padding: 2px 8px;
      }
    }
  }

  .drawer-handler {
    position: absolute;
    top: calc(50vh - 24px);
    right: 360px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    font-size: 16px;
    border-radius: 4px 0 0 4px;
    cursor: pointer;
    pointer-events: auto;
  }

  .close {
    position: fixed;
    top: 10px;
    right: 10px;
  }

  footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 80px;
    padding: 0 21px;
  }
}

.q-drawer.q-layout--prevent-focus {
  visibility: visible!important;
}
.q-drawer__backdrop {
  z-index: 2 !important;
}
</style>
