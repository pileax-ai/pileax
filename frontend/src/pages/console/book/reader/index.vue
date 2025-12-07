<template>
  <o-reader-page class="page-reader"
                 content-class="reader-view"
                 extension-only>
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

    <q-inner-loading :showing="loading">
      <q-spinner-ios class="text-info" size="48px" />
    </q-inner-loading>
  </o-reader-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import PopupMenu from './PopupMenu.vue';
import ShareDialog from './ShareDialog.vue';
import ReaderHeader from './ReaderHeader.vue';
import ReaderFooter from './ReaderFooter.vue';
import OReaderPage from 'components/page/OReaderPage.vue';
import ReaderSide from 'components/reader/ReaderSide.vue';

import 'js/ebook.js'
import { onActivated, ref } from 'vue'
import useBook from 'src/hooks/useBook'
import { nextPage, prevPage, openBook } from 'src/api/service/ebook/book'
import { bookAnnotationService, workspaceBookService } from 'src/api/service/remote'
import { findBookAnnotation, renderAnnotations } from 'src/api/service/ebook/book-annotation'
import { ReadingMode } from 'src/types/reading'

const route = useRoute();
const { store, setBook, setBookId, setWorkspaceBookId } = useBook();

const bookRef = ref(null);
const showShareDialog = ref(false);
const loading = ref(false);

function prepareOpen() {
  const name = route.name;
  const id: string = String(route.query.id ?? '');
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

async function openWithBook(workspaceBookId: string) {
  store.setReadingMode(ReadingMode.Read);
  await open(workspaceBookId);
}

async function openWithAnnotation(annotationId: string) {
  const annotation = await bookAnnotationService.get(annotationId);
  const workspaceBookId = annotation.workspaceBookId;
  const cfi = annotation.value;
  store.setReadingMode(ReadingMode.Preview);
  await open(workspaceBookId, cfi);
}

async function open(workspaceBookId: string, initialCfi = '') {
  console.log('open', workspaceBookId)
  const book: Indexable = await workspaceBookService.getDetails(workspaceBookId);
  if (book) {
    setBookId(book.bookId);
    setWorkspaceBookId(workspaceBookId);
    setBook(book);

    const filePath = `${book.path}/${book.fileName}`;
    const cfi = initialCfi || book.readingPosition || '';

    loading.value = true;
    await openBook(bookRef.value, filePath, cfi);
    loading.value = false;

    setTimeout(() => {
      prepareAnnotations(workspaceBookId);
    }, 300);
  }
}

async function prepareAnnotations(workspaceBookId: string) {
  const annotations = await findBookAnnotation(workspaceBookId);
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
