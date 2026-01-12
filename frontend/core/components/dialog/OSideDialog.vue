<template>
  <q-dialog ref="modal"
            :maximized="maximized"
            :seamless="seamless"
            @before-show="onBeforeShow"
            @show="$emit('show')"
            @hide="$emit('close')"
            :position="fullScreen ? 'standard' : positionAlt"
            :class="`o-side-dialog ${contentClass} ${view}`">
    <q-card :style="contentStyle"
            class="bg-white dialog-card"
            v-if="positionAlt==='standard'">
      <q-card-section class="bg-deep no-padding no-drag-region header" v-if="!printing">
        <q-toolbar>
          <q-toolbar-title class="row items-center text-bold">
            <o-icon :name="icon" size="1.4rem" class="q-mr-sm" colored v-if="icon" />
            {{title}}
          </q-toolbar-title>

          <div class="row text-tips actions">
            <q-btn flat round dense icon="print" @click="onPrint" v-if="printable" />
            <q-btn flat round dense :icon="viewIcon" @click="onToggleView" v-if="toggleView" />
            <q-btn flat round dense :icon="positionIcon" @click="onTogglePosition" />
            <q-btn flat v-close-popup round dense icon="cancel" />
          </div>
          <o-tool-bar-overlay v-if="view==='full-screen'" />
        </q-toolbar>
      </q-card-section>

      <q-card-section class="no-padding full-width">
        <slot name="content"></slot>
      </q-card-section>
    </q-card>
    <q-layout view="lhh LpR lff" container :style="contentStyle" class="bg-secondary" v-else>
      <q-header class="bg-accent text-info header no-drag-region" v-if="!printing">
        <q-toolbar>
          <q-toolbar-title class="row items-center text-bold">
            <o-icon :name="icon" size="1.4rem" class="q-mr-sm" colored v-if="icon" />
            {{title}}
          </q-toolbar-title>
          <div class="row text-tips actions">
            <q-btn flat round dense icon="print" @click="onPrint" v-if="printable" />
            <q-btn flat round dense :icon="viewIcon" @click="onToggleView" v-if="toggleView" />
            <q-btn flat round dense :icon="positionIcon" @click="onTogglePosition" />
            <q-btn flat v-close-popup round dense icon="cancel" />
          </div>
          <o-tool-bar-overlay v-if="view==='full-screen'" />
        </q-toolbar>
      </q-header>
      <q-page-container :class="{'print': printing}">
        <q-page class="bg-secondary" v-if="scrollable">
          <q-scroll-area class="o-page-container">
            <section>
              <slot name="content"></slot>
            </section>
          </q-scroll-area>
        </q-page>
        <section v-else>
          <slot name="content"></slot>
        </section>
      </q-page-container>

      <div class="dialog-resizer"
           :class="`${isResizing ? 'is-resizing' : '' }`" v-if="view==='normal'">
        <div
          class="resize-handle"
          v-touch-pan.horizontal.prevent.mouse.preserveCursor="onMouseMove">
        </div>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch, nextTick} from 'vue'
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  seamless: {
    type: Boolean,
    default: true
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  printable: {
    type: Boolean,
    default: false
  },
  toggleView: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Title'
  },
  position: {
    type: String,
    default: 'right' // standard, right
  },
  contentClass: {
    type: String,
    default: 'card'
  },
  style: {
    type: Object,
    default: function () {
      return { }
    }
  },
  scrollable: {
    type: Boolean,
    default: false
  },
  side: {
    type: String as () => 'left' | 'right',
    default: 'right'
  },
})
const emit = defineEmits(['confirm', 'close', 'show', 'resize'])

const modal = ref()
const positionAlt = ref('right')
const view = ref('normal')
const printing = ref(false)

const width = ref(0)
const minWidth = ref(0)
const maxWidth = ref(0)
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

function onMouseMove(e :any) {
  if (e.isFirst) {
    startWidth.value = width.value
    startX.value = e.position.left
    isResizing.value = true
    document.documentElement.style.cursor = 'col-resize'
  } else if (e.isFinal) {
    isResizing.value = false
    document.documentElement.style.cursor = ''
  } else {
    const deltaX = props.side === 'left'
      ? e.position.left - startX.value
      : startX.value - e.position.left
    const newWidth = startWidth.value + deltaX
    width.value = Math.max(minWidth.value, Math.min(maxWidth.value, newWidth))
    // console.log('width', newWidth, width.value);
    emit('resize', width.value)
  }
}

function onBeforeShow() {
  positionAlt.value = props.position
  const defaultWidth = toPixel(props.style.width)
  minWidth.value = toPixel(props.style.minWidth) || defaultWidth
  maxWidth.value = toPixel(props.style.maxWidth) || 2 * defaultWidth
  width.value = Math.max(defaultWidth, minWidth.value)
  width.value = Math.min(width.value, maxWidth.value)

  // console.log('style', props.style, width.value, minWidth.value, maxWidth.value);
}

function toPixel(value: string) {
  let v = (value || '0').replace('px', '')
  if (v.includes('vw')) {
    const viewportWidth = window.innerWidth
    v = v.replace('vw', '')
    return (parseInt(v) / 100) * viewportWidth
  } else {
    return parseInt(v)
  }
}

async function onPrint()  {
  printing.value = true
  await nextTick()
  window.print()
  setTimeout(() => {
    printing.value = false
  }, 10)
}

function onToggleView () {
  view.value = (view.value === 'normal') ? 'full-screen' : 'normal'
}

function onTogglePosition () {
  positionAlt.value = (positionAlt.value === 'right') ? 'standard' : 'right'
  // this.setDialogPosition(positionAlt.value);
}

const maximized = computed(() => {
  return positionAlt.value === 'right' || view.value === 'full-screen'
})

const positionIcon = computed(() => {
  return positionAlt.value === 'right' ? 'wysiwyg' : 'view_sidebar'
})

const viewIcon = computed(() => {
  return view.value === 'normal' ? 'fullscreen' : 'fullscreen_exit'
})

const contentStyle = computed(() => {
  return view.value === 'normal'
    ? { width: `${width.value}px` }
    : { width: '100vw' }
})

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      view.value = props.fullScreen ? 'full-screen' : 'normal'
      modal.value.show()
    } else {
      modal.value.hide()
    }
  }
)

onMounted(() => {
  if (props.show) {
    modal.value.show()
  }
})
</script>

<style lang="scss">
.o-side-dialog {
  .q-dialog__inner--standard {
    .dialog-card {
      border-radius: 6px;
      .q-page {
        min-height: unset !important;
      }
    }
  }
  .q-dialog__inner--right {
    .q-layout-container {
      max-height: 100vh !important;
    }
  }

  .q-toolbar {
    min-height: 40px;
    padding: 0 8px;

    .q-toolbar__title {
      font-size: 1rem;
    }

    .q-icon {
      font-size: 1.2rem;
    }
  }

  .q-tab-panel {
    padding: 16px 0;
  }

  .o-console-section {
    .console-header {
      border-bottom: solid 1px var(--q-accent);

      .console-toolbar {
        padding: 0 1rem;

        .btn-star, .btn-collapse, .btn-fullscreen {
          display: none;
        }
      }
    }
    .console-content {
      padding: 0;
    }
  }

  .dialog-resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    background: transparent;
    z-index: 1001;
    cursor: col-resize;
    user-select: none;
    width: 4px;

    &.left {
      right: 0;
    }

    &.right {
      left: 0;
    }

    .resize-handle {
      position: absolute;
      left: -6px;
      right: -6px;
      top: 0;
      bottom: 0;
      cursor: col-resize;
      user-select: none;
      z-index: 1000;
      background: transparent;
    }
  }

  &.card {
    .q-dialog__backdrop {
      background: rgba(0, 0, 0, 0.1);
    }
    .q-dialog__inner {
      margin: 10px;

      .q-layout-container {
        border-radius: 6px !important;
        box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
      }
    }
  }

  &.full-screen {
    .q-dialog__inner {
      margin: 0 !important;
    }
  }
}

</style>
