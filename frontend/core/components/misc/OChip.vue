<template>
  <q-chip class="o-chip" :color="bgColor" :text-color="textColor">
    {{ label }}
    <slot></slot>
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dark } from 'quasar'
const props = defineProps({
  color: {
    type: String,
    default: 'blue'
  },
  label: {
    type: String,
    default: ''
  },
})

const bgColor = computed(() => {
  return Dark.isActive ?  props.color : `${props.color}-1`
})
const textColor = computed(() => {
  return Dark.isActive ?  'white' : props.color
})
</script>

<style lang="scss">
.o-chip {
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
}
</style>
