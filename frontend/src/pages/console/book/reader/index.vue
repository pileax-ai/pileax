<template>
  <o-reader-page class="page-reader" content-class="reader-view" extension-only>
    <reader-header />

    <!-- Nav -->
    <nav class="row items-center justify-center navi-left">
      <q-btn icon="keyboard_arrow_left"
             class="text-readable bg-tips"
             flat
             @click="prevPage">
        <o-tooltip message="上一页" autohide />
      </q-btn>
    </nav>
    <nav class="row items-center justify-center navi-right">
      <q-btn icon="keyboard_arrow_right"
             class="text-readable bg-tips"
             flat
             @click="nextPage">
        <o-tooltip message="下一页" autohide />
      </q-btn>
    </nav>

    <!-- Reading View -->
    <section ref="bookRef" class="foliate-view">
    </section>

    <reader-footer />

    <!-- Extra -->
    <template #side>
      <reader-side keyword="字典" />
    </template>

    <popup-menu @share="onShare" />
    <share-dialog :show="showShareDialog"
                  @close="onShare(false)" />
  </o-reader-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import PopupMenu from './PopupMenu.vue'
import ShareDialog from './ShareDialog.vue'
import ReaderHeader from './ReaderHeader.vue'
import ReaderFooter from './ReaderFooter.vue'
import OReaderPage from 'core/page/template/OReaderPage.vue'
import ReaderSide from 'src/components/reader/ReaderSide.vue'

import 'js/reader.js'
import { onActivated, ref } from 'vue'
import useBook from 'src/hooks/useBook'
import { getBook, nextPage, openBook, prevPage } from 'src/service/book'
import { bookAnnotationService } from 'src/service/remote/book-annotation'
import { findBookAnnotation, renderAnnotations } from 'src/service/book-annotation'
import { ReadingMode } from 'src/types/reading'

const route = useRoute();
const { store, setBook, setBookId } = useBook();

const bookRef = ref(null);
const showShareDialog = ref(false);

function prepareOpen() {
  const name = route.name;
  const id: string = String(route.query.id ?? '');
  console.log('prepareOpen', name, id);
  switch (name) {
    case 'reader-book':
      openWithBook(id);
      break;
    case 'reader-annotation':
      openWithAnnotation(id);
      break;
    default:
      console.warn('Not supported');
      break;
  }
}

async function openWithBook(bookId: string) {
  store.setReadingMode(ReadingMode.Read);
  await open(bookId);
}

async function openWithAnnotation(annotationId: string) {
  const annotation = await bookAnnotationService.get(annotationId);
  const bookId = annotation.bookId;
  const cfi = annotation.value;
  store.setReadingMode(ReadingMode.Preview);
  await open(bookId, cfi);
}

async function open(bookId: string, initialCfi = '') {
  const book: Indexable = await getBook(bookId);
  if (book) {
    setBookId(parseInt(bookId));
    setBook(book);

    const filePath = `${book.path}/${book.fileName}`;
    const cfi = initialCfi || book.readingPosition || '';
    await openBook(bookRef.value, filePath, cfi);

    setTimeout(() => {
      prepareAnnotations(bookId);
    }, 300);
  }
}

async function prepareAnnotations(bookId: string) {
  const annotations = await findBookAnnotation(bookId);
  renderAnnotations(annotations);
}

function onShare(show = true) {
  showShareDialog.value = show;
}

onActivated(() => {
  prepareOpen();
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
    text-align: center;
    visibility: hidden;
    z-index: 1;

    .q-btn {
      width: 40px;
      height: 80px;
    }


    &.navi-left {
      left: 0;
    }
    &.navi-right {
      right: 0;
    }
  }

  .reader-view:hover {
    nav, .hover-show {
      visibility: visible;
    }
  }

  .foliate-view {
    position: absolute;
    left: 60px;
    right: 60px;
    top: 48px;
    bottom: 48px;
  }

}
</style>
