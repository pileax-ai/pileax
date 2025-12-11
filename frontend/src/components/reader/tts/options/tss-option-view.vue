<template>
  <section class="q-pa-md">
    <div class="text-readable">
      <q-icon :name="icon" size="1.6rem" />
      {{ label }}
    </div>

    <div :class="contentClass">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: 'q-pt-md'
  }
})
</script>

<style lang="scss" scoped>
.tss-option-view {
}
</style>
