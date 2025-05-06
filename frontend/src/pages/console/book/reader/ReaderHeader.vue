<template>
  <header class="row items-center justify-between header reader-header"
          :class="{
            'left-drawer-closed': !leftDrawerShow,
            'right-drawer-closed': !rightDrawerShow
          }">
    <section class="row col-auto items-center text-readable">
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

    <div class="col spacer drag-region">
    </div>

    <section class="row col-auto text-readable">
      <section class="row hover-shows top-toolbar toolbar-hover-shows">
        <q-btn icon="volume_up" class="o-toolbar-btn" flat
               @click="setRightDrawerTTS(true)">
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
    <o-tool-bar-overlay class="col-auto" v-if="!rightDrawerShow" />

    <transition appear
                enter-active-class="animated slideInDown"
                leave-active-class="animated slideOutUp">
      <section class="row justify-center bg-secondary searching o-page-container" v-if="searchCurrent.top">
        <section class="row justify-between items-center text-readable toolbar">
          <div>
            <div class="text-bold title">
              本书包含 <span class="text-primary">{{ search.term }}</span> 的结果
            </div>
            <div>{{ searchCurrent.top.label }}</div>
          </div>
          <div>
            <q-btn icon="close" size="0.8rem" class="o-toolbar-btn" flat @click="clearSearch" />
          </div>
        </section>
      </section>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import useBook from 'src/hooks/useBook';
import useReader from 'src/hooks/useReader';
import { nextPage, prevPage } from 'src/service/book';
import OHoverBtn from 'core/components/button/OHoverBtn.vue'
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'

const { progress, search, clearSearch } = useBook();
const {
  leftDrawerShow,
  rightDrawerShow,
  leftDrawerHoverShow,
  toggleLeftDrawer,
  toggleRightDrawer,
  setLeftDrawerHoverShow,
  setRightDrawerTTS
} = useReader();

const searchCurrent = computed(() => {
  return search.value.current || {};
})

function onLeftDrawerEnter() {
  setLeftDrawerHoverShow(true);
}

function onLeftDrawerLeave() {
  if (leftDrawerHoverShow.value) {
    setLeftDrawerHoverShow(false);
  }
}
</script>

<style lang="scss">
.reader-header {
  position: absolute;
  top: 0;
  left: 0;

  .spacer {
    height: 40px;
  }

  .top-toolbar {
    padding-right: 24px;
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

  &.right-drawer-closed {
    padding-right: 0!important;
  }
}
</style>
