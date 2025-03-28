<template>
  <o-reader-page class="page-reader" content-class="reader-view" extension-only>
    <header class="row items-center justify-between header absolute-top-left"
            :class="{'drawer-closed': !leftDrawerShow}">
      <section class="row items-center text-readable">
        <div class="menu q-pl-sm no-drag-region" v-if="!leftDrawerShow">
          <o-hover-btn icon="menu"
                       hover-icon="mdi-backburger rotate-180"
                       class="o-toolbar-btn"
                       @enter="onLeftDrawerEnter"
                       @leave="onLeftDrawerLeave"
                       @click="toggleLeftDrawer">
            <o-tooltip :message="$t('expand')" position="right" />
          </o-hover-btn>
        </div>
        <q-btn icon="west" class="o-toolbar-btn hover-show" flat @click="prevPage">
          <o-tooltip message="上一页" />
        </q-btn>
        <q-btn icon="east" class="o-toolbar-btn hover-show" flat @click="nextPage">
          <o-tooltip message="下一页" />
        </q-btn>
        <span class="text-tips" v-if="progress.chapterLocation?.current > 1">
          {{ progress.tocItem?.label }}
        </span>
      </section>
      <section class="row text-readable">
        <section class="row hover-shows top-toolbar toolbar-hover-shows">
          <q-btn icon="search" class="o-toolbar-btn" flat />
          <q-btn icon="volume_up" class="o-toolbar-btn" flat>
            <o-tooltip>AI朗读</o-tooltip>
          </q-btn>
        </section>
        <o-hover-btn icon="menu"
                     :hover-icon="`mdi-backburger ${rightDrawerShow ? 'rotate-180' : ''}`"
                     class="o-toolbar-btn"
                     @click="toggleRightDrawer">
          <o-tooltip :message="rightDrawerShow ? $t('collapse') : $t('expand')"
                     position="right" />
        </o-hover-btn>
      </section>
    </header>

    <nav class="row items-center justify-center navi-left">
      <q-btn icon="keyboard_arrow_left"
             class="text-readable bg-tips"
             flat
             @click="prevPage">
        <o-tooltip message="上一页" autohide />
      </q-btn>
    </nav>
    <section ref="bookRef" class="foliate-view">
    </section>
    <nav class="row items-center justify-center navi-right">
      <q-btn icon="keyboard_arrow_right"
             class="text-readable bg-tips"
             flat
             @click="nextPage">
        <o-tooltip message="下一页" autohide />
      </q-btn>
    </nav>

    <footer class="row items-center justify-center bottom-toolbar-container">
      <span class="text-tips">
        {{ progress.location?.current }} / {{ progress.location?.total }}
      </span>

      <bottom-toolbar />
    </footer>

    <template #side>
      <reader-side keyword="字典" />
    </template>

    <popup-menu @share="onShare" />
    <share-dialog :show="showShareDialog"
                  @close="onShare(false)" />
  </o-reader-page>
</template>

<script setup>
import { useRoute } from 'vue-router';
import PopupMenu from './PopupMenu.vue';
import ShareDialog from './ShareDialog.vue';
import BottomToolbar from './BottomToolbar.vue';
import OReaderPage from 'core/page/template/OReaderPage.vue';
import OHoverBtn from 'core/components/button/OHoverBtn.vue';
import ReaderSide from 'src/components/reader/ReaderSide.vue';

import 'js/reader.js';
import { onActivated, ref } from 'vue';
import useBook from 'src/hooks/useBook';
import useReader from 'src/hooks/useReader';
import { prevPage, nextPage, openBook, getBook } from 'src/service/book';
import {
  renderAnnotations,
  findBookAnnotation
} from 'src/service/book-annotation';

const route = useRoute();
const { store, progress, setBook, setBookId } = useBook();
const {
  leftDrawerShow,
  rightDrawerShow,
  leftDrawerHoverShow,
  toggleLeftDrawer,
  toggleRightDrawer,
  toggleShowRightDrawer,
  setLeftDrawerHoverShow
} = useReader();

const bookRef = ref(null);
const id = ref('');
const showShareDialog = ref(false);

async function open() {
  const item = await getBook(id.value);
  if (item) {
    setBookId(parseInt(id.value));
    setBook(item);

    const filePath = `${item.path}/${item.fileName}`;
    const cfi = item.readingPosition ?? '';
    await openBook(bookRef.value, filePath, cfi);

    setTimeout(() => {
      prepareAnnotations();
    }, 300);
  }
}

async function prepareAnnotations() {
  const annotations = await findBookAnnotation(id.value);
  console.log('annotations', annotations);
  renderAnnotations(annotations);
}

function onShare(show = true) {
  showShareDialog.value = show;
}

function onLeftDrawerEnter() {
  setLeftDrawerHoverShow(true);
}

function onLeftDrawerLeave() {
  if (leftDrawerHoverShow.value) {
    setLeftDrawerHoverShow(false);
  }
}

onActivated(() => {
  id.value = route.query.id || '1';
  open();
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
  }

  .reader-view:hover {
    nav, .hover-show {
      visibility: visible;
    }
  }

  .top-toolbar {
    padding-right: 24px;
  }

  .navi-left {
    left: 0;
  }

  .navi-right {
    right: 0;
  }

  .foliate-view {
    position: absolute;
    left: 60px;
    right: 60px;
    top: 48px;
    bottom: 48px;
  }

  .bottom-toolbar-container {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
