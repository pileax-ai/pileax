<template>
  <q-menu>
    <div :style="{ minWidth: minWidth, maxWidth: maxWidth }">
      <q-list no-border link inset-delimiter>
        <slot></slot>
      </q-list>
    </div>
  </q-menu>
</template>

<script setup lang="ts">
defineProps({
  minWidth: { type: String, default: '240px' },
  maxWidth: { type: String, default: 'none' },
})
</script>

<style lang="scss">
.o-menu {
}
</style>
