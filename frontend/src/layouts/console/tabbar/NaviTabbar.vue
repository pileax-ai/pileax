<template>
  <section class="row col-12 navi-tabbar drag-region"
           :class="`${tabBar.style}`">
    <div class="row col-auto items-center justify-center text-readable navi-left no-drag-region"
         :class="{'show': showDrawerToggle}">
      <o-hover-btn icon="menu"
                   hover-icon="mdi-backburger rotate-180"
                   class="o-toolbar-btn"
                   @enter="onLeftDrawerEnter"
                   @leave="onLeftDrawerLeave"
                   @click="toggleLeftDrawer"
                   v-if="showDrawerToggle">
        <o-tooltip :message="$t('expand')" position="right" />
      </o-hover-btn>
    </div>
    <div class="row col">
      <q-tabs :model-value="tab.id"
              @update:model-value="onTabChanged"
              ref="tabs" align="left"
              indicator-color="transparent"
              narrow-indicator
              class="text-info bg-accent no-drag-region tabs">
        <template v-for="(item, index) in tabs" :key="index">
          <q-tab :name="item.id" :ripple="false" :class="{'pinned': item.pinned}">
            <section class="row items-center item">
              <div class="col-auto row justify-center items-center prefix">
                <o-icon :name="item.icon" size="1.4rem" v-if="item.icon" />
                <template v-else-if="item.meta?.icon">
                  <span>{{ item.meta.icon || NoteDefaultIcon }}</span>
                </template>
              </div>
              <div class="col ellipsis label">
                {{ menuLabel(item.name) }}
              </div>
              <div class="row justify-center items-center suffix">
                <q-btn icon="close" flat round
                       @click.stop.prevent="onClose(item)" />
                <div class="icon" v-if="false">
                  <q-icon name="circle" class="text-primary" size="0.6rem" />
                </div>
              </div>
            </section>

            <q-tooltip class="bg-primary text-white" :delay="800">
              {{ menuLabel(item.name) }}
            </q-tooltip>

            <q-menu touch-position context-menu
                    class="pi-context-menu">
              <q-list :style="{minWidth: '200px'}">
                <template v-for="(action, i) in actions" :key="`action-${i}`">
                  <q-separator class="bg-accent" v-if="action.separator" />
                  <o-common-item v-bind="action"
                                 @click="onAction(action, item)"
                                 clickable closable />
                </template>
              </q-list>
            </q-menu>
          </q-tab>
        </template>
        <q-btn icon="add" color="info" size="0.8rem" class="tab-add"
               flat round
               @click="onAdd">
          <o-tooltip>New tab</o-tooltip>
        </q-btn>
      </q-tabs>
    </div>
    <div class="row col-auto items-center justify-center more no-drag-region">
      <q-spinner-ios class="text-readable" size="20px" v-if="pageLoading" />
      <opened-tabs-hover-btn :icon="moreIcon" class="text-readable" v-else />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from 'stores/app';
import { useTabStore } from 'stores/tab';
import { menuLabel } from 'core/hooks/useMenu';
import { refresh } from 'core/hooks/useRouter';
import { electronIpc } from 'src/api/ipc/electron';
import { NoteDefaultIcon } from 'core/constants/constant';
import useNavi from 'src/hooks/useNavi';

import OpenedTabsHoverBtn from './OpenedTabsHoverBtn.vue';
import OHoverBtn from 'core/components/button/OHoverBtn.vue';
import { UUID } from 'core/utils/crypto'
import { MenuItem } from 'core/types/menu'

const route = useRoute();
const appStore = useAppStore();
const tabStore = useTabStore();
const {
  leftDrawerShow,
  toggleLeftDrawer,
  onLeftDrawerEnter,
  onLeftDrawerLeave
} = useNavi();

const showDrawerToggle = computed(() => {
  return !leftDrawerShow.value;
});

const actions = computed(() => {
  return [
    { label: 'Refresh Tab', value: 'refresh', icon: 'refresh' },
    { label: 'Pin Tab', value: 'pin', icon: 'mdi-pin-outline', separator: true },
    { label: 'Duplicate Tab', value: 'duplicate', icon: 'copy_all' },
    { label: 'Move Tab to New Window', value: 'newWindow', icon: 'open_in_browser' },
    { label: 'Close', value: 'close', icon: 'close', separator: true },
    { label: 'Close Other Tabs', value: 'closeOther', icon: 'playlist_remove' },
    { label: 'Close Tabs to the Left', value: 'closeToLeft', icon: 'keyboard_tab', iconClass: 'rotate-180' },
    { label: 'Close Tabs to the Right', value: 'closeToRight', icon: 'keyboard_tab' },
  ];
});

const tabBar = computed(() => appStore.setting.tabBar);
const tabs = computed(() => {
  return tabStore.pinnedTabs.concat(tabStore.unpinnedTabs);
});
const tab = computed(() => tabStore.tab);

const moreIcon = computed(() => {
  return appStore.setting.tabBar.position === 'top' ? 'expand_more' : 'expand_less';
});
const pageLoading = computed(() => {
  return appStore.setting.pageLoading.loading;
});

async function onAdd() {
  tabStore.addNewTab();
}

function onTabChanged(id: string) {
  console.log('tab', id);
  tabStore.openTab(id, route.path);
}

function onClose(item: MenuItem) {
  tabStore.closeTab(item.id);
}

function onNewWindow(item: MenuItem) {
  console.log('newWindow', tab);
  electronIpc.openNewWindow(item.id, item.path);
}

function onAction (action: Indexable, item: MenuItem) {
  console.log('action', action.value, item.id);
  switch (action.value) {
    case 'close':
      tabStore.closeTab(item.id);
      break;
    case 'closeOther':
      tabStore.closeOtherTabs(item.id);
      break;
    case 'closeToLeft':
      tabStore.closeLeftTabs(item.id);
      break;
    case 'closeToRight':
      tabStore.closeRightTabs(item.id);
      break;
    case 'duplicate':
      tabStore.duplicateTab(item.id);
      break;
    case 'newWindow':
      onNewWindow(item);
      break;
    case 'pin':
      tabStore.togglePinTab(item.id);
      break;
    case 'refresh':
      refresh();
      break;
  }
}
</script>

<style lang="scss">
$tab-height: 40px;
.navi-tabbar {
  padding: 0;
  height: $tab-height;

  .navi-left {
    .q-btn {
      width: 36px;
      height: 36px;
      min-height: unset;
      border-radius: 4px;
    }
  }

  .tabs {
    background: transparent!important;
    .q-tabs__arrow--left {
      left: -20px;
      z-index: 10;
    }
    .q-tabs__arrow--right {
      right: -16px;
      z-index: 10;
    }

    .q-tab {
      flex: unset!important;
      min-width: 10vw;
      max-width: 240px;
      min-height: unset;
      height: $tab-height;
      text-transform: unset;
      padding: 0 4px;
      z-index: 0;

      .prefix, .suffix {
        width: 28px;
        height: $tab-height;
        line-height: $tab-height;

        .q-btn {
          width: 28px;
          height: 28px;
          min-width: unset;
          min-height: unset;

          .q-icon {
            font-size: 1rem;
          }
        }
      }

      .suffix {
        position: absolute;
        right: 0;

        .q-btn {
          visibility: hidden;
          display: none;
        }
        .icon {
          visibility: hidden;
        }
      }

      .label {
        padding-right: 10px;
        max-width: 160px;
        text-align: left;
      }

      &:hover {
        color: var(--q-info);

        .suffix {
          left: 0;
          right: 0;
          width: unset;
          justify-content: end;
        }
        .q-btn {
          visibility: visible;
          display: inline-flex;
        }
        .icon {
          visibility: visible;
          display: none;
        }
      }

      .q-tab__content {
        width: 100%;

        .item {
          width: 100%;
        }
      }

      &.pinned {
        min-width: unset;
        padding: 0 16px;
        .q-tab__content {
          min-width: unset;
        }
        .label, .suffix {
          display: none;
        }
      }
    }

    .q-tab--active {
      .suffix {
        .icon {
          visibility: visible;
        }
      }
    }

    .tab-add {
      min-width: 32px;
      min-height: 32px;
      margin: 4px;
    }
  }

  .more {
    width: 40px;
    .q-btn {
      width: 36px;
      height: 36px;
    }
    .q-icon {
      font-size: 20px;
    }
  }
}


.navi-tabbar.square {
  .q-tab {
    margin-right: -1px;
    border-radius: 0;
    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 0;
    }

    &:after {
      content: "";
      position: absolute;
      top: 0;
      width: 1px;
      height: 100%;
      background: var(--q-dark);
      z-index: 0;
    }
    &:after {
      right: 0;
    }

    &:hover {
      background: var(--q-dark);
      z-index: 2;
      &:before, &:after {
        //background: var(--q-secondary);
      }

      .suffix {
        background: transparent;
      }
    }
    div.q-focus-helper {
      visibility: hidden;
    }
  }

  .q-tab--active {
    &:before, &:after {
      background: var(--q-secondary);
      background: var(--q-secondary);
    }
  }
}

.navi-tabbar-more-menu {
  max-width: 300px !important;
  .q-item {
    border-radius: 0!important;
    .side-label {
      padding-right: 8px;
    }
    .close {
      visibility: hidden;
    }

    &:hover {
      .close {
        visibility: visible;
      }
    }
  }
}

.body--dark {
  .navi-tabbar.modern {
    .q-tab--active {
      &:before, &:after {
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><path d='M 0 10 L 10 10 L 10 0 Q 10 10 0 10 Z' fill='%23272A3E'></path></svg>") !important;
      }
    }
  }
}

@media (max-width: 768px) {
  .navi-tabbar .tabs {
    .q-tab {
      min-width: unset;
      padding: 0 16px;

      .q-tab__content {
        min-width: unset;
      }
      .label {
        display: none;
      }

      &:hover {
        .suffix {
          background: var(--q-secondary);
        }
      }
    }
  }
}
</style>
