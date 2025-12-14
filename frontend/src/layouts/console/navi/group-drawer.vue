<template>
  <resizable-drawer
    v-model="drawerOpen"
    :width="drawerWidth"
    :default-width="defaultWidth"
    :mini-width="miniWidth"
    class="row group-drawer"
    @leave="onLeave"
    @resize="onResize">
    <section class="col-auto bg-deep activity-bar">
      <nav class="row col-12 full-height">
        <q-tabs v-model="selectedActivity" class="activity-tabs" vertical>
          <section class="column col-12 justify-between fit">
            <quick-settings class="text-white" type="group" />
            <div class="" @mouseenter="onEnter">
              <template v-for="(item, index) in consoleMenus" :key="index">
                <q-tab :name="item.name"
                       @click="onClickTab(item)"
                       v-if="!item.meta?.hidden">
                  <o-icon :name="item.meta?.icon" />
                  <o-tooltip position="right" transition v-if="!leftDrawerMiniState">
                    {{menuLabel(item.name)}}
                  </o-tooltip>
                </q-tab>
              </template>
            </div>
            <q-space />
            <div class="row col-auto items-end">
              <div class="col-12">
                <q-btn icon="settings" class="toggle-sidebar text-grey-6" square flat
                       @click="openDialog({type: 'settings'})">
                  <o-tooltip position="right" transition>
                    {{ $t('settings') }}
                  </o-tooltip>
                </q-btn>
                <q-separator />
                <q-btn :icon="leftDrawerMiniState ? 'mdi-backburger rotate-180' : 'mdi-menu-open'"
                       class="shadow-0 toggle-sidebar text-grey-6" square flat
                       @click="toggleLeftMiniState">
                  <o-tooltip position="right" transition>
                    {{leftDrawerMiniState ? $t('expand') : $t('collapse')}}
                  </o-tooltip>
                </q-btn>
              </div>
            </div>
          </section>
        </q-tabs>
      </nav>
    </section>

    <transition appear
                enter-active-class="animated slideInLeft"
                leave-active-class="animated slideOutLeft">
      <section class="side-bar full-height"
               :class="{
                  'bg-accent col': !sidebarFixed,
                  'bg-secondary fixed-sidebar': sidebarFixed
                }"
               :style="{ width: `${sidebarWidth}px` }"
               v-show="!leftDrawerMiniState || sidebarFixed">
        <navi-list :max-width="sidebarWidth" />
      </section>
    </transition>

  </resizable-drawer>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from 'vue'
import useDialog from 'core/hooks/useDialog'
import useNavi from 'src/hooks/useNavi'
import { menuLabel } from 'core/hooks/useMenu'
import { DRAWER_DEFAULT_SIZE } from 'core/constants/style'

import ResizableDrawer from 'core/components/layout/ResizableDrawer.vue'
import NaviList from './navi-list.vue'
import QuickSettings from 'layouts/console/navi/quick-settings.vue'
import { ipcProvider } from 'src/api/ipc'

const { openDialog } = useDialog()
const {
  consoleMenus,
  activity,
  leftDrawerMiniState,
  toggleLeftMiniState,
  setActivity,
} = useNavi()

const width = ref(DRAWER_DEFAULT_SIZE)
const miniWidth = ref(ipcProvider === 'web' ? 48 : 68)
const drawerOpen = ref(true)
const sidebarFixed = ref(false)
const selectedActivity = ref('')

const defaultWidth = computed(() => {
  return leftDrawerMiniState.value ? miniWidth.value : width.value
})
const drawerWidth = computed(() => {
  return leftDrawerMiniState.value ? miniWidth.value : width.value
})
const sidebarWidth = computed(() => {
  return width.value - miniWidth.value
})


function onClickTab (item: Indexable) {
  setActivity(item.name)
}

function initActivity() {
  selectedActivity.value = activity.value
}

function onEnter() {
  if (leftDrawerMiniState.value) {
    sidebarFixed.value = true
  }
}

function onLeave() {
  sidebarFixed.value = false
}

function onResize(value: number) {
  width.value = value
}

watch(() => activity.value, (newValue) => {
  selectedActivity.value = activity.value
})

watch(() => consoleMenus.value, (newValue) => {
  initActivity()
})

onBeforeMount(() => {
  initActivity()
})
</script>

<style lang="scss">
.group-drawer {
  overflow: hidden!important;

  .drawer-separator {
    background: var(--q-dark);
  }

  .activity-bar {
    position: relative;
    width: 48px !important;
    height: 100vh;
    z-index: 2002;
    background: #001529;

    .quick-settings {
      width: 38px;
      height: 38px;
      margin: 5px 0 0 5px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
    }

    .q-tab {
      width: 38px;
      height: 38px;
      min-height: unset;
      padding: 0;
      margin: 0 0 15px 5px;
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.6);

      &:first-child {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      .q-icon {
        font-size: 1.8rem;
      }

      .iconfont {
        font-size: 1.6rem !important;
      }

      svg {
        width: 24px;
        height: 24px;
      }

      .label {
        font-size: 0.8rem;
        margin-top: 4px;
      }

      .q-tab__content {
        padding: 0;
        width: 100%;
      }
    }

    .q-tab--active {
      color: white;
      //background: var(--q-primary);
      background: rgba(255, 255, 255, 0.2);
    }

    .q-tab__indicator {
      display: none;
    }

    nav {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1;

      .toggle-sidebar {
        width: 38px;
        height: 38px;
        margin: 0 5px 15px 5px;
        border-radius: 4px;
      }
    }

  }

  .fixed-sidebar {
    position: fixed;
    left: 48px;
    right: 0;
    top: 0;
    bottom: 20px;
    z-index: 2001;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    overflow: hidden;
    border-radius: 0 8px 8px 0;
  }

}

.electron {
  .group-drawer {
    .activity-bar {
      width: 68px !important;

      .quick-settings {
        width: 48px;
        height: 48px;
        margin: 36px 0 10px 10px;
      }

      .q-tab {
        width: 48px;
        height: 48px;
        margin: 0 0 10px 10px;
      }

      nav {
        .toggle-sidebar {
          width: 48px;
          height: 48px;
          margin: 0 10px 10px 10px;
          border-radius: 4px;
        }
      }
    }

    .fixed-sidebar {
      left: 68px;
    }
  }
}
</style>
