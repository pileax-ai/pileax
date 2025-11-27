<template>
  <svg class="o-svg-icon" aria-hidden="true"
       :style="`--svg-icon-color: ${iconColor}; --svg-icon-size: ${size}`">
    <use :xlink:href="`#icon-${iconName}`" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ids from 'virtual:svg-icons/ids';
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
  colored: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '1rem'
  },
});

const finalName = computed(() => {
  let name = props.name?.toLowerCase()
  if (name?.indexOf('icon-') === 0) {
    name = name.substring(5)
  }
  return name
})

const iconName = computed(() => {
  const name = finalName.value
  if (props.colored) {
    return ids.includes(`icon-${name}-color`)
      ? `${name}-color`
      : name;
  } else {
    return name;
  }
});

const iconColor = computed(() => {
  const name = finalName.value
  const icon = Icons.find(e => e.name === name);
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
