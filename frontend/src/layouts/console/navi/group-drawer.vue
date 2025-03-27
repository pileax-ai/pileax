<template>
  <resizable-drawer
    v-model="drawerOpen"
    :default-width="sidebarWidth"
    :mini-width="miniWidth"
    :mini="leftDrawerMiniState"
    class="row group-drawer">
    <section class="col-auto bg-deep activity-bar">
      <nav class="row col-12 full-height desktop-only">
        <q-tabs v-model="selectedActivity" class="activity-tabs" vertical>
          <section class="row col-12 fit">
            <div class="col-12">
              <template v-for="(item, index) in consoleMenus" :key="index">
                <o-hover-menu :offset="[4, 0]"
                              :nohover="!leftDrawerMiniState"
                              menu-class="group-drawer-hover-menu"
                              min-width="260px"
                              max-width="260px"
                              anchor="top right"
                              self="top left">
                  <template #trigger>
                    <q-tab :name="item.name"
                           @click="onClickTab(item)"
                           v-if="!item.meta?.hidden">
                      <template v-if="item.meta?.icon?.indexOf('icon') === 0">
                        <svg class="icon" aria-hidden="true" v-if="item.meta.svg">
                          <use :xlink:href="`#${item.meta.icon}`"></use>
                        </svg>
                        <i class="iconfont q-icon" :class="item.meta.icon" v-else />
                      </template>
                      <q-icon :name="item.meta?.icon" v-else />
                      <span class="label" v-if="false">{{menuLabel(item.name)}}</span>
                      <o-tooltip position="right" v-if="!leftDrawerMiniState">
                        {{menuLabel(item.name)}}
                      </o-tooltip>
                    </q-tab>
                  </template>

                  <!--Hover Content-->
                  <section class="mini-menu" v-if="leftDrawerMiniState">
                    <header class="row col-12 justify-center items-center q-py-sm bg-accent text-bold">
                      {{ menuLabel(item.name) }}
                    </header>
                    <q-separator class="bg-accent" />
                    <section class="q-mb-sm">
                      <o-navi-expansion-sub-items :parent-key="item.name"
                                                  :list="item.children"
                                                  :level="1"
                                                  show-item-icon
                                                  v-if="!item.meta?.hidden" />
                      <note-tree :max-width="width" v-show="item.name === 'note'" />
                    </section>
                  </section>
                </o-hover-menu>
              </template>
            </div>
            <q-space />
            <div class="row col-12 items-end">
              <div class="col-12">
                <q-btn icon="settings" class="toggle-sidebar text-grey-6" round flat
                       @click="openDialog({type: 'settings'})">
                  <o-tooltip position="right">
                    {{ $t('settings') }}
                  </o-tooltip>
                </q-btn>
                <q-separator />
                <q-btn :icon="leftDrawerMiniState ? 'mdi-backburger rotate-180' : 'mdi-menu-open'"
                       class="shadow-0 toggle-sidebar text-grey-6" square flat
                       @click="toggleLeftMiniState">
                  <o-tooltip position="right">
                    {{leftDrawerMiniState ? $t('expand') : $t('collapse')}}
                  </o-tooltip>
                </q-btn>
              </div>
            </div>
          </section>
        </q-tabs>
      </nav>
    </section>

    <section class="col bg-accent side-bar">
      <transition appear
                  enter-active-class="animated slideInLeft"
                  leave-active-class="animated slideOutLeft">
        <section :style="{ width: `${width - miniWidth}px` }"
                 v-if="!leftDrawerMiniState">
          <navi-list :max-width="sidebarWidth" />
        </section>
      </transition>
    </section>

  </resizable-drawer>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from 'vue';
import useDialog from 'core/hooks/useDialog';
import useNavi from 'src/hooks/useNavi';
import { menuLabel } from 'core/hooks/useMenu';
import { DRAWER_DEFAULT_SIZE } from 'core/constants/style';

import ResizableDrawer from 'core/components/layout/ResizableDrawer.vue';
import OHoverMenu from 'core/components/menu/OHoverMenu.vue';
import NaviList from './navi-list.vue';
import NoteTree from './note/note-tree.vue';
import ONaviExpansionSubItems from 'core/components/navi/ONaviExpansionSubItems.vue';

const { openDialog } = useDialog();
const {
  consoleMenus,
  activity,
  leftDrawerMiniState,
  toggleLeftMiniState,
  setActivity,
} = useNavi();

const width = ref(DRAWER_DEFAULT_SIZE);
const miniWidth = ref(68);
const drawerOpen = ref(true);

const selectedActivity = ref('');
const sidebarWidth = computed(() => {
  return leftDrawerMiniState.value ? miniWidth.value : width.value;
})


function onClickTab (item: Indexable) {
  setActivity(item.name);
}

function initActivity() {
  selectedActivity.value = activity.value;
}

watch(() => activity.value, (newValue) => {
  selectedActivity.value = activity.value;
})

watch(() => consoleMenus.value, (newValue) => {
  initActivity();
})

onBeforeMount(() => {
  initActivity();
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
    width: 68px !important;
    height: 100vh;
    z-index: 2002;
    cursor: pointer;
    background: #001529;

    .activity-tabs {
      padding-top: 40px;
    }

    .q-tab {
      width: 48px;
      height: 48px;
      min-height: unset;
      padding: 0;
      margin: 0 0 5px 10px;
      border-radius: 8px;
      color: white;

      &:first-child {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      .q-icon {
        font-size: 1.6rem;
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
        width: 68px;
        height: 68px;
        margin: 0;
        border-radius: 0;
      }
    }

  }

}

.group-drawer-hover-menu {
  .mini-menu {
    header {
      height: 40px;
    }
  }

}
</style>
