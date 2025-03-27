<template>
  <svg class="o-icon icon" aria-hidden="true"
       :style="{'width': size, 'height': size}"
       v-if="name.indexOf('icon') === 0">
    <use :xlink:href="`#${name}`"></use>
  </svg>
  <q-icon :name="name" class="o-icon" :style="{'font-size': size}" v-else />
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: '1rem'
  },
});
</script>

<style lang="scss">
.o-icon {
  svg {
    width: 24px;
    height: 24px;
  }
}
</style>
