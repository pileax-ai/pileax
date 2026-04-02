<template>
  <o-reader-page class="page-reader"
                 content-class="reader-view"
                 extension-only>
    <reader-header />

    <!-- Nav -->
    <nav class="row items-center justify-center navi-left"
         @click="prevPage">
      <q-btn icon="keyboard_arrow_left"
             class="text-readable bg-tips"
             flat
             @click="prevPage">
        <o-tooltip position="right" :message="$t('reading.prevPage')" transition autohide />
      </q-btn>
    </nav>
    <nav class="row items-center justify-center navi-right"
         @click="nextPage">
      <q-btn icon="keyboard_arrow_right"
             class="text-readable bg-tips"
             flat
             @click="nextPage">
        <o-tooltip position="left" :message="$t('reading.nextPage')" transition autohide />
      </q-btn>
    </nav>

    <!-- Reading View -->
    <section ref="bookRef"
             class="foliate-view"
             :class="{ 'margin': settings.viewMargin }"
             tabindex="-1"
             @click="onClick"
             @focus="onFocus"
             @blur="onBlur">
    </section>

    <reader-footer />

    <!-- Extra -->
    <template #side>
      <reader-side keyword="字典" />
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
import PopupMenu from './PopupMenu.vue'
import ShareDialog from './ShareDialog.vue'
import ReaderHeader from './ReaderHeader.vue'
import ReaderFooter from './ReaderFooter.vue'
import OReaderPage from 'components/page/OReaderPage.vue'
import ReaderSide from 'components/reader/ReaderSide.vue'

import 'js/ebook.js'
import { onActivated, ref } from 'vue'
import useBook from 'src/hooks/useBook'
import useReaderSetting from 'src/hooks/useReaderSetting'
import { nextPage, prevPage, openBook } from 'src/api/service/ebook/book'
import { bookAnnotationService, bookService } from 'src/api/service/remote'
import { findBookAnnotation, renderAnnotations } from 'src/api/service/ebook/book-annotation'
import { ReadingMode } from 'src/types/reading'

const route = useRoute()
const { store, setBook, setBookId, setWindowId } = useBook()
const { settings } = useReaderSetting()

const bookRef = ref(null)
const showShareDialog = ref(false)
const loading = ref(false)

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
  const bookId = annotation.bookId
  const cfi = annotation.value
  store.setReadingMode(ReadingMode.Preview)
  await open(bookId, cfi)
}

async function open(bookId: string, initialCfi = '') {
  // console.log('open', bookId)
  const book: Indexable = await bookService.getDetails(bookId)
  if (book) {
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
  const annotations = await findBookAnnotation(bookId)
  renderAnnotations(annotations)
}

function onShare(show = true) {
  showShareDialog.value = show
}

function onClick() {
  console.log('click')
}

function onFocus() {
  console.log('focus')
}

function onBlur() {
  console.log('blur')
}

onActivated(() => {
  prepareOpen()
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
    }
  }

  header.can-hover, footer.can-hover {
    &:hover, &:focus-within {
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
    //background: rgba(red, 0.1);
    visibility: hidden;
    z-index: 1;

    .q-btn {
      width: 40px;
      height: 80px;
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

    &.margin {
      left: 60px;
      right: 60px;
      top: 48px;
      bottom: 48px;
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
