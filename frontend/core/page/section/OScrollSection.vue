<template>
  <q-scroll-area ref="scrollRef"
                 class="o-scroll-section o-scroll-wrapper"
                 :thumb-style="thumbStyle"
                 @scroll="onScroll">
    <slot></slot>
  </q-scroll-area>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { QScrollArea } from 'quasar'
const props = defineProps({
  thumbStyle: {
    type: Object,
    default: function() {
      return {
        width: '4px', height: '4px'
      }
    }
  }
})
const emit = defineEmits(['scroll'])

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
.o-scroll-section {
}
</style>
