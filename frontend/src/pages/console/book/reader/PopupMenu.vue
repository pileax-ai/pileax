<template>
  <section ref="triggerRef" class="reader-popup-menu">
    <div ref="menuRef" class="bg-info text-secondary popup-menu">
      <div class="row no-wrap q-gutter-x-sm actions">
        <template v-for="(item, index) in actions" :key="index">
          <template v-if="item.show">
            <q-btn :class="{ 'active': item.value === currentAction }"
                   flat
                   @click.stop="onAction(item.value)"
                   v-if="item.value === 'annotation'">
              <div class="highlight column items-center">
                <o-icon name="icon-text" size="24px" />
                <div class="indicator" :style="{ background: currentAnnColorValue }"></div>
              </div>
              <o-tooltip>{{ item.label }}</o-tooltip>
            </q-btn>
            <o-copy-btn :value="selection.text"
                        :class="{ 'active': item.value === currentAction }"
                        flat
                        @click.stop="onAction(item.value)"
                        v-else-if="item.value === 'copy'">
              <o-tooltip>{{ item.label }}</o-tooltip>
            </o-copy-btn>
            <q-btn :icon="item.icon"
                   :class="{ 'active': item.value === currentAction }"
                   flat
                   @click.stop="onAction(item.value)"
                   v-else>
              <o-tooltip>{{ item.label }}</o-tooltip>
            </q-btn>
          </template>
        </template>

        <!-- Annotation style and color -->
        <q-menu v-model="showAnnotationMore"
                class="popup-annotation-menu"
                anchor="bottom middle" self="top middle"
                transition-show="jump-down" transition-hide="jump-up"
                :offset="[0, 24]" :touch-position="false">
          <section class="row justify-between items-center q-gutter-x-xl">
            <div class="row no-wrap q-gutter-x-sm styles">
              <template v-for="(item, index) in annotationStyles" :key="index">
                <q-btn :icon="item.icon"
                       class="bg-info text-secondary"
                       :style="`background: ${item.value === currentAnnStyle ? `${currentAnnColorValue} !important;` : ''}`"
                       flat round
                       @click.stop="onSetAnnStyle(item)">
                  <o-tooltip position="bottom">{{ $t(`book.annotationStyle.${item.label}`) }}</o-tooltip>
                </q-btn>
              </template>
            </div>
            <div class="row no-wrap q-gutter-x-sm actions items-center colors">
              <template v-for="(item, index) in annotationColors" :key="index">
                <q-icon :name="item.label === currentAnnColor ? 'check_circle' : 'circle'"
                        class="cursor-pointer"
                        size="24px"
                        :style="{ color: item.value }"
                        @click.stop="onSetAnnColor(item)">
                </q-icon>
              </template>
            </div>
          </section>
        </q-menu>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'
import type { Instance, Props } from 'tippy.js'
// import 'tippy.js/dist/tippy.css'
import { computed, onMounted, ref, watch } from 'vue'
import {
  addAnnotation,
  removeAnnotation,
  updateAnnotation,
} from 'src/api/service/ebook/book-annotation'
import useCommon from 'core/hooks/useCommon'
import useBook from 'src/hooks/useBook'
import useBookNote from 'src/hooks/useBookNote'
import useReader from 'src/hooks/useReader'
import useReaderSetting from 'src/hooks/useReaderSetting'
import { AnnotationColors } from 'core/constants/constant'
import { getAnnotationColor } from 'src/utils/book'

const emit = defineEmits(['share'])

const { t, copy } = useCommon()
const {
  workspaceBookId,
  bookId,
  progress,
  selection,
  setKeyword,
  setAnnotationTimer,
  setSelection
} = useBook()
const { openNote, refreshNote, deleteNote } = useBookNote()
const { rightDrawerShow, setRightDrawerHoverShow, setRightDrawerView } = useReader()
const { settings, setSettingItem } = useReaderSetting()
const triggerRef = ref()
const menuRef = ref()
const instance = ref<Instance<Props>>()
const popupShown = ref(false)
const currentAction = ref('')
const showAnnotationMore = ref(false)

const clickedAnnotation = computed(() => {
  return selection.value.annotation
})

const annStyle = computed({
  get() {
    return settings.value.annStyle
  },
  set(value: string) {
    setSettingItem('annStyle', value)
  }
})

const currentAnnStyle = computed(() => {
  return clickedAnnotation.value?.style || annStyle.value
})

const annColor = computed({
  get() {
    return settings.value.annColor
  },
  set(value: string) {
    setSettingItem('annColor', value)
  }
})

const currentAnnColor = computed(() => {
  return clickedAnnotation.value?.color || annColor.value
})

const currentAnnColorValue = computed(() => {
  return getAnnotationColor(currentAnnColor.value)
})

const shouldShowAnnotationMore = computed(() => {
  return (currentAction.value === 'annotation' || currentAction.value === 'removeAnnotation') &&
    !!clickedAnnotation.value &&
    popupShown.value
})

const actions = computed(() => {
  return [
    { label: t('reading.popup.clearHighlight'), value: 'removeAnnotation', icon: 'font_download_off', show: clickedAnnotation.value },
    { label: t('note._'), value: 'note', icon: 'article', show: clickedAnnotation.value },
    { label: t('reading.popup.highlight'), value: 'annotation', icon: 'font_download', show: !clickedAnnotation.value },
    { label: t('reading.popup.copy'), value: 'copy', icon: 'content_copy', show: true },
    { label: t('reading.popup.share'), value: 'share', icon: 'share', show: true },
    { label: t('reading.popup.search'), value: 'search', icon: 'search', show: true },
    { label: t('reading.aiReading'), value: 'aiReading', icon: 'o_headphones', show: true },
    { label: t('reading.popup.more'), value: 'more', icon: 'more_horiz', show: false },
  ]
})

const annotationStyles = computed(() => {
  return [
    { label: 'highlight', value: 'highlight', icon: 'font_download' },
    { label: 'underline', value: 'underline', icon: 'mdi-format-underline' },
    { label: 'squiggly', value: 'squiggly', icon: 'mdi-format-underline-wavy' },
    { label: 'strikethrough', value: 'strikethrough', icon: 'mdi-format-strikethrough' },
  ]
})

const annotationColors = computed(() => {
  return [
    { label: 'red', value: AnnotationColors.red },
    { label: 'orange', value: AnnotationColors.orange },
    { label: 'purple', value: AnnotationColors.purple },
    { label: 'blue', value: AnnotationColors.blue },
    { label: 'green', value: AnnotationColors.green },
  ]
})

function onAction(action: string) {
  // console.log('action', action)
  currentAction.value = action
  switch (action) {
    case 'annotation':
      onAnnotation()
      break
    case 'removeAnnotation':
      onRemoveAnnotation()
      hide(true)
      break
    case 'note':
      onNote()
      break
    case 'copy':
      // onCopy()
      break
    case 'search':
      onSearch()
      hide(true)
      break
    case 'aiReading':
      onAiReading()
      hide(true)
      break
    case 'share':
      emit('share')
      hide(true)
      break
    default:
      hide(true)
      break
  }
}

async function onAnnotation() {
  const { cfi, text } = selection.value
  if (!cfi || !text) {
    return
  }

  const annotation = {
    workspaceBookId: workspaceBookId.value,
    bookId: bookId.value,
    type: 'annotation',
    style: annStyle.value,
    color: annColor.value,
    value: cfi,
    page: progress.value.location?.current || 0,
    chapter: progress.value.tocItem?.label,
    title: text,
  }

  addAnnotation(annotation).then(res => {
    setAnnotationTimer(Date.now())
    setSelection({
      ...selection.value,
      annotation: res
    })
  })
}

async function onRemoveAnnotation() {
  deleteNote(clickedAnnotation.value)
}

function onSetAnnStyle(item: Indexable) {
  if (clickedAnnotation.value) {
    annStyle.value = item.value
    const data = {
      id: clickedAnnotation.value.id,
      style: item.value
    }
    const annotation = {
      ...clickedAnnotation.value,
      style: item.value
    }
    onUpdateAnnotation(annotation, data)
  }
}

function onSetAnnColor(item: Indexable) {
  if (clickedAnnotation.value) {
    annColor.value = item.label
    const data = {
      id: clickedAnnotation.value.id,
      color: item.label
    }
    const annotation = {
      ...clickedAnnotation.value,
      color: item.label
    }
    onUpdateAnnotation(annotation, data)
  }
}

function onUpdateAnnotation(annotation: Indexable, data: Indexable) {
  updateAnnotation(annotation, data)
  setSelection({
    ...selection.value,
    annotation
  })
  refreshNote(data)
  showAnnotationMore.value = true
}

function onNote() {
  openNote(clickedAnnotation.value.id)
  setRightDrawerView('note', true)
}

function onCopy() {
  copy(selection.value.text, true)
}

function onSearch() {
  setKeyword(selection.value.text)
  if (!rightDrawerShow.value) {
    setRightDrawerHoverShow(true)
  }
  setRightDrawerView('agent', true)
}

function onAiReading() {
  setRightDrawerView('tts', true)
}

function getOffset() {
  const pos = selection.value.pos
  const point = pos.point
  const dir = pos.dir
  const leftAlt = Math.floor(point.x * window.innerWidth) - 120
  let topAlt = Math.floor(point.y * window.innerHeight)
  if (dir === 'up') {
    topAlt -= 64
  } else {
    topAlt += 4
  }

  const left = leftAlt < 0 ? 0 : leftAlt
  const top = topAlt < 0 ? 0 : topAlt
  return {dir, left, top}
}

function show() {
  currentAction.value = ''
  const offset = getOffset()

  initTippy()
  if (instance.value) {
    instance.value.show()
    instance.value.popper.style.left = `${offset.left}px`
    instance.value.popper.style.top = `${offset.top}px`
    instance.value.popper.style.display = 'block'
  }
  popupShown.value = true
}

function hide(destroy = false) {
  instance.value?.hide()
  setRightDrawerHoverShow(false)

  if (destroy) {
    setTimeout(() => {
      instance.value?.destroy()
      instance.value = undefined
    }, 10)
    popupShown.value = false
    showAnnotationMore.value = false
  }
}

function initTippy() {
  if (clickedAnnotation.value) {
    currentAction.value = 'removeAnnotation'
  }

  if (instance.value) {
    return
  }

  instance.value = tippy(menuRef.value as HTMLElement, {
    appendTo: () => document.body,
    animation: 'shift-away', // perspective, scale, shift-away
    arrow: false,
    content: menuRef.value,
    delay: 0,
    duration: 100,
    interactive: true,
    placement: 'bottom-start',
    trigger: 'manual',
    hideOnClick: false,
    popperOptions: {
      modifiers: [
        {
          name: 'applyStyles',
          fn({ state }) {
            state.elements.popper.classList.add('reader-tippy')
          }
        }
      ]
    },
  })
}

watch(() => selection.value?.text, (newValue) => {
  if (newValue) {
    show()
  } else {
    hide()
  }
})

watch(shouldShowAnnotationMore, (newValue) => {
  setTimeout(() => {
    showAnnotationMore.value = newValue
  }, 200)
})

onMounted(() => {
  initTippy()
})
</script>

<style lang="scss">
.reader-popup-menu {
  display: none;
}

.popup-menu {
  position: absolute;
  padding: 7px 7px;
  border: 1px solid var(--q-info);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  .actions {
    .q-btn {
      width: 36px;
      height: 36px;

      &.active:before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: var(--q-secondary);
        opacity: 0.2;
      }
    }
  }

  .highlight {
    margin: 0 auto;
    .indicator {
      width: 20px;
      height: 4px;
      margin-top: -2px;
    }
  }
}

.reader-tippy {
  .tippy-box {
    background: transparent;
  }
}

.popup-annotation-menu {
  background: transparent !important;
  box-shadow: none !important;

  .styles {
    .q-btn {
      min-width: 36px;
      min-height: 36px;
    }
  }

  .colors {
    background: var(--q-info);
    border-radius: 36px;
    min-height: 36px;
    padding: 0 3px;

    .q-icon:last-child {
      margin-right: 7px;
    }
  }
}

.body--dark {
  .q-menu--dark.popup-annotation-menu {
    background: transparent !important;
    box-shadow: none !important;
  }
}
</style>
