<template>
  <q-drawer v-model="drawerOpen"
            :width="sidebarWidth"
            :mini="miniState"
            :mini-width="60"
            class="bg-secondary default-drawer">
    <header class="row col-12 items-center navi-header">
      <div class="row items-center justify-center cursor-pointer logo" @click="$router.push('/')">
        <img src="/logo.png" :width="40" />
      </div>
      <div class="name">
        {{$t('app.name')}}
      </div>
    </header>

    <q-scroll-area class="o-scroll-wrapper navi-body"
                   :thumb-style="{width: '4px'}">
      <o-hover-menu v-for="(data, index) of consoleMenus"
                    :key="index"
                    :offset="[4, 35]"
                    :nohover="!miniState"
                    min-width="240px"
                    anchor="top right"
                    self="top left">
        <template #trigger>
          <template v-if="miniState">
            <o-navi-expansion-item :parent-key="data.name"
                                   :data="data"
                                   v-if="data.children?.length && !data.meta?.hidden" />
          </template>
          <template v-else>
            <template v-if="data.children?.length">
              <!-- Top group -->
              <template v-if="naviFlatten">
                <div class="menu-label" :class="{'first': index===0}">
                  {{ menuLabel(data.name) }}
                </div>
                <o-navi-expansion-sub-items :parent-key="data.name"
                                            :list="data.children"
                                            :level="1"
                                            collapse
                                            show-item-icon
                                            v-if="!data.meta?.hidden" />
              </template>
              <template v-else>
                <o-navi-expansion-item :parent-key="data.name"
                                       :data="data"
                                       :level="1"
                                       show-icon
                                       :collapse="activity !== data.name" />
              </template>
            </template>
            <template v-else>
              <o-navi-expansion-item :parent-key="data.name"
                                     :data="data"
                                     show-item-icon />
            </template>
          </template>
        </template>

        <section class="mini-menu" v-if="miniState">
          <header class="row col-12 justify-center q-py-sm bg-accent text-bold">
            {{ menuLabel(data.name) }}
          </header>
          <q-separator class="bg-accent" />
          <section class="q-mb-sm">
            <o-navi-expansion-sub-items :parent-key="data.name"
                                        :list="data.children"
                                        :level="1"
                                        show-item-icon
                                        v-if="!data.meta?.hidden" />
          </section>
        </section>
      </o-hover-menu>
    </q-scroll-area>

    <footer class="navi-footer text-tips">
      <section class="row col-12 fit justify-around items-center">
        <q-btn :icon="naviFlatten ? 'account_tree' : 'storage'" round flat
               @click="toggleNaviFlatten" v-if="!miniState">
          <o-tooltip position="right">
            {{$t('expand')}}
          </o-tooltip>
        </q-btn>
        <q-btn icon="settings" round flat @click="openDialog({type: 'settings'})">
          <o-tooltip position="right">
            {{ $t('settings') }}
          </o-tooltip>
        </q-btn>
        <q-btn :icon="miniState ? 'mdi-backburger rotate-180' : 'mdi-menu-open'"
               @click="toggleSidebar"
               round flat>
          <o-tooltip position="right">
            {{miniState ? $t('expand') : $t('collapse')}}
          </o-tooltip>
        </q-btn>
      </section>
    </footer>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useNaviStore } from 'stores/navi.setup';
import useSetting from 'core/hooks/useSetting';
import { menuLabel } from 'core/hooks/useMenu';
import useDialog from 'core/hooks/useDialog';
import useNavi from 'src/hooks/useNavi';

import ONaviExpansionItem from 'core/components/navi/ONaviExpansionItem.vue';
import ONaviExpansionSubItems from 'core/components/navi/ONaviExpansionSubItems.vue';
import OHoverMenu from 'core/components/menu/OHoverMenu.vue';

const props = defineProps({
  drawerWidth: { type: Number, default: 300 },
});

const route = useRoute();
const naviStore = useNaviStore();
const { openDialog } = useDialog();
const { naviFlatten, toggleNaviFlatten} = useSetting();

const {
  consoleMenus,
  activity,
  setActivity,
  reduceActivity
} = useNavi();

const width = ref(300);
const drawerOpen = ref(true);
const miniState = ref(false);

function toggleSidebar () {
  miniState.value = !miniState.value;
  naviStore.setDrawerItem({key: 'miniState', value: miniState.value});
}

const drawerMini = computed(() => {
  return naviStore.drawer.miniState;
});

const sidebarWidth = computed(() => {
  return miniState.value ? 60 : width.value;
});

function initActivity() {
  const activity = reduceActivity(route.path);
  setActivity(activity);
}

watch(
  () => props.drawerWidth,
  (newValue) => {
    width.value = newValue;
  }
)

watch(() => drawerMini.value, (newValue) => {
  miniState.value = newValue;
})

onBeforeMount(() => {
  width.value = props.drawerWidth;
  miniState.value = drawerMini.value;

  initActivity();
});
</script>

<style lang="scss">
.default-drawer {
  .navi-header {
    height: 60px;
    overflow: hidden;

    .logo {
      width: 60px;
      height: 60px;
    }

    .name {
      font-size: 1.2rem;
    }
  }

  .navi-body {
    top: 60px;
    bottom: 60px;

    .menu-label {
      padding: 0 12px;
      opacity: 0.3;
      margin-top: 14px;

      &.first {
        margin-top: 4px;
      }
    }
  }

  .navi-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
  }
}

.q-drawer--mini .default-drawer {
  .o-navi-expansion-item .q-expansion-item {
    .q-item {
      height: 60px;
      padding: 0 10px;
    }
  }

  .navi-footer {
    height: 120px;
  }
}
</style>
