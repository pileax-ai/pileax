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
    <div class="col">
      <q-tabs ref="tabs" align="left"
              indicator-color="transparent"
              narrow-indicator
              class="text-info bg-accent tabs">
        <template v-for="(item, index) in openedMenus" :key="index">
          <q-route-tab :to="item.path" :ripple="false" class="no-drag-region">
            <section class="row items-center item">
              <div class="col-auto row justify-center items-center prefix">
                <o-icon :name="item.icon" size="1.4rem" v-if="item.icon" />
                <template v-else-if="item.meta?.type==='note'">
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
                    class="navi-tabbar-menu">
              <q-list :style="{minWidth: '200px'}">
                <template v-for="(action, index) in actions" :key="`action-${index}`">
                  <q-separator class="bg-accent" v-if="action.separator" />
                  <o-common-item v-bind="action"
                                 class="text-tips"
                                 @click="onAction(action, item)"
                                 clickable closable />
                </template>
              </q-list>
            </q-menu>
          </q-route-tab>
        </template>
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
import { useAppStore } from 'stores/app';
import { useNaviStore } from 'stores/navi';
import { menuLabel } from 'core/hooks/useMenu';
import { refresh } from 'core/hooks/useRouter';
import { NoteDefaultIcon } from 'core/constants/constant';
import {MenuItem} from 'core/types/menu';
import useNavi from 'src/hooks/useNavi';

import OpenedTabsHoverBtn from './OpenedTabsHoverBtn.vue';
import OHoverBtn from 'core/components/button/OHoverBtn.vue';

const appStore = useAppStore();
const naviStore = useNaviStore();
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
    { label: 'Reload', value: 'reload', icon: 'refresh' },
    // { label: 'Pin', value: 'pin', icon: 'push_pin' },
    { label: 'Close', value: 'close', icon: 'close', separator: true },
    { label: 'Close Other Tabs', value: 'closeOther', icon: 'playlist_remove' },
    { label: 'Close Tabs to the Right', value: 'closeToRight', icon: 'keyboard_tab' },
  ];
});

const tabBar = computed(() => appStore.setting.tabBar);
const openedMenus = computed(() => naviStore.openedMenus);
const moreIcon = computed(() => {
  return appStore.setting.tabBar.position === 'top' ? 'expand_more' : 'expand_less';
});
const pageLoading = computed(() => {
  return appStore.setting.pageLoading.loading;
});

async function onClose (item: MenuItem) {
  naviStore.closeOpenedMenu(item);
}

function onAction (action: Indexable, item: MenuItem) {
  switch (action.value) {
    case 'close':
      naviStore.closeOpenedMenu(item);
      break;
    case 'closeOther':
      naviStore.closeOtherOpenedMenu(item);
      break;
    case 'closeToRight':
      naviStore.closeRightOpenedMenu(item);
      break;
    case 'reload':
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
          background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 50%,
              var(--q-secondary) 70%
          );
          //background: red;
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
    }

    .q-tab--active {
      .suffix {
        .icon {
          visibility: visible;
        }
      }
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
      top: 10px;
      width: 1px;
      height: calc(100% - 20px);
      background: var(--q-secondary);
      z-index: 0;
    }
    &:after {
      right: 0;
    }

    &:hover {
      background: var(--q-secondary);
      z-index: 2;
      &:before, &:after {
        background: var(--q-secondary);
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

.navi-tabbar.card {
  .q-tab {
    margin: 5px 2px;
    border-radius: 4px;
    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
    }

    &:hover {
      background: var(--q-secondary);
      z-index: 2;
      &:before, &:after {
        border-radius: 6px;
        background: var(--q-secondary);
      }
    }
    div.q-focus-helper {
      visibility: hidden;
    }
  }

  .q-tab--active {
    &:before, &:after {
      border-radius: 6px;
      background: var(--q-secondary);
      background: var(--q-secondary);
    }
  }
}

.navi-tabbar.modern {
  padding-top: 10px;
  .q-tab {
    min-width: 100px;
    margin-right: -1px;
    border-radius: 10px 10px 0 0;
    border: none;
    z-index: 0;

    &:after {
      content: "";
      position: absolute;
      top: 10px;
      width: 1px;
      height: calc(100% - 20px);
      background: var(--q-secondary);
      z-index: 0;
    }
    &:after {
      right: 0;
    }

    &:hover {
      background: var(--q-secondary);
      z-index: 2;
      &:before, &:after {
        background: var(--q-secondary);
      }
    }
    div.q-focus-helper {
      visibility: hidden;
    }
  }

  .q-tab--active {
    background: var(--q-secondary);
    z-index: 1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

    &:before, &:after {
      content: "";
      width: 10px;
      height: 10px;
      position: absolute;
      bottom: 0;
      top: unset;
      right: unset;
      left: unset;
      z-index: 1;
    }
    &:before {
      left: -10px;
    }
    &:after {
      right: -10px;
      transform: scaleX(-1);
    }
    &:before, &:after {
      background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><path d='M 0 10 L 10 10 L 10 0 Q 10 10 0 10 Z' fill='%23ffffff'></path></svg>") !important;
    }
  }

  .more {
    margin-top: -10px;
  }
}

.navi-tabbar-menu {
  .q-item {
    min-height: unset !important;
    padding: 0;
    border-radius: 0;
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
