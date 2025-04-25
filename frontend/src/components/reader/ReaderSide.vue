<template>
  <section class="fit reader-side">
    <reader-side-ai :item="item" v-if="item.type === 'ai'" />
    <reader-side-service :item="item" v-else />
  </section>
</template>

<script setup lang="ts">
import {computed, PropType} from 'vue';
import ReaderSideAi from './ReaderSideAi.vue';
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
