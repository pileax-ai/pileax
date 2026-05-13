<template>
  <resizable-drawer
    v-model="drawerOpen"
    :width="drawerWidth"
    :default-width="defaultWidth"
    :mini-width="miniWidth"
    class="row group-drawer"
    @leave="onLeave"
    @resize="onResize">
    <section class="col-auto bg-accent activity-bar">
      <nav class="row col-12 full-height">
        <q-tabs v-model="selectedActivity" class="activity-tabs" vertical>
          <section class="column col-12 justify-between fit">
            <div class="" @mouseenter="onEnter">
              <template v-for="(item, index) in consoleMenus" :key="index">
                <q-tab :name="item.name"
                       :class="`tab-${item.name.split('.')[0]}`"
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
                <q-btn icon="settings" class="toggle-sidebar text-readable" square flat
                       @click="openDialog({type: 'settings'})">
                  <o-tooltip position="right" transition>
                    {{ $t('settings') }}
                  </o-tooltip>
                </q-btn>
                <q-btn :icon="leftDrawerMiniState ? 'mdi-backburger rotate-180' : 'mdi-menu-open'"
                       class="shadow-0 toggle-sidebar text-readable" square flat
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
      <section class="side-bar"
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
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import useDialog from 'core/hooks/useDialog'
import useNavi from 'src/hooks/useNavi'
import useTour from 'src/hooks/useTour'
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
const { createTour } = useTour()
const tour = createTour('navi', {
  stagePadding: 4,
})

const width = ref(DRAWER_DEFAULT_SIZE)
const miniWidth = ref(48)
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
  console.log('watch activity', newValue)
  selectedActivity.value = activity.value
})

watch(() => consoleMenus.value, (newValue) => {
  initActivity()
})

onBeforeMount(() => {
  initActivity()
})

onMounted(() => {
  tour.start()
})
</script>

<style lang="scss">
.q-drawer:has(.group-drawer) {
  background: var(--q-accent) !important;
}
.group-drawer {
  overflow: hidden!important;

  .drawer-separator {
    width: 6px !important;
    right: 0 !important;
    background: var(--q-accent) !important;
  }

  .drawer-inner {
  }

  .activity-bar {
    position: relative;
    width: 48px !important;
    z-index: 2002;
    background: #001529;
    height: 100% !important;

    .q-tab {
      width: 38px;
      height: 38px;
      min-height: unset;
      padding: 0;
      margin: 0 0 10px 5px;
      border-radius: 4px;

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
      background: var(--q-primary);
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

  .side-bar {
    position: relative;
    height: 100% !important;
    .navi-list {
      width: calc(100% - 6px);
      height: calc(100vh - 54px) !important;
      border-radius: 12px;
      background: var(--q-secondary) !important;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        //background-image: url('/images/book/dark-bubble_nebula.jpg')!important;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        filter: blur(350px);
      }
    }
    .navi-separator {
      display: none;
    }
  }

  .fixed-sidebar {
    position: fixed;
    left: 48px;
    right: 0;
    top: 0;
    bottom: 20px;
    z-index: 2001;
    overflow: hidden;
    border-radius: 12px;
    border-right: solid 6px var(--q-accent);


    .navi-list {
      width: 100% !important;
    }
  }
}

</style>
