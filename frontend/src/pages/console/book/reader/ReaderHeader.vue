<template>
  <header class="row items-center justify-between text-readable reader-header can-hover"
          :class="{
            'left-drawer-closed': !leftDrawerShow,
            'right-drawer-closed': !rightDrawerShow
          }" :style="`--reader-right-min-width: ${rightDrawer.show ? '100' : rightDrawer.width}px`">
    <section class="row col-auto items-center header-left">
      <div class="bookmark" :class="{ 'show': pageBookmark }">
        <q-icon name="mdi-bookmark-outline" size="16px" />
      </div>
      <div class="bookmark note" :class="{ 'show': pageNote }" @click="openNote(pageNote)">
        <q-icon name="o_article" size="14px" />
      </div>

      <div class="text-tips chapter" v-if="tempProgress.chapterLocation?.current > 1">
        {{ tempProgress.tocItem?.label }}
      </div>
    </section>

    <div class="col spacer drag-region">
    </div>

    <section class="row col-auto header-right">
    </section>

    <!-- Hover Toolbar -->
    <section class="row justify-between items-center text-readable top-toolbar fixed-left toolbar-hover-show"
             :class="{ 'is-physical': isPhysical }">
      <div class="row col-auto items-center q-px-sm">
        <div class="no-drag-region" v-if="!leftDrawerShow">
          <o-hover-btn icon="icon-sidebar"
                       hover-icon="mdi-backburger rotate-180"
                       class="o-toolbar-btn"
                       @enter="onLeftDrawerEnter"
                       @leave="onLeftDrawerLeave"
                       @click="toggleLeftDrawer">
            <o-tooltip :message="$t('expand')" position="right" transition autohide />
          </o-hover-btn>
        </div>

        <template v-if="!isPhysical">
          <q-btn icon="o_bookmark_remove"
                 class="o-toolbar-btn"
                 flat
                 @click="onRemoveBookmark"
                 v-if="pageBookmark">
            <o-tooltip position="bottom" transition autohide>
              {{ $t('reading.bookmark.remove') }}
            </o-tooltip>
          </q-btn>
          <q-btn icon="o_bookmark_add"
                 class="o-toolbar-btn"
                 flat
                 @click="onAddBookmark"
                 v-else>
            <o-tooltip position="bottom" transition autohide>
              {{ $t('reading.bookmark.add') }}
            </o-tooltip>
          </q-btn>
        </template>

        <q-btn icon="o_post_add" class="o-toolbar-btn"
               flat
               @click="onAddNote">
          <o-tooltip position="bottom" transition autohide>
            {{ $t('note.add') }}
          </o-tooltip>
        </q-btn>
      </div>

      <div class="col text-readable cursor-pointer ellipsis" @click="onDetails">
        {{ book.title }}
      </div>
    </section>

    <section class="row justify-end items-center text-readable top-toolbar fixed-right toolbar-hover-show">
      <div class="row col-auto q-px-sm">
        <section class="row">
          <q-btn icon="o_tune" class="o-toolbar-btn"
                 :class="{ 'active': rightDrawer.settings }"
                 flat
                 @click="toggleRightDrawerView('settings')">
            <o-tooltip position="bottom" transition autohide>
              {{ $t('reading.settings') }}
            </o-tooltip>
          </q-btn>
          <q-btn class="o-toolbar-btn"
                 :class="{ 'active': isWideScreen }"
                 flat
                 @click="toggleDrawers">
            <o-icon :name="isWideScreen ? 'icon-fullscreen_portrait' : 'o_view_array'" />
            <o-tooltip position="bottom" transition autohide>
              {{ isWideScreen ? $t('wideScreen') : $t('wideScreenExit') }}
            </o-tooltip>
          </q-btn>
          <q-btn class="o-toolbar-btn"
                 :class="{ 'active': rightDrawerShow }"
                 flat
                 @click="toggleRightDrawer">
            <o-icon name="icon-sidebar-right" />
          </q-btn>
        </section>
      </div>
      <o-tool-bar-overlay class="col-auto"
                          :window-id="windowId"
                          v-if="!rightDrawerShow" />
    </section>

    <transition appear
                enter-active-class="animated slideInDown"
                leave-active-class="animated slideOutUp">
      <section class="row justify-center bg-secondary searching o-page-container" v-if="searchCurrent.top">
        <section class="row justify-between items-center text-readable toolbar">
          <div>
            <div class="text-bold title">
              {{ $t('searchResults') }}: <span class="text-primary"> {{ search.term }}</span>
            </div>
            <div>{{ searchCurrent.top.label }}</div>
          </div>
          <div class="no-drag-region">
            <q-btn icon="close" size="0.8rem" class="o-toolbar-btn" flat @click="clearSearch" />
          </div>
        </section>
      </section>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { throttle } from 'quasar'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import useCommon from 'core/hooks/useCommon'
import useBook from 'src/hooks/useBook'
import useBookNote from 'src/hooks/useBookNote'
import useReader from 'src/hooks/useReader'
import OHoverBtn from 'core/components/button/OHoverBtn.vue'
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'
import { UUID } from 'core/utils/crypto'
import { isInside, parseCFI } from 'src/api/service/ebook/book'
import { globalBus } from 'src/api/event/event-bus'

const { showDialog } = useCommon()
const { book, tempProgress, search, windowId, clearSearch } = useBook()
const {
  bookId,
  isPhysical,
  pageBookmark,
  pageNote,
  openNote,
  saveNoteRemote,
  deleteNote,
  setPageBookmark,
  setPageNote,
  refreshPage,
} = useBookNote()
const {
  leftDrawerShow,
  leftDrawerHoverShow,
  rightDrawer,
  rightDrawerShow,
  isWideScreen,
  toggleLeftDrawer,
  toggleRightDrawer,
  setLeftDrawerHoverShow,
  toggleRightDrawerView,
  toggleDrawers,
} = useReader()

const searchCurrent = computed(() => {
  return search.value.current || {}
})

function onLeftDrawerEnter() {
  setLeftDrawerHoverShow(true)
}

function onLeftDrawerLeave() {
  if (leftDrawerHoverShow.value) {
    setLeftDrawerHoverShow(false)
  }
}

function onAddNote() {
  const id = UUID()
  openNote(id)
  setPageNote(id)
}

function onAddBookmark() {
  const location = parseCFI(tempProgress.value.cfi)
  saveNoteRemote({
    bookId: bookId.value,
    type: 'bookmark',
    value: location.start,
    chapter: tempProgress.value.tocItem?.label,
    page: tempProgress.value.location?.current || 0,
  }).then(res => {
    setPageBookmark(res.id)
  })
}

function onRemoveBookmark() {
  if (pageBookmark.value) {
    deleteNote({ id: pageBookmark.value })
  }
}

function onDetails() {
  showDialog({
    type: 'book-meta',
    id: bookId.value,
  })
}

const debounceRelocated = throttle(refreshPage, 500)

onMounted(() => {
  globalBus.on('relocated', debounceRelocated)
})

onUnmounted(() => {
  globalBus.off('relocated', debounceRelocated)
})
</script>

<style lang="scss">
.reader-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  &.right-drawer-closed {
    padding-right: 0!important;

    .header-right {
      padding-right: 6px;
    }
  }

  .header-left {
    position: relative;
    height: 40px;
    min-width: 200px;

    .chapter {
      padding-left: 60px;
    }
  }

  .header-right {
    min-width: var(--reader-right-min-width);
  }

  .bookmark {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 60px;
    margin: 0 4px;
    padding: 10px 0;
    display: flex;
    //align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    cursor: pointer;

    visibility: hidden;
    opacity: 0;
    transform: translateY(-100%);
    transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s;

    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%);
    background: radial-gradient(
        circle at 80% 10%,
        rgba(255, 255, 255, 0.6) 0%,
        rgba(255, 255, 255, 0) 50%
      ),
      linear-gradient(135deg, #4dabf7 0%, #1971c2 50%, #0b3d66 100%);
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));

    &.show {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }

    &.note {
      left: 28px;
      background: radial-gradient(
          circle at 80% 10%,
          rgba(255, 255, 255, 0.6) 0%,
          rgba(255, 255, 255, 0) 50%
        ),
        linear-gradient(135deg, #d0bfff 0%, #7048e8 50%, #3b199c 100%);
    }

    .q-icon {
      opacity: 0.8;
    }
  }

  .spacer {
    height: 40px;
  }

  .o-icon {
    width: 20px;
    height: 20px;
  }

  .searching {
    position: absolute;

    .toolbar {
      width: 100%;
      max-width: 800px;
      padding: 0 10px;
      background: var(--q-dark);
      border-radius: 0 0 8px 8px;

      .title {
        font-size: 1rem;
      }
    }
  }

  .top-toolbar {
    position: fixed;
    top: 0;
    height: 40px;
    padding: 0;
    //background: var(--q-secondary);

    &.fixed-left {
      left: 0;
      width: 40%;
      border-radius: 0 8px 8px 0;
      background: linear-gradient(90deg, var(--q-secondary) 50%, transparent 100%);

      .o-toolbar-btn {
        margin: 0 !important;
      }
    }

    &.fixed-right {
      right: 0;
      min-width: 200px;
      border-radius: 8px 0 0 8px;
      background: linear-gradient(-90deg, var(--q-secondary) 20%, transparent 80%, transparent 100%);
    }

    &.toolbar-hover-show {
      transform: translateY(-100%);
    }

    .slider-container {
      .reserve-position {
        position: absolute;
        top: 6px;
        left: calc(var(--pi-reserve-percent) - 9px);
        width: 16px;
        height: 16px;
        border-radius: 8px;

        &:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: var(--q-primary);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(2);
          opacity: 0.1;
        }

        &:hover:after {
          opacity: 0.3;
          transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        }
      }
    }
  }
}
</style>
