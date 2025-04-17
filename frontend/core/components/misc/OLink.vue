<template>
  <a class="o-link" :href="link" target="_blank">
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
defineProps({
  link: {
    type: String,
    default: ''
  },
});

</script>

<style lang="scss">
.o-link {
  display: inline-block;
  color: currentColor;
}
</style>
