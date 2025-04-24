<template>
  <q-page class="o-common-page full-width">
    <header class="row col-12 justify-between items-center full-width header" v-if="header">
      <div class="row justify-between items-center title">
        <span v-if="title">{{title}}</span>
        <slot name="header"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </header>

    <!--Content-->
    <q-scroll-area ref="scrollRef"
                   class="o-page-container"
                   :class="contentClass"
                   @scroll="onScroll"
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

    <footer class="row footer" v-if="footer">
      <slot name="footer"></slot>
    </footer>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import Content403 from 'core/page/content/Content403.vue';
import { QScrollArea } from 'quasar'

const props = defineProps({
  header: {
    type: Boolean,
    default: false
  },
  footer: {
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
  },
});
const emit = defineEmits(['scroll']);

const scrollRef = ref<InstanceType<typeof QScrollArea>>();
const scrollTop = ref(0);
const scrollDirection = ref('');
const pageStatus = computed(() => {
  return 200
});

function onScroll(info: any) {
  if (scrollTop.value) {
    scrollDirection.value = scrollTop.value > info.verticalPosition
      ? 'up'
      : 'down';
  }
  // console.log('scroll', info, scrollDirection.value);
  scrollTop.value = info.verticalPosition;
  emit('scroll', info, scrollDirection.value);
}

function scrollToBottom(duration = 0) {
  const scrollTarget = scrollRef.value?.getScrollTarget();
  const scrollHeight = scrollTarget?.scrollHeight || 0;
  scrollRef.value?.setScrollPosition('vertical', scrollHeight, duration);
}

defineExpose({
  scrollToBottom: scrollToBottom
})
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
