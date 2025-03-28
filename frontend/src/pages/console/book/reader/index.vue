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
import { useRoute } from 'vue-router';
import PopupMenu from './PopupMenu.vue';
import ShareDialog from './ShareDialog.vue';
import ReaderHeader from './ReaderHeader.vue';
import ReaderFooter from './ReaderFooter.vue';
import OReaderPage from 'core/page/template/OReaderPage.vue';
import ReaderSide from 'src/components/reader/ReaderSide.vue';

import 'js/reader.js';
import { onActivated, ref } from 'vue';
import useBook from 'src/hooks/useBook';
import { prevPage, nextPage, openBook, getBook } from 'src/service/book';
import {
  renderAnnotations,
  findBookAnnotation
} from 'src/service/book-annotation';

const route = useRoute();
const { setBook, setBookId } = useBook();

const bookRef = ref(null);
const showShareDialog = ref(false);

async function openWithBook(bookId: string) {
  const item: Indexable = await getBook(bookId);
  if (item) {
    setBookId(parseInt(bookId));
    setBook(item);

    const filePath = `${item.path}/${item.fileName}`;
    const cfi = item.readingPosition ?? '';
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
  const id: string = String(route.query.id ?? '');
  openWithBook(id);
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
