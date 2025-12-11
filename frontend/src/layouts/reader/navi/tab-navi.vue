<template>
  <section class="tab-navi">
    <header class="row col-12 justify-between top-header" v-if="header && leftDrawerShow">
      <div class="col header-left drag-region">
      </div>
      <div class="col-auto sidebar-toggle no-drag-region">
        <q-btn icon="mdi-backburger" class="text-tips" flat round
               @click="toggleLeftDrawer">
          <o-tooltip :message="$t('collapse')" position="right" />
        </q-btn>
      </div>
    </header>
    <section class="col-12 activity-bar" :class="{ 'no-header': !header || !leftDrawerShow }">
      <nav class="row col-12 desktop-only">
        <q-tabs v-model="selectedActivity"
                class="col-12 activity-tabs"
                align="justify"
                mobile-arrows>
          <template v-for="(item, index) in tabs" :key="index">
            <div>
              <q-tab :name="item.value"
                     @click="onClickTab(item)">
                <o-icon :name="item.icon" />
                <o-tooltip>
                  {{ item.label }}
                </o-tooltip>
              </q-tab>
            </div>
          </template>
        </q-tabs>
      </nav>
    </section>

    <section class="o-page-container" :class="{ 'no-header': !header || !leftDrawerShow }">
      <q-tab-panels v-model="selectedActivity"
                    class="fit bg-transparent"
                    keep-alive>
        <template v-for="(item, index) in tabs" :key="index">
          <q-tab-panel :name="item.value">
            <component :is="item.component"
                       :width="width"
                       :class="{ 'no-header': !header }" />
          </q-tab-panel>
        </template>
      </q-tab-panels>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'

import TocList from './children/toc-list.vue'
import AnnotationList from './children/annotation-list.vue'
import SeaerchList from './children/search-list.vue'
import useReader from 'src/hooks/useReader'

const props = defineProps({
  header: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 300
  },
})

const {
  activity,
  consoleMenus,
  leftDrawerShow,
  toggleLeftDrawer,
  setActivity,
} = useReader()

const selectedActivity = ref('toc')
const activityHovered = ref(false)

const tabs = computed(() => {
  return [
    { label: 'Toc', value: 'toc', icon: 'toc', component: TocList },
    { label: 'Annotation', value: 'annotation', icon: 'notes', component: AnnotationList },
    { label: 'Search', value: 'search', icon: 'search', component: SeaerchList },
  ]
})

function onClickTab (item: Indexable) {
  setActivity(item.value)
  activityHovered.value = true
}

function initActivity() {
  const activity = 'toc'
  setActivity(activity)
  selectedActivity.value = activity
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
    padding: 0;

    .q-btn {
      width: 36px !important;
      height: 36px !important;
      min-height: 36px;
      min-width: 36px;

      .q-icon {
        font-size: 1.4rem;
      }
    }

    .header-left {
      padding: 0 10px;
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

  .o-drawer-navi {
    box-shadow: none;
    height: 100%;

    .header-item {
      display: none;
    }

    .list {
      padding: 0 8px;

      .q-expansion-item__toggle-icon {
        font-size: 1.2rem;
      }

      .q-expansion-item__content {
        .header-item {
          display: flex;
        }
      }

      .q-item {
        border-radius: 4px;

        &.active:before {
          border-radius: 4px;
        }
      }
    }
  }

  .o-page-container {
    top: 90px;

    &.no-header {
      top: 50px;
    }

    .q-tab-panel {
      padding: 0;
    }
  }
}

</style>
