<template>
  <resizable-drawer
    v-model="drawerOpen"
    side="right"
    :default-width="width"
    :breakpoint="200"
    :overlay="rightDrawerHoverShow"
    bordered
    class="right-drawer"
    :class="{'hover-show': rightDrawerHoverShow}"
    @leave="emit('leave', $event)"
    @resize="onResize">
    <section class="col-12 fit bg-accent side-bar">
      <q-splitter v-model="splitterPercent"
                  :limits="[0, 80]"
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
.right-drawer {
  .side-bar {
    .q-splitter {
      height: 100vh;
    }
    overflow: hidden;

    header {
      height: 40px;
      padding: 0 6px;
    }

    .o-scroll-wrapper {
      top: 40px;
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
