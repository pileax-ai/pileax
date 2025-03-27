<template>
  <q-page class="o-common-page full-width">
    <header class="row col-12 justify-between items-center header" v-if="header">
      <div class="row justify-between items-center title">
        <span v-if="title">{{title}}</span>
        <slot name="header"></slot>
      </div>
      <div class="q-px-sm right">
        <slot name="right"></slot>
      </div>
    </header>

    <!--Content-->
    <q-scroll-area ref="contentScroll"
                   class="o-page-container"
                   :class="contentClass"
                   v-if="scrollable">
      <Content403 v-if="pageStatus === 403" />
      <template v-else>
        <slot></slot>
      </template>
    </q-scroll-area>

    <section class="row col-12 fit" :class="contentClass" v-else>
      <Content403 v-if="pageStatus === 403" />
      <template v-else>
        <slot></slot>
      </template>
    </section>

  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Content403 from 'core/page/content/Content403.vue';

const props = defineProps({
  header: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: 'bg-secondary'
  }
});

const pageStatus = computed(() => {
  return 200
});
</script>

<style lang="scss">
.o-common-page {
  .o-page-wrapper {
    width: 100%;
  }

  .o-page-container {
    .q-scrollarea__content {
      width: 100%;
    }
  }
}
</style>
