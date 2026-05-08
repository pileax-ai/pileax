<template>
  <section class="reader-side-view bg-secondary no-drag-region">
    <header class="row col-12 items-center"
            :class="headerClass">
      <slot name="header"></slot>
    </header>

    <slot></slot>
  </section>
</template>

<script setup lang="ts">

const props = defineProps({
  headerClass: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss">
.reader-side-view {
}

.hover-show {
  .reader-side-view {
    border-radius: 12px 0 0 12px;
  }
}
</style>
