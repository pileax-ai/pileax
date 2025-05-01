<template>
  <resizable-drawer
    v-model="drawerOpen"
    side="right"
    :default-width="width"
    :breakpoint="200"
    :overlay="rightDrawerHoverShow"
    class="right-drawer"
    :class="{'hover-show': rightDrawerHoverShow}"
    @leave="emit('leave', $event)"
    @resize="onResize">
    <section class="col-12 fit bg-secondary side-bar">
      <q-splitter v-model="splitterPercent"
                  :limits="[0, 80]"
                  separator-class="bg-accent"
                  :separator-style="`height: ${splitterPercent ? 8 : 0}px;`"
                  horizontal
                  reverse>
        <template #before>
          <reader-side-panel main />
        </template>

        <template #after>
          <reader-side-panel />
        </template>
      </q-splitter>
    </section>
  </resizable-drawer>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from 'vue';
import ResizableDrawer from 'core/components/layout/ResizableDrawer.vue';
import ReaderSidePanel from 'src/components/reader/ReaderSidePanel.vue';

import useReader from 'src/hooks/useReader';

const emit = defineEmits(['leave']);
const { rightDrawer, rightDrawerShow, rightDrawerHoverShow, setRightDrawerWidth } = useReader();

const width = ref(300);
const drawerOpen = ref(true);
const splitterPercent = ref(0);

function onResize(value: number) {
  setRightDrawerWidth(value);
}

watch(() => rightDrawerShow.value, (newValue) => {
  drawerOpen.value = newValue;
})

watch(() => rightDrawerHoverShow.value, (newValue) => {
  drawerOpen.value = newValue;
})

watch(() => rightDrawer.value.split, (newValue) => {
  console.log('split', newValue);
  splitterPercent.value = newValue ? 50 : 0;
})

onBeforeMount(() => {
  drawerOpen.value = rightDrawerShow.value;
  splitterPercent.value = rightDrawer.value.split ? 50 : 0;
  width.value = rightDrawer.value.width;
})

</script>

<style lang="scss">
.q-drawer:has(.right-drawer) {
  background: red;
}

.right-drawer {
  .side-bar {
    padding-left: 8px;
    .q-splitter {
      height: 100vh;
    }
    overflow: hidden;

    header {
      height: 40px;
      padding: 0 8px;
    }

    .o-scroll-wrapper {
      top: 40px;
    }
  }

  .drawer-separator {
    width: 8px;
    background: var(--q-accent);

    &:hover, &.is-resizing {
      background: var(--q-accent)!important;
    }
  }

  &.hover-show {
    .side-bar {
      padding-left: 0;
    }
    .drawer-separator {
      width: 0;
    }
  }
}

.q-drawer--right:has(.hover-show) {
  //box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
  .side-bar {
    background: var(--q-secondary) !important;
  }
}
</style>
