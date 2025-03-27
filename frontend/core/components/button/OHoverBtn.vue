<template>
  <q-btn :icon="hovered ? hoverIcon : icon"
         @mouseenter.stop="onEnter"
         @mouseleave.stop="onLeave"
         @click="onLeave"
         flat>
    <slot></slot>
  </q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  icon: {
    type: String,
    default: 'menu'
  },
  hoverIcon: {
    type: String,
    default: 'refresh'
  }
})
const emit = defineEmits(['enter', 'leave']);
const hovered = ref(false);

function onEnter() {
  hovered.value = true;
  emit('enter');
}

function onLeave() {
  hovered.value = false;
  emit('leave');
}
</script>

<style lang="scss">
.o-hover-btn {
}
</style>
