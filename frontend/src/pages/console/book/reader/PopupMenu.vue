<template>
  <section ref="triggerRef" class="reader-popup-menu">
    <div ref="menuRef" class="bg-accent popup-menu">
      <div class="row">
        <q-btn icon="mdi-marker-cancel" class="text-readable" flat square
               @click="onAction('removeAnnotation')" v-if="clickedAnnotation">
          <o-tooltip>删除划线</o-tooltip>
        </q-btn>
        <q-btn class="text-readable" flat square
               @click="onAction('annotation')" v-else>
          <div class="highlight">
            <q-icon name="mdi-format-color-highlight" />
            <div class="indicator"></div>
          </div>
          <o-tooltip>划线</o-tooltip>
        </q-btn>
        <q-btn icon="content_copy" class="text-readable" flat square
               @click="onAction('copy')">
          <o-tooltip>复制</o-tooltip>
        </q-btn>
        <q-btn icon="share" class="text-readable" flat square
               @click="onAction('share')">
          <o-tooltip>分享</o-tooltip>
        </q-btn>
        <q-btn icon="search" class="text-readable" flat square
               @click="onAction('search')">
          <o-tooltip>AI搜索</o-tooltip>
        </q-btn>
        <q-btn icon="more_horiz" class="text-readable" flat square>
          <o-tooltip>更多</o-tooltip>
        </q-btn>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'
import type { Instance, Props } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { computed, onMounted, ref, watch } from 'vue'
import {
  addAnnotation,
  removeAnnotation
} from 'src/api/service/ebook/book-annotation'
import useCommon from 'core/hooks/useCommon'
import useBook from 'src/hooks/useBook'
import useReader from 'src/hooks/useReader'

const emit = defineEmits(['share'])

const { copy } = useCommon()
const { workspaceBookId, bookId, progress, selection, setKeyword, setAnnotationTimer } = useBook()
const { rightDrawerShow, setRightDrawerHoverShow } = useReader()
const triggerRef = ref()
const menuRef = ref()
const instance = ref<Instance<Props>>()

const clickedAnnotation = computed(() => {
  return selection.value.annotation
})

function onAction(action: string) {
  hide(true)
  switch (action) {
    case 'annotation':
      onAnnotation()
      break
    case 'removeAnnotation':
      onRemoveAnnotation()
      break
    case 'copy':
      onCopy()
      break
    case 'search':
      onSearch()
      break
    case 'share':
      emit('share')
      break
    default:
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
    type: 'highlight',
    value: cfi,
    note: text,
    color: '#66CCFF',
    page: progress.value.location?.current || 0,
    chapter: progress.value.tocItem?.label
  }
  await addAnnotation(annotation)
  setAnnotationTimer(Date.now())
}

async function onRemoveAnnotation() {
  await removeAnnotation(clickedAnnotation.value)
  setAnnotationTimer(Date.now())
}

function onCopy() {
  copy(selection.value.text, true)
}

function onSearch() {
  setKeyword(selection.value.text)
  if (!rightDrawerShow.value) {
    setRightDrawerHoverShow(true)
  }
}

function getOffset() {
  const pos = selection.value.pos
  const point = pos.point
  const dir = pos.dir
  const left = Math.floor(point.x * window.innerWidth) - 60
  let top = Math.floor(point.y * window.innerHeight)
  if (dir === 'up') {
    top -= 52
  }

  return {dir, left, top}
}

function show() {
  const offset = getOffset()
  console.log('offset', offset)

  hide()
  initTippy()
  instance.value?.show()
  if (instance.value) {
    instance.value.popper.style.left = `${offset.left}px`
    instance.value.popper.style.top = `${offset.top}px`
    instance.value.popper.style.display = 'block'
  }

  // search // todo
  // onSearch();
}

function hide(destroy = false) {
  instance.value?.hide()
  setRightDrawerHoverShow(false)

  if (destroy) {
    setTimeout(() => {
      instance.value?.destroy()
      instance.value = undefined
    }, 10)
  }
}

function initTippy() {
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

watch(() => selection.value, (newValue) => {
  if (newValue.text) {
    show()
  } else {
    hide()
  }
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
  width: 202px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  .q-btn {
    width: 40px;
    height: 40px;
  }

  .highlight {
    margin-top: -3px;
    margin-left: -3px;
    .indicator {
      width: 20px;
      height: 4px;
      background: yellowgreen;
      margin-top: -4px;
      margin-left: 3px;
    }
  }
}

.reader-tippy {
  .tippy-box {
    background: transparent;
  }
}
</style>
