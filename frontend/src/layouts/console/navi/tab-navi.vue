<template>
  <section class="tab-navi">
    <header class="row col-12 justify-between top-header" v-if="header">
      <div class="col header-left drag-region">
      </div>
      <div class="col-auto sidebar-toggles no-drag-region">
        <q-btn class="text-info square" flat round
               @click="openDialog({type: 'settings'})">
          <o-icon name="icon-setting-line" size="1.5rem" />
        </q-btn>
        <q-btn icon="mdi-backburger" class="text-tips" flat round
               @click="toggleLeftDrawer">
          <o-tooltip :message="$t('collapse')" position="right" />
        </q-btn>
      </div>
    </header>
    <section class="col-12 activity-bar" :class="{ 'no-header': !header }">
      <nav class="row col-12 desktop-only">
        <q-tabs v-model="selectedActivity"
                class="col-12 activity-tabs"
                align="justify"
                mobile-arrows>
          <template v-for="(item, index) in consoleMenus" :key="index">
            <div v-if="!item.meta?.hidden">
              <q-tab :name="item.name">
                <template v-if="item.meta.icon.indexOf('icon') === 0">
                  <svg class="icon" aria-hidden="true" v-if="item.meta.svg">
                    <use :xlink:href="`#${item.meta.icon}`"></use>
                  </svg>
                  <i class="iconfont q-icon text-info" :class="item.meta.icon" v-else />
                </template>
                <q-icon :name="item.meta.icon" class="text-info" v-else />
                <o-tooltip>
                  {{menuLabel(item.name)}}
                </o-tooltip>
              </q-tab>
            </div>
          </template>
        </q-tabs>
      </nav>
    </section>
    <navi-list :max-width="width" :class="{ 'no-header': !header }" />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';

import NaviList from './navi-list.vue';
import { menuLabel } from 'core/hooks/useMenu';
import useNavi from 'src/hooks/useNavi';
import useDialog from 'core/hooks/useDialog';

const props = defineProps({
  header: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 300
  },
});

const { openDialog } = useDialog();
const {
  consoleMenus,
  activity,
  leftDrawerHoverShow,
  toggleLeftDrawer,
  setActivity,
} = useNavi();

const selectedActivity = computed({
  get: () => activity.value,
  set: (newValue: string) => {
    setActivity(newValue);
  }
});

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
.tab-navi {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  &:hover {
    .top-header {
      .sidebar-toggle {
        visibility: visible;
      }
    }
  }

  .top-header {
    position: relative;
    width: 100% !important;
    height: 40px;
    padding: 4px;

    .q-btn {
      width: 32px !important;
      height: 32px !important;
      min-height: 32px;
      min-width: 32px;
      border-radius: 2px;

      .q-icon {
        font-size: 1.4rem;
      }
    }

    .header-left {
      padding: 0px 10px;
    }

    .sidebar-toggle {
      padding: 2px 10px;
      visibility: hidden;
    }
  }

  .activity-bar {
    position: relative;
    width: 100% !important;
    height: 50px;
    z-index: 2002;
    cursor: pointer;

    &.no-header {
      margin-top: 10px;
    }

    .q-tabs {
      height: 40px;
      padding: 0 10px;

      .q-tabs__content {
        justify-content: space-between;
        width: 100%;
      }
    }
    .q-tab {
      width: 40px;
      height: 40px;
      min-height: unset;
      margin: 0;
      border-radius: 3px;

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
    }

    .q-tab--active {
      //background: rgba(#001529, 0.1);
      //background: red;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--q-primary);
        opacity: 0.2;
        border-radius: 3px;
      }
    }

    .q-tab__indicator {
      display: none;
    }

    nav {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50px;
      z-index: 1;

      .toggle-sidebar {
        width: 60px;
        height: 60px;
        border-radius: 0;
      }
    }
  }

  .navi-list {
    box-shadow: none;
    height: calc(100% - 90px)!important;

    &.no-header {
      height: calc(100% - 66px)!important;
    }

    .header-item {
      display: none;
    }

    .q-expansion-item__content {
      .header-item {
        display: flex;
      }

      .q-expansion-item__toggle-icon {
        font-size: 1.2rem;
      }
    }
  }
}

</style>
