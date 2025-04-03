<template>
  <q-layout view="lHr Lpr lFr"
            class="o-layout layout-console bg-accent"
            :class="`theme-${theme}`">
    <!--Drawers-->
    <tab-drawer @leave="onLeftDrawerLeave" v-if="naviLayout === 'tab'" />
    <group-drawer v-if="naviLayout === 'group'" />

    <!--Drawer Handlers -->
    <div class="drawer-handler absolute-left"
         @mouseenter="onLeftDrawerEnter"
         v-if="!leftDrawerShow">
    </div>

    <!--Header-->
    <q-header class="bg-accent o-top-header">
      <template v-if="tabBar.enable && tabBar.position==='top'">
        <q-separator class="bg-transparent" style="height: 10px;"
                     v-if="openedMenus.length && tabBar.style!=='card' && false" />
        <NaviTabbar />
      </template>
    </q-header>

    <!--PageView-->
    <q-page-container class="bg-secondary">
      <slot></slot>
    </q-page-container>

    <!--Footer-->
    <q-footer class="bg-transparent" v-if="tabBar.enable && tabBar.position==='bottom'">
      <q-separator class="bg-accent" />
      <NaviTabbar />
    </q-footer>

    <!--Others-->
    <modal-entry />
  </q-layout>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onMounted, onUnmounted, ref, watch} from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from 'stores/app';
import { useNaviStore } from 'stores/navi';
import useShortcut from 'core/hooks/useShortcut';
import useNavi from 'src/hooks/useNavi';

import TabDrawer from './navi/tab-drawer.vue';
import GroupDrawer from './navi/group-drawer.vue';
import NaviTabbar from './tabbar/NaviTabbar.vue';
import ModalEntry from 'components/modal/ModalEntry.vue';

const route = useRoute();
const appStore = useAppStore();
const naviStore = useNaviStore();
const { addKeyBindings, removeKeyBindings } = useShortcut();
const {
  setActivity,
  reduceActivity,
  leftDrawerShow,
  onLeftDrawerEnter,
  onLeftDrawerLeave,
} = useNavi();

const theme = computed(() => {
  return appStore.setting.theme.name;
});
const naviLayout = computed(() => appStore.setting.navi.layout);
const tabBar = computed(() => appStore.setting.tabBar);
const openedMenus = computed(() => naviStore.openedMenus);

function init () {
  naviStore.initMenu();
  onRouteChanged();
}

function onRouteChanged() {
  let activity = '';
  const { name, path } = route;
  switch (name) {
    case 'note':
      activity = 'note';
      break;
    case 'chat':
    case 'chat-session':
      activity = 'chat';
      break;
    default:
      activity = reduceActivity(path);
      break;
  }
  setActivity(activity);
}

watch(() => route.fullPath, (newValue) => {
  onRouteChanged();
})

onBeforeMount(() => {
  init();
  addKeyBindings();
})

onUnmounted(() => {
  removeKeyBindings();
})
</script>

<style lang="scss">
  @import "style";
</style>
