<template>
  <header class="row items-center justify-between header reader-header"
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import useBook from 'src/hooks/useBook';
import useReader from 'src/hooks/useReader';
import { nextPage, prevPage } from 'src/service/book';
import OHoverBtn from 'core/components/button/OHoverBtn.vue'

const { progress } = useBook();
const {
  leftDrawerShow,
  rightDrawerShow,
  leftDrawerHoverShow,
  toggleLeftDrawer,
  toggleRightDrawer,
  setLeftDrawerHoverShow
} = useReader();

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

  .top-toolbar {
    padding-right: 24px;
  }
}
</style>
