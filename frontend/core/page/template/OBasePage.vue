<template>
  <q-page class="o-base-page">
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
                   @scroll="onScroll"
                   v-if="scrollable">
      <Content403 v-if="pageStatus === 403" />
      <template v-else>
        <slot></slot>
      </template>
    </q-scroll-area>

    <template v-else>
      <Content403 v-if="pageStatus === 403" />
      <template v-else>
        <slot></slot>
      </template>
    </template>

    <footer class="row footer" v-if="footer">
      <slot name="footer"></slot>
    </footer>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import Content403 from 'core/page/content/Content403.vue'
import { QScrollArea } from 'quasar'
import usePermission from 'src/hooks/usePermission'

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
})
const emit = defineEmits(['scroll'])

const { pageStatus } = usePermission()
const scrollRef = ref<InstanceType<typeof QScrollArea>>()
const scrollTop = ref(0)
const scrollDirection = ref('')

function onScroll(info: any) {
  if (scrollTop.value) {
    scrollDirection.value = scrollTop.value > info.verticalPosition
      ? 'up'
      : 'down'
  }
  // console.log('scroll', info, scrollDirection.value);
  scrollTop.value = info.verticalPosition
  emit('scroll', info, scrollDirection.value)
}

function scrollToBottom(duration = 0) {
  const scrollTarget = scrollRef.value?.getScrollTarget()
  const scrollHeight = scrollTarget?.scrollHeight || 0
  scrollRef.value?.setScrollPosition('vertical', scrollHeight, duration)
}

defineExpose({
  scrollToBottom: scrollToBottom
})
</script>

<style lang="scss">
.o-base-page {
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
