<template>
  <section class="template-content-wide fit row justify-center">
    <div class="row col-12 justify-center o-wide" :class="contentClass">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  contentClass: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss">
.template-content-wide {
  img {
    max-width: 100%;
  }

  .o-wide {
    width: 100%;
  }
}
</style>
