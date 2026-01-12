<template>
  <resizable-drawer
    v-model="drawerOpen"
    :default-width="width"
    :breakpoint="200"
    :overlay="leftDrawerHoverShow || overlay"
    class="left-drawer"
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
        <tab-navi :width="width" class="bg-accent" header />
      </transition>
    </section>
  </resizable-drawer>
</template>

<script setup lang="ts">
import {onBeforeMount, ref, watch} from 'vue'
import ResizableDrawer from 'core/components/layout/ResizableDrawer.vue'
import { READER_DRAWER_DEFAULT_SIZE } from 'core/constants/style'

import TabNavi from './tab-navi.vue'
import useReader from 'src/hooks/useReader'

const emit = defineEmits(['leave'])

const { leftDrawer, leftDrawerShow, leftDrawerHoverShow, setLeftDrawerWidth } = useReader()
const width = ref(READER_DRAWER_DEFAULT_SIZE)
const drawerOpen = ref(true)
const overlay = ref(false)

watch(() => leftDrawerShow.value, (newValue) => {
  overlay.value = !newValue
  const timeout = newValue ? 0 : 1000
  setTimeout(() => {
    drawerOpen.value = newValue
  }, timeout)
})

watch(() => leftDrawerHoverShow.value, (newValue) => {
  drawerOpen.value = newValue
})

function onResize(value: number) {
  console.log('width', value)
  width.value = value
  setLeftDrawerWidth(value)
}

onBeforeMount(() => {
  drawerOpen.value = leftDrawerShow.value
  width.value = leftDrawer.value.width
})

</script>

<style lang="scss">
.left-drawer {
  .drawer-separator {
    background: var(--q-dark);
  }
}

.q-drawer:has(.hover-shown) {
  top: 60px;
  bottom: 60px;
  border-radius: 0 6px 6px 0;

  .drawer-separator {
    background: transparent;
  }

  .q-drawer__content {
    border-radius: 0 6px 6px 0;
  }

  .tab-navi {
    border-radius: 0 6px 6px 0;
    box-shadow: rgba(15, 15, 15, .05) 0 0 0 1px,
      rgba(15, 15, 15, .01) 0 3px 6px,
      rgba(15, 15, 15, .02) 0 9px 24px;
    background: var(--q-secondary) !important;
  }
}

</style>
