<template>
  <section class="o-sheet bg-secondary" :class="{ 'show': modelValue }">
    <header class="row justify-between items-center text-tips bg-accent">
      <div>
        {{ title }}
        <slot name="title"></slot>
      </div>
      <div>
        <q-btn icon="close" size="0.8rem" flat round
               @click="emit('update:modelValue', false)" />
      </div>
    </header>

    <slot></slot>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref} from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.o-sheet {
  border-radius: 12px;
  max-height: 0;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s, max-height 0.3s ease-in-out;

  &.show {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    max-height: 50vh;
  }

  header {
    border-radius: 12px 12px 0 0;
  }
}
</style>
