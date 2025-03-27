<template>
  <resizable-drawer
    v-model="drawerOpen"
    :default-width="width"
    :breakpoint="200"
    :overlay="leftDrawerHoverShow || overlay"
    class="tab-drawer"
    :class="{
      'hover-shown': leftDrawerHoverShow || !leftDrawerShow,
      'shadow-2': !leftDrawerShow
    }"
    @resize="onResize"
    @leave="emit('leave', $event)">
    <section class="col-12 fit side-bar">
      <transition appear
                  enter-active-class="animated slideInLeft"
                  leave-active-class="animated slideOutLeft">
        <tab-navi :width="width" class="bg-accent" :header="leftDrawerShow" />
      </transition>
    </section>
  </resizable-drawer>
</template>

<script setup lang="ts">
import {onBeforeMount, ref, watch} from 'vue';
import { DRAWER_DEFAULT_SIZE } from 'core/constants/style';

import ResizableDrawer from 'core/components/layout/ResizableDrawer.vue';
import TabNavi from './tab-navi.vue';
import useNavi from 'src/hooks/useNavi';

const emit = defineEmits(['leave']);

const { leftDrawerShow, leftDrawerHoverShow } = useNavi();
const width = ref(DRAWER_DEFAULT_SIZE);
const drawerOpen = ref(true);
const overlay = ref(false);

watch(() => leftDrawerShow.value, (newValue) => {
  overlay.value = !newValue;
  const timeout = newValue ? 0 : 1000;
  setTimeout(() => {
    drawerOpen.value = newValue;
  }, timeout)
})

watch(() => leftDrawerHoverShow.value, (newValue) => {
  drawerOpen.value = newValue;
})

function onResize(value: number) {
  width.value = value;
}

onBeforeMount(() => {
  drawerOpen.value = leftDrawerShow.value;
})

</script>

<style lang="scss">
.tab-drawer {
  .drawer-separator {
    background: var(--q-dark);
  }
}

.q-drawer:has(.hover-shown) {
  top: 80px;
  bottom: 80px;
  border-radius: 0 8px 8px 0;

  .drawer-separator {
    background: transparent;
  }

  .q-drawer__content {
    border-radius: 0 8px 8px 0;
  }

  .tab-navi {
    border-radius: 0 8px 8px 0;
    box-shadow: rgba(15, 15, 15, .05) 0 0 0 1px,
    rgba(15, 15, 15, .1) 0 3px 6px,
    rgba(15, 15, 15, .2) 0 9px 24px;
  }
}

</style>
