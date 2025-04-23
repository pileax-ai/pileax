<template>
  <q-toolbar class="bg-secondary console-toolbar">
    <section class="row col-12 justify-between full-height">
      <section class="row items-center text-tips">
        <q-btn :icon="hoverMenu ? 'mdi-backburger rotate-180' : 'menu'"
               @mouseenter.stop="hoverMenu = true"
               @mouseleave.stop="hoverMenu = false"
               @click="hoverMenu = false; toggleDrawer();"
               flat round v-if="showDrawerToggle">
          <o-tooltip :message="$t('expand')" position="right" />
        </q-btn>

        <o-breadcrumbs :disable="hideBreadcrumbs" />
      </section>
      <section class="row items-center">
        <toggle-theme-btn class="text-info square" />
        <locale-hover-btn class="text-info" :offset="[0, 10]" />
        <console-more-hover-btn class="text-info" :offset="[0, 10]" show-label />
        <opened-tabs-hover-btn class="text-readable" :offset="[0, 10]" v-if="!tabBar.enable" />
      </section>
    </section>

  </q-toolbar>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, ref} from 'vue';
import { useNaviStore } from 'stores/navi';
import useSetting from 'core/hooks/useSetting';
import useNavi from 'src/hooks/useNavi';

import OBreadcrumbs from '../breadcrumb/OBreadcrumbs.vue';
import ToggleThemeBtn from 'core/components/button/ToggleThemeBtn.vue';
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue';
import ConsoleMoreHoverBtn from 'core/components/button/ConsoleMoreHoverBtn.vue';
import OpenedTabsHoverBtn from 'core/layouts/console/desktop/tabbar/OpenedTabsHoverBtn.vue';

const naviStore = useNaviStore();
const { toggleDrawer } = useNavi();
const { tabBar } = useSetting();

const hoverMenu = ref(false);
const hideBreadcrumbs = ref(false);

const showDrawerToggle = computed(() => naviStore.drawer.miniState);

function onRoute() {
  // hideBreadcrumbs.value = route.name === 'welcome';
  return;
}

onBeforeMount(() => {
  onRoute();
})
</script>

<style lang="scss">
.console-toolbar {
  backdrop-filter: blur(0px);
  height: 60px;

  .q-btn {
    height: 40px;
    padding: 4px 8px;
  }

  .q-btn.square {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    margin-left: 8px;

    .q-icon {
      font-size: 1.6rem !important;
    }

    img {
      border-radius: 50%;
    }
  }
}
</style>
