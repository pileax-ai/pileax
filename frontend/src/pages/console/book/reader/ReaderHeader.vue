<template>
  <header class="row items-center justify-between text-readable header reader-header can-hover"
          :class="{
            'left-drawer-closed': !leftDrawerShow,
            'right-drawer-closed': !rightDrawerShow
          }">
    <section class="row col-auto items-center header-left">
      <div class="bookmark"></div>

      <span class="text-tips q-ml-xs" v-if="progress.chapterLocation?.current > 1">
          {{ progress.tocItem?.label }}
        </span>
    </section>

    <div class="col spacer">
    </div>

    <section class="row col-auto header-right">
    </section>

    <o-tool-bar-overlay class="col-auto"
                        :window-id="windowId"
                        v-if="!rightDrawerShow" />

    <!-- Hover Toolbar -->
    <section class="row justify-between items-center text-readable top-toolbar toolbar-hover-show">
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
        <q-btn icon="o_bookmark_add" class="o-toolbar-btn" flat>
          <o-tooltip position="bottom" transition autohide>
            {{ $t('reading.bookmark.add') }}
          </o-tooltip>
        </q-btn>
        <q-btn icon="o_bookmark_remove" class="o-toolbar-btn" flat>
          <o-tooltip position="bottom" transition autohide>
            {{ $t('reading.bookmark.remove') }}
          </o-tooltip>
        </q-btn>
        <q-btn icon="o_post_add" class="o-toolbar-btn"
               flat
               @click="onAddNote">
          <o-tooltip position="bottom" transition autohide>
            {{ $t('note.add') }}
          </o-tooltip>
        </q-btn>

        <div class="q-px-sm text-readable">
          {{ book.title }}
        </div>
      </div>

      <section class="col spacer drag-region">
      </section>

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
                 :class="{ 'active': rightDrawerShow }"
                 flat
                 @click="toggleRightDrawer">
            <o-icon name="icon-sidebar-right" />
          </q-btn>
        </section>
      </div>
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
import { computed } from 'vue'
import useBook from 'src/hooks/useBook'
import useBookNote from 'src/hooks/useBookNote'
import useReader from 'src/hooks/useReader'
import OHoverBtn from 'core/components/button/OHoverBtn.vue'
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'
import { UUID } from 'core/utils/crypto'

const { book, progress, search, windowId, clearSearch } = useBook()
const { openNote } = useBookNote()
const {
  leftDrawerShow,
  leftDrawerHoverShow,
  rightDrawer,
  rightDrawerShow,
  toggleLeftDrawer,
  toggleRightDrawer,
  setLeftDrawerHoverShow,
  setRightDrawerView,
  toggleRightDrawerView,
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
  setRightDrawerView('note', true)
  openNote(id)
}
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

  .bookmark {
    position: relative;
    width: 20px;
    height: 40px;
    margin: 0 4px;
    //background: var(--q-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    cursor: pointer;

    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%);

    background: radial-gradient(
      circle at 80% 10%,
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0) 50%
    ),
    linear-gradient(135deg, #4dabf7 0%, #1971c2 50%, #0b3d66 100%);

    /* 现代 drop-shadow */
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
    transition: all 0.2s ease-in-out;
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
    left: 0;
    right: 0;
    top: 0;
    height: 40px;
    padding: 0;
    background: var(--q-secondary);

    &.toolbar-hover-show {
      visibility: hidden;
      //opacity: 1;
      transform: translateY(-100%);
      transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s;
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
