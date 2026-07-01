<template>
  <q-scroll-area class="o-book-desc">
    <div class="desc-content" v-html="desc"></div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'

const props = defineProps({
  desc: { type: String, default: '' },
})



</script>

<style lang="scss">
.o-book-desc {
  .desc-content {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.75;
  }
}
</style>
