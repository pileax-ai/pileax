<template>
  <o-common-dialog class="image-viewer-dialog"
                   :title="dialog.title"
                   :icon="dialog.icon"
                   :show="dialog.type === 'image-viewer'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk">
    <div class="image-container"
         ref="imageContainerRef"
         @wheel.prevent="onWheel"
         @dblclick="resetZoom"
         @click="onBackgroundClick">
      <img ref="imageRef"
           :src="currentImage"
           alt="image"
           :style="imageStyle"
           @mousedown="onMouseDown"
           @click.stop />
    </div>

    <footer>
      <div class="action-group">
        <q-btn
          icon="arrow_back"
          :class="{ disabled: currentIndex <= 0 }"
          @click="onPrevious" flat
        />
        <q-btn
          icon="arrow_back"
          class="rotate-180"
          :class="{ disabled: currentIndex >= images.length - 1 }"
          @click="onNext" flat
        />
      </div>
      <div class="action-group">
        <q-btn icon="horizontal_rule" @click="zoomOut" flat />
        <div class="o-btn scale">{{ scalePercent }}%</div>
        <q-btn icon="add" @click="zoomIn" flat />
        <q-btn icon="rotate_right" @click="rotateRight" flat />
        <q-btn @click="onDownload" flat>
          <o-icon name="icon-download" size="1.4rem" />
        </q-btn>
        <q-btn icon="close" @click="onClose" flat>
          <o-tooltip>{{$t('close')}} (ESC)</o-tooltip>
        </q-btn>
      </div>
    </footer>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import useDialog from 'core/hooks/useDialog'
import useBookDetails from 'src/hooks/useBookDetails'

const { dialog, onHide, onOk } = useDialog()
const { downloadImage } = useBookDetails()

const style = computed(() => {
  return {
    padding: '0px'
  }
})

const images = computed(() => dialog.value.images)
const current = computed(() => dialog.value.current || 0)

const currentIndex = ref(0)
const scale = ref(0.75)
const rotation = ref(0)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imageRef = ref<HTMLImageElement | null>(null)
const imageContainerRef = ref<HTMLDivElement | null>(null)

const ZOOM_CONFIG = {
  MIN_SCALE: 0.1,
  MAX_SCALE: 10,
  STEP: 0.1,
  WHEEL_SENSITIVITY: 0.001,
}

const currentImage = computed(() => {
  const len = images.value.length
  let value = ''
  if (len > 0) {
    value =
      currentIndex.value >= 0 && currentIndex.value < len
        ? images.value.at(currentIndex.value)
        : images.value.at(0)
  }

  return value
})


const imageStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value}) rotate(${rotation.value}deg)`,
  transformOrigin: 'center center',
  cursor: isDragging.value ? 'grabbing' : scale.value > 1 ? 'grab' : 'default',
}))

const scalePercent = computed(() => {
  return parseInt(`${scale.value * 100}`)
})

const onWheel = (event: WheelEvent) => {
  event.preventDefault()

  const delta = -event.deltaY * ZOOM_CONFIG.WHEEL_SENSITIVITY

  let newScale = scale.value + delta
  newScale = Math.max(
    ZOOM_CONFIG.MIN_SCALE,
    Math.min(ZOOM_CONFIG.MAX_SCALE, newScale)
  )

  if (imageContainerRef.value && imageRef.value) {
    const rect = imageContainerRef.value.getBoundingClientRect()
    const mouseX = event.clientX - rect.left - rect.width / 2
    const mouseY = event.clientY - rect.top - rect.height / 2

    const scaleDiff = newScale - scale.value
    position.value.x -= mouseX * scaleDiff
    position.value.y -= mouseY * scaleDiff
  }

  scale.value = newScale
}

const onMouseDown = (event: MouseEvent) => {
  if (scale.value <= 1) return

  event.preventDefault()
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y,
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return

  position.value.x = event.clientX - dragStart.value.x
  position.value.y = event.clientY - dragStart.value.y
}

const onMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

const zoomIn = () => {
  scale.value = Math.min(ZOOM_CONFIG.MAX_SCALE, scale.value + ZOOM_CONFIG.STEP)
}

const zoomOut = () => {
  scale.value = Math.max(ZOOM_CONFIG.MIN_SCALE, scale.value - ZOOM_CONFIG.STEP)
}

const resetZoom = () => {
  scale.value = 1
  position.value = { x: 0, y: 0 }
}

const rotateRight = () => {
  rotation.value += 90
}

const onPrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    resetZoom()
  }
}

const onNext = () => {
  if (currentIndex.value < images.value.length - 1) {
    currentIndex.value += 1
    resetZoom()
  }
}

const onClose = () => {
  resetZoom()
  onHide()
}

const onDownload = () => {
  downloadImage(currentImage.value)
}

const onKeyDown = (event: KeyboardEvent) => {
  event.preventDefault()
  event.stopPropagation()

  switch (event.key) {
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
    case 'ArrowLeft':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        onPrevious()
      }
      break
    case 'ArrowRight':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        onNext()
      }
      break
    case 'Escape':
      onClose()
      break
  }
}

function onBackgroundClick(event: MouseEvent) {
  if (event.target === imageContainerRef.value) {
    onClose()
  }
}

watch(
  current,
  (newValue) => {
    currentIndex.value = newValue
    resetZoom()
  }
)

onMounted(() => {
  currentIndex.value = current.value
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style lang="scss">
.image-viewer-dialog {
  .q-dialog__inner {
    padding: 0;

    > div {
      max-height: 100vh !important;
    }
  }

  .dialog-card {
    max-width: unset !important;
    background: transparent;
    box-shadow: none;

    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 8px;
    min-width: 75vw;
    min-height: 75vh;
    height: 100vh;
    width: 100vw;
    resize: both;
    overflow: hidden;
  }
  .dialog-content {
    display: flex;
    flex: 1;
    padding: 0;
    overflow: hidden;
    justify-content: center;
    align-items: center;

    .image-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      img {
        max-width: 100%;
        max-height: 100%;
        transition: transform 0.1s ease;
        object-fit: contain;
        border-radius: 4px;
      }
    }

    footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      z-index: 10001;
      display: flex;
      justify-content: center;
      align-items: center;

      .action-group {
        display: flex;
        border-radius: 8px;
        backdrop-filter: blur(10px);
        background: rgba(0, 0, 0, 0.5);

        &:not(:first-child) {
          margin-left: 1rem;
        }

        .q-btn, .o-btn {
          width: 36px;
          height: 36px;
          padding: 0;
          border-radius: 0;
          color: rgba(#ffffff, 0.75);
          background: transparent;
          transition: all 0.2s ease;

          &.scale {
            font-size: 0.9rem;
            width: 50px;
            padding: 0;
            opacity: 0.6;
            cursor: default;
          }

          &.disabled {
            color: rgba(#ffffff, 0.2) !important;
            cursor: not-allowed !important;
          }

          &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff;
          }

          &:first-child {
            border-radius: 6px 0 0 6px;
          }

          &:last-child {
            border-radius: 0 6px 6px 0;
          }

          .q-icon {
            font-size: 1.4rem;
          }
        }
      }
    }
  }

}
</style>
