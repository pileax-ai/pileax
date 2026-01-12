<template>
  <q-badge class="o-badge" :color="bgColor" :text-color="textColor">
    <q-icon :name="icon" class="q-mr-xs" v-if="icon" />
    {{ label }}
    <slot></slot>
  </q-badge>
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
    type: [String, Number],
    default: ''
  },
  icon: {
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
.o-badge {
  padding: 4px;
  border-radius: 2px;
  margin: 4px
}
</style>
