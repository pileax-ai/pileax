<template>
  <o-reader-page class="page-reader"
                 :class="{ 'fixed-layout': isFixedLayout, 'scroll-mode': isScrollMode }"
                 content-class="reader-view"
                 extension-only>
    <reader-header :class="{ 'focus': bookViewFocused }" />

    <!-- Nav -->
    <template v-if="!isPhysical">
      <nav class="row items-center justify-center navi-left"
           @click="prevPage">
        <q-btn icon="keyboard_arrow_left"
               class="text-readable bg-tips"
               flat
               @click.stop="prevPage">
          <o-tooltip position="right" :message="$t('reading.prevPage')" transition autohide />
        </q-btn>
      </nav>
      <nav class="row items-center justify-center navi-right"
           @click="nextPage">
        <q-btn icon="keyboard_arrow_right"
               class="text-readable bg-tips"
               flat
               @click.stop="nextPage">
          <o-tooltip position="left" :message="$t('reading.nextPage')" transition autohide />
        </q-btn>
      </nav>
    </template>

    <!-- Note View -->
    <div class="foliate-view margin" v-if="isPhysical">
      <book-note-view />
    </div>

    <!-- Reading View -->
    <div ref="bookRef"
             class="foliate-view"
             :style="{ margin: `${settings.verticalMargin}px ${settings.horizontalMargin}px` }"
             tabindex="0"
             @keydown="onKeydown"
             v-else>
    </div>

    <reader-footer :class="{ 'focus': bookViewFocused }" v-if="!isPhysical" />

    <!-- Extra -->
    <template #side>
      <reader-side keyword="Dict" />
    </template>

    <popup-menu @share="onShare" />
    <share-dialog :show="showShareDialog"
                  @close="onShare(false)" />

    <q-inner-loading :showing="loading">
      <q-spinner-ios class="text-info" size="48px" />
    </q-inner-loading>
  </o-reader-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import PopupMenu from './PopupMenu.vue'
import ShareDialog from './ShareDialog.vue'
import ReaderHeader from './ReaderHeader.vue'
import ReaderFooter from './ReaderFooter.vue'
import OReaderPage from 'components/page/OReaderPage.vue'
import ReaderSide from 'components/reader/ReaderSide.vue'
import BookNoteView from './BookNoteView.vue'

import 'js/ebook.js'
import { computed, onActivated, ref } from 'vue'
import useBook from 'src/hooks/useBook'
import useBookNote from 'src/hooks/useBookNote'
import useReaderSetting from 'src/hooks/useReaderSetting'
import { nextPage, prevPage, openBook } from 'src/api/service/ebook/book'
import { bookAnnotationService, bookService } from 'src/api/service/remote'
import { findBookAnnotation, renderAnnotations } from 'src/api/service/ebook/book-annotation'
import { ReadingMode } from 'src/types/reading'
import useReader from 'src/hooks/useReader'
import { globalBus } from 'src/api/event/event-bus'
import useCommon from 'core/hooks/useCommon'

const route = useRoute()
const docTitle = useTitle('')
const { t } = useCommon()
const { isFixedLayout, isPhysical, store, setBook, setBookId, setWindowId } = useBook()
const { openNote } = useBookNote()
const { setRightDrawerView, setRightDrawerHoverShow } = useReader()
const { settings } = useReaderSetting()

const bookRef = ref<HTMLDivElement | null>(null)
const showShareDialog = ref(false)
const bookViewFocused = ref(false)
const loading = ref(false)

const isScrollMode = computed(() => {
  return settings.value.pageTurnStyle === 'scroll'
})

function prepareOpen() {
  const name = route.name
  const id: string = String(route.query.id ?? '')

  setWindowId(id)
  switch (name) {
    case 'reader-book':
      openWithBook(id)
      break
    case 'reader-annotation':
      openWithAnnotation(id)
      break
    default:
      console.warn('Not supported')
      break
  }
}

async function openWithBook(bookId: string) {
  store.setReadingMode(ReadingMode.Read)
  await open(bookId)
}

async function openWithAnnotation(annotationId: string) {
  const annotation = await bookAnnotationService.get(annotationId)

  // open note
  if (annotation.type === 'note') {
    setRightDrawerView('note', true)
    openNote(annotationId)
  } else {
    setRightDrawerView('note', false)
  }

  // open book
  const bookId = annotation.bookId
  const cfi = annotation.value
  store.setReadingMode(ReadingMode.Preview)
  await open(bookId, cfi)
}

async function open(bookId: string, initialCfi = '') {
  // console.log('open', bookId)
  const book: Indexable = await bookService.getDetails(bookId)
  if (book) {
    docTitle.value = `${book.title.substring(0, 32)} | ${t('product.name')}`
    setBookId(bookId)
    setBook(book)

    const filePath = book.fileUrl
    const cfi = initialCfi || book.readingPosition || ''

    loading.value = true
    await openBook(bookRef.value, filePath, cfi)
    loading.value = false

    setTimeout(() => {
      prepareAnnotations(bookId)
    }, 300)
  }
}

async function prepareAnnotations(bookId: string) {
  if (!isPhysical.value) {
    const annotations = await findBookAnnotation(bookId, 'annotation')
    renderAnnotations(annotations)
  }
}

function onShare(show = true) {
  showShareDialog.value = show
}

function onClick() {
  bookRef.value?.focus()
  setRightDrawerHoverShow(false)

  // Todo
  // bookViewFocused.value = !bookViewFocused.value
}

function onKeydown(event: KeyboardEvent) {
  const key = event.key
  if (['ArrowLeft', 'ArrowUp', 'k'].includes(key)) {
    prevPage()
  } else if (['ArrowRight', 'ArrowDown', 'j'].includes(key)) {
    nextPage()
  }
}

onActivated(() => {
  prepareOpen()
  globalBus.on('book-view-clicked', onClick)

  bookRef.value?.focus()
})
</script>

<style lang="scss">
.page-reader {
  header, footer {
    right: 0;
    height: 40px;
    padding: 0 6px;
    font-size: 0.8rem;
    z-index: 10;

    .hover-show {
      visibility: hidden;
    }

    .toolbar-hover-show {
      visibility: hidden;
      opacity: 1;
      transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s;
    }

    .o-toolbar-btn {
      &:not(:first-child) {
        margin-left: 4px;
      }

      &.active {
        background: var(--q-dark);
      }
    }
  }

  header.can-hover, footer.can-hover {
    &:hover, &.focus {
      .toolbar-hover-show {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  nav {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    z-index: 1;

    .q-btn {
      visibility: hidden;
      width: 40px;
      height: 80px;
    }

    &:hover {
      .q-btn {
        visibility: visible;
      }
    }

    &.navi-left {
      left: 0;
      cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m15 18-6-6 6-6'/></svg>") 12 12, auto;
    }
    &.navi-right {
      right: 0;
      cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") 12 12, auto;
    }
  }

  .reader-view:hover {
    nav, .hover-show {
      visibility: visible;
    }
  }

  .foliate-view {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overscroll-behavior-y: none!important;
    overflow-y: hidden !important;

    &:focus,
    &:focus-visible {
      outline: none;
    }
  }

}

body.body--dark {
  nav {
    &.navi-left {
      cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><filter id='shadow'><feDropShadow dx='0' dy='1' stdDeviation='0.5' flood-opacity='0.5'/></filter><path d='m15 18-6-6 6-6' filter='url(%23shadow)'/></svg>") 12 12, auto;
    }

    &.navi-right {
      cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><filter id='s'><feDropShadow dx='0' dy='1' stdDeviation='0.5' flood-opacity='0.5'/></filter><path d='m9 18 6-6-6-6' filter='url(%23s)'/></svg>") 12 12, auto;
    }
  }
}
</style>
