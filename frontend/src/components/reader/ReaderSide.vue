<template>
  <section class="fit reader-side">
    <reader-side-service :item="item" />
  </section>
</template>

<script setup lang="ts">
import {computed, PropType} from 'vue';
import ReaderSideService from './ReaderSideService.vue';

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {};
    }
  }
});
</script>

<style lang="scss">
.reader-side {
}
</style>
