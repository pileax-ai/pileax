<template>
  <div class="row items-center text-readable o-title-bar">
    <nav class="row col-12">
      <div class="row col items-center drag-region">
        <slot></slot>
      </div>
      <o-tool-bar-overlay class="col-auto" />
    </nav>
  </div>
</template>

<script setup lang="ts">
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'

defineProps({
  link: {
    type: String,
    default: ''
  },
});

</script>

<style lang="scss">
.o-title-bar {
  display: none;
  height: 40px;
}
</style>
