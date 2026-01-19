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

    <!--Dialogs-->
    <modal-entry />
  </q-layout>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onUnmounted, watch} from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from 'stores/app'
import { useNaviStore } from 'stores/navi'
import useShortcut from 'core/hooks/useShortcut'
import useAccount from 'src/hooks/useAccount'
import useNavi from 'src/hooks/useNavi'
import useConsole from 'src/hooks/useConsole'

import TabDrawer from './navi/tab-drawer.vue'
import GroupDrawer from './navi/group-drawer.vue'
import NaviTabbar from './tabbar/NaviTabbar.vue'
import ModalEntry from 'components/modal/ModalEntry.vue'

const route = useRoute()
const appStore = useAppStore()
const naviStore = useNaviStore()
const { addKeyBindings, removeKeyBindings } = useShortcut()

const { workspace, initWorkspace } = useAccount()
const { initWorkspaceData } = useConsole() // Init again when workspace switched
const {
  leftDrawerShow,
  setActivity,
  reduceActivity,
  onLeftDrawerEnter,
  onLeftDrawerLeave,
} = useNavi()

const theme = computed(() => {
  return appStore.setting.theme.name
})
const naviLayout = computed(() => appStore.setting.navi.layout)
const tabBar = computed(() => appStore.setting.tabBar)
const openedMenus = computed(() => naviStore.openedMenus)

async function initConsole () {
  onRouteChanged()

  // First
  console.log('initConsole')
  await initWorkspace()
  console.log('initWorkspace', workspace.value)
  await initWorkspaceData()
}

function onRouteChanged() {
  let activity = ''
  const { name, path } = route
  switch (name) {
    case 'chat':
    case 'chat-conversation':
      activity = 'chat._'
      break
    case 'knowledge':
      activity = 'knowledge'
      break
    case 'note':
      activity = 'note._'
      break
    default:
      activity = reduceActivity(path)
      break
  }
  // console.log('onRouteChanged', activity)
  if (!activity) return
  setActivity(activity)
}

watch(() => route.fullPath, (newValue) => {
  onRouteChanged()
})


onBeforeMount(() => {
  initConsole()
  addKeyBindings()
})

onUnmounted(() => {
  removeKeyBindings()
})
</script>

<style lang="scss">
  @import "style";
</style>
