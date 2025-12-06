<template>
  <section class="row col-12 navi-tabbar square drag-region"
           :style="`--tab-min-width: ${tabWidth}px`">
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
    <div class="col" ref="tabbarRef">
      <q-tabs :model-value="tab.id"
              @update:model-value="onTabChanged"
              align="left"
              indicator-color="transparent"
              narrow-indicator
              class="text-info bg-accent tabs">
        <draggable :list="pinnedTabs"
                   item-key="id"
                   class="row no-wrap"
                   ghost-class="ghost"
                   @end="onTabsSorted">
          <template #item="{ element }">
            <navi-tab :item="element" :minimized="minimized" />
          </template>
        </draggable>
        <draggable :list="unpinnedTabs"
                   item-key="id"
                   class="row no-wrap"
                   ghost-class="ghost"
                   @end="onTabsSorted">
          <template #item="{ element }">
            <navi-tab :item="element" :minimized="minimized" />
          </template>
        </draggable>
        <q-btn icon="add" color="info" size="0.8rem"
               class="tab-add no-drag-region"
               flat round
               @click="onAdd">
          <o-tooltip>New tab</o-tooltip>
        </q-btn>
      </q-tabs>
    </div>
    <div class="row col-auto items-center justify-center more no-drag-region">
      <q-spinner-ios class="text-readable" size="20px" v-if="pageLoading" />
      <opened-tabs-hover-btn icon="expand_more" class="bg-dark text-readable" v-else />
    </div>
    <o-tool-bar-overlay class="col-auto" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from 'vue'
import { useRoute } from 'vue-router';
import { useElementSize } from '@vueuse/core';
import { useAppStore } from 'stores/app';
import { useTabStore } from 'stores/tab';
import useAccount from 'src/hooks/useAccount';
import useNavi from 'src/hooks/useNavi';

import OpenedTabsHoverBtn from './OpenedTabsHoverBtn.vue';
import OHoverBtn from 'core/components/button/OHoverBtn.vue';
import NaviTab from './NaviTab.vue';
import { MenuItem, TabItem } from 'core/types/menu';
import draggable from 'vuedraggable';
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue';

const route = useRoute();
const appStore = useAppStore();
const tabStore = useTabStore();
const { switchWorkspaceByTab } = useAccount();
const {
  leftDrawerShow,
  toggleLeftDrawer,
  onLeftDrawerEnter,
  onLeftDrawerLeave
} = useNavi();

const tabbarRef = useTemplateRef<HTMLElement>('tabbarRef');
const { width } = useElementSize(tabbarRef);
const pinnedTabs = ref<MenuItem[]>([]);
const unpinnedTabs = ref<MenuItem[]>([]);

watchEffect(() => {
  pinnedTabs.value = tabStore.pinnedTabs;
  unpinnedTabs.value = tabStore.unpinnedTabs;
})

const tabMinWidth = computed(() => {
  return Math.min(width.value / tabs.value.length, 160);
})
const tabWidth = computed(() => {
  return Math.max(tabMinWidth.value, width.value / 10, 100);
})
const minimized = computed(() => {
  return tabMinWidth.value <= 60;
})

const showDrawerToggle = computed(() => {
  return !leftDrawerShow.value;
});

const tabs = computed(() => {
  return tabStore.pinnedTabs.concat(tabStore.unpinnedTabs);
});
const tab = computed(() => tabStore.tab);

const pageLoading = computed(() => {
  return appStore.setting.pageLoading.loading;
});

function onTabsSorted(event: any) {
  const newTabs = [...pinnedTabs.value, ...unpinnedTabs.value];
  tabStore.updateTabs(newTabs as TabItem[]);
}

async function onAdd() {
  tabStore.addNewTab();
}

function onTabChanged(id: string) {
  const tab = tabStore.openTab(id, route.path);
  // console.log('open tab', tab);
  if (tab) {
    switchWorkspaceByTab(tab)
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
      background: linear-gradient(to right, var(--q-accent), transparent);
    }
    .q-tabs__arrow--right {
      z-index: 10;
      background: linear-gradient(to right, transparent, var(--q-accent));
    }
    .q-tabs__content {
      justify-content: start!important;
    }

    .q-tab {
      flex: unset!important;
      min-width: var(--tab-min-width);
      max-width: 240px;
      min-height: unset;
      height: $tab-height;
      text-transform: unset;
      padding: 0 8px;
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

      &.pinned, &.minimized {
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
      width: 32px;
      height: 32px;
      min-height: unset;
      border-radius: 8px;
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
    }
  }

  .ghost, .ghost.q-tab--active {
    opacity: 0.5;
    &:before, &:after {
      opacity: 0.5;
      background: var(--q-primary);
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
