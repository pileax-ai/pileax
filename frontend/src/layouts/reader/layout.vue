<template>
  <q-layout view="lHr Lpr lFr"
            class="o-layout layout-reader bg-transparent"
            :class="`theme-${theme}`">
    <!--Drawers-->
    <left-drawer @leave="onLeftDrawerLeave" />
    <right-drawer ref="rightDrawerRef"
                  @leave="onRightDrawerLeave($event)" />

    <!--Drawer Handlers -->
    <div class="drawer-handler absolute-left"
         @mouseenter="onLeftDrawerEnter"
         v-if="!leftDrawerShow">
    </div>
    <div class="drawer-handler  absolute-right"
         @mouseenter="onRightDrawerEnter"
         v-if="!rightDrawerShow">
    </div>

    <!--PageView-->
    <q-page-container>
      <slot></slot>
    </q-page-container>

    <!--Dialogs-->
    <reader-modal-entry />
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue';
import { useAppStore } from 'stores/app';
import useReader from 'src/hooks/useReader';

import LeftDrawer from './navi/left-drawer.vue';
import RightDrawer from './navi/right-drawer.vue';
import ReaderModalEntry from 'core/components/modal/ReaderModalEntry.vue';

const appStore = useAppStore();
const {
  leftDrawerShow,
  leftDrawerHoverShow,
  rightDrawerShow,
  rightDrawerHoverShow,
  setLeftDrawerHoverShow,
  setRightDrawerHoverShow
} = useReader();

const rightDrawerRef = ref(null);

const theme = computed(() => {
  return appStore.setting.theme.name;
});

function init () {
  console.log('init')
}

function onLeftDrawerEnter() {
  setLeftDrawerHoverShow(true);
}

function onLeftDrawerLeave() {
  if (leftDrawerHoverShow.value) {
    setLeftDrawerHoverShow(false);
  }
}

function onRightDrawerEnter() {
  // setRightDrawerHoverShow(true);
}

function onRightDrawerLeave(event: MouseEvent) {
  const rect = rightDrawerRef.value?.$el.getBoundingClientRect();
  const screenWidth = rect.width;
  const left = event.clientX;
  const offset = screenWidth - left; // offset: 206, Todo

  if (rightDrawerHoverShow.value && offset > 206) {
    setRightDrawerHoverShow(false);
  }
}

onBeforeMount(() => {
  init();
})
</script>

<style lang="scss">
  @import "style";
</style>
