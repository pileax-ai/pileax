<template>
  <section class="reader-side-panel">
    <o-tool-bar :window-id="windowId" v-if="rightDrawerShow" />
    <agent-view :main="main" />

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <reader-settings class="side-fixed"
                       :class="{ 'active': currentView === 'settings' }"
                       @close="settingsStatus = false"
                       v-if="settingsStatus && main" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <tts-player class="side-fixed"
                  :class="{ 'active': currentView === 'tts' }"
                  @close="ttsStatus = false;"
                  v-if="ttsStatus && main" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <book-note class="side-fixed"
                 :class="{ 'active': currentView === 'note' }"
                  @close="noteStatus = false;"
                  v-if="noteStatus && main" />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AgentView from './agent/index.vue'
import ReaderSettings from 'src/components/reader/settings/index.vue'
import TtsPlayer from 'src/components/reader/tts/tts-player.vue'
import BookNote from 'src/components/reader/note/book-note.vue'
import OToolBar from 'core/components/electron/OToolBar.vue'
import useBook from 'src/hooks/useBook'
import useReader from 'src/hooks/useReader'

const props = defineProps({
  main: {
    type: Boolean,
    default: false
  }
})

const { windowId } = useBook()
const {
  rightDrawer,
  rightDrawerShow,
  setRightDrawerHoverShow,
  setRightDrawerSplit,
  setRightDrawerView,
  closeRightDrawer,
  toggleRightDrawer,
} = useReader()

const currentView = computed(() => rightDrawer.value.view)

const settingsStatus = computed({
  get() {
    return rightDrawer.value.settings
  },
  set(val: boolean) {
    setRightDrawerView('settings', val)
  }
})

const ttsStatus = computed({
  get() {
    return rightDrawer.value.tts
  },
  set(val: boolean) {
    setRightDrawerView('tts', val)
  }
})

const noteStatus = computed({
  get() {
    return rightDrawer.value.note
  },
  set(val: boolean) {
    setRightDrawerView('note', val)
  }
})

function onClose() {
  setTimeout(() => {
    if (props.main) {
      closeRightDrawer()
    } else {
      setRightDrawerSplit(false)
    }
  }, 10)
}

function onPin() {
  const show = rightDrawerShow.value
  toggleRightDrawer()
  if (show) {
    setRightDrawerHoverShow(true)
  }
}

</script>

<style lang="scss">
.reader-side-panel {
  .side-fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9;

    &.active {
      z-index: 10;
    }
  }
}
</style>
