<template>
  <a class="o-link" :href="link" target="_blank">
    <slot></slot>
    <q-icon name="open_in_new" />
  </a>
</template>

<script setup lang="ts">
defineProps({
  link: {
    type: String,
    default: ''
  },
})

</script>

<style lang="scss">
.o-link {
  display: flex;
  color: currentColor;
  align-items: center;

  .q-icon {
    margin-left: 4px;
  }
}
</style>
