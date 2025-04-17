<template>
  <svg class="o-svg-icon" aria-hidden="true"
       :style="`--svg-icon-color: ${iconColor}; --svg-icon-size: ${size}`">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icons } from 'core/constants/icons';

defineOptions({ name: 'OSvgIcon', inheritAttrs: true });
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: '1rem'
  },
});

const iconColor = computed(() => {
  const icon = Icons.find(e => e.name === props.name);
  return icon ? props.color || icon.color : props.color;
})
</script>

<style lang="scss">
.o-svg-icon {
  width: var(--svg-icon-size);
  height: var(--svg-icon-size);
  color: var(--svg-icon-color);
  fill: currentColor;
  overflow: hidden;
}
</style>
