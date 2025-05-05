<template>
  <span class="o-icon" v-if="emoji">
    {{ emoji }}
  </span>
  <template v-else>
    <svg class="o-icon svg-icon" v-bind="$attrs" aria-hidden="true"
         :style="`--svg-icon-color: ${color}; --svg-icon-size: ${size}`"
         v-if="name.indexOf('icon') === 0">
      <use :xlink:href="`#${name}`"></use>
    </svg>
    <img :src="$public(pngPath)" alt="icon" class="o-icon" v-bind="$attrs"
         v-else-if="name.indexOf('png') === 0" />
    <img :src="name" alt="icon" class="o-icon" v-bind="$attrs"
         v-else-if="name.indexOf('http') === 0" />
    <q-icon :name="name" class="o-icon" :size="size" v-bind="$attrs" v-else />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  emoji: {
    type: String,
    default: ''
  },
});

const pngPath = computed(() => {
  const name = props.name.replace('png-', '');
  return `/icons/png/${name}.png`
})
</script>

<style lang="scss">
.o-icon {
  &.svg-icon {
    width: var(--svg-icon-size);
    height: var(--svg-icon-size);
    color: var(--svg-icon-color);
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
