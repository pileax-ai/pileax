<template>
  <div class="row items-center text-readable o-title-bar-overlay no-drag-region">
    <q-btn class="col-4" flat @click="onMinimized">
      <o-icon name="icon-fluent-minimize" />
    </q-btn>
    <q-btn class="col-4" flat @click="ipcService.maximizeWindow()">
      <o-icon :name="isMaximized ? 'icon-fluent-restore' : 'icon-fluent-maximize'" />
    </q-btn>
    <q-btn class="col-4 close" flat @click="ipcService.closeWindow()">
      <o-icon name="icon-fluent-close" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core';
import { ipcService } from 'src/api/ipc';

defineProps({
  link: {
    type: String,
    default: ''
  },
});

const { width, height } = useWindowSize();
const isMaximized = ref(false);

function onMinimized() {
  ipcService.minimizeWindow();
}

async function updateWindowState() {
  isMaximized.value = await ipcService.isWindowMaximized();
}

watch(() => width.value, (newValue) => {
  updateWindowState();
})

onMounted(() => {
  updateWindowState();
})
</script>

<style lang="scss">
.o-title-bar-overlay {
  display: none;
  width: 138px !important;
  min-height: 40px;
  .q-btn {
    height: 100%;
    min-height: 40px;
    padding: 0;
    border-radius: 0;

    .o-icon {
      width: 10px;
      height: 10px;
    }

    &.close:hover {
      color: #ffffff;
      background: #f44336;
    }
  }
}
</style>
