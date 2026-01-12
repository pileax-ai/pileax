<template>
  <q-layout view="lHr Lpr lFr"
            class="o-layout layout-reader bg-transparent"
            :class="`theme-${theme}`">
    <!--Drawers-->
    <left-drawer @leave="onLeftDrawerLeave" />
    <right-drawer ref="rightDrawerRef"
                  @leave="onRightDrawerLeave($event)" />

    <!--Drawer Handlers -->
    <div class="drawer-handler left bottom absolute-left"
         :class="{'delay-hide': leftHandlerAutohide}"
         @mouseenter="onLeftDrawerEnter"
         v-if="!leftDrawerShow">
    </div>
    <div class="drawer-handler right bottom absolute-right"
         :class="{'delay-hide': rightHandlerAutohide}"
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
import { computed, ref, onBeforeMount, watch } from 'vue'
import { useAppStore } from 'stores/app'
import useReader from 'src/hooks/useReader'

import LeftDrawer from './navi/left-drawer.vue'
import RightDrawer from './navi/right-drawer.vue'
import ReaderModalEntry from 'core/components/modal/ReaderModalEntry.vue'
import { workspaceManager } from 'core/workspace/workspace-manager'

const appStore = useAppStore()
const {
  leftDrawerShow,
  leftDrawerHoverShow,
  rightDrawerShow,
  rightDrawerHoverShow,
  setLeftDrawerHoverShow,
  setRightDrawerHoverShow
} = useReader()

const rightDrawerRef = ref(null)
const leftHandlerAutohide = ref(false)
const rightHandlerAutohide = ref(false)

const theme = computed(() => {
  return appStore.setting.theme.name
})

function init () {
  console.log('init')
  workspaceManager.loadWorkspace()
}

function onLeftDrawerEnter() {
  setLeftDrawerHoverShow(true)
}

function onLeftDrawerLeave() {
  if (leftDrawerHoverShow.value) {
    setLeftDrawerHoverShow(false)
  }
}

function onRightDrawerEnter() {
  setRightDrawerHoverShow(true)
}

function onRightDrawerLeave(event: MouseEvent) {
  const rect = rightDrawerRef.value?.$el.getBoundingClientRect()
  const screenWidth = rect.width
  const left = event.clientX
  const offset = screenWidth - left // offset: 206, Todo

  if (rightDrawerHoverShow.value && offset > 206) {
    setRightDrawerHoverShow(false)
  }
}

watch(leftDrawerShow, (newValue) => {
  if (!newValue) {
    leftHandlerAutohide.value = false
    setTimeout(() => {
      leftHandlerAutohide.value = true
    }, 1000)
  }
})

watch(rightDrawerShow, (newValue) => {
  if (!newValue) {
    rightHandlerAutohide.value = true
  }
})

onBeforeMount(() => {
  init()
})
</script>

<style lang="scss">
.layout-reader {
  .q-page-container {
    overflow: hidden !important;
  }

  .drawer-handler {
    position: fixed;
    z-index: 10;
    width: 60px;
    top: 60px;
    bottom: calc(50vh + 50px);
    border-radius: 4px;
    background: var(--q-dark);
    opacity: 0;

    &.left {
      border-radius: 0 8px 8px 0;

      &.delay-hide {
        animation: hint-flash 4s ease forwards;
      }
    }

    &.right {
      border-radius: 8px 0 0 8px;
      transition: opacity 2s ease;

      &.delay-hide {
        //opacity: 0;
        animation: hint-flash 4s ease forwards;
      }
    }

    &.bottom {
      top: unset;
      bottom: 60px;
      height: calc(50vh - 120px);
    }
  }

  // toolbar
  .o-toolbar-btn {
    width: 28px;
    height: 28px;
    padding: unset;
    min-height: unset;
    border-radius: 4px;
    .q-icon {
      font-size: 20px;
    }
  }
}

@keyframes hint-flash {
  0%   { opacity: 0.3 }
  25%  { opacity: 1 }
  50%  { opacity: 0.3 }
  75%  { opacity: 1 }
  100% { opacity: 0 }
}
</style>
