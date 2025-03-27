<template>
  <q-tooltip class="o-tooltip text-white" :class="`bg-${color}`"
             :anchor="anchor"
             :self="self">
    {{message}}
    <slot></slot>

    <template v-if="caption">
      <br/>
      <span class="caption">
        {{caption}}
      </span>
    </template>
  </q-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'top'
  },
  color: {
    type: String,
    default: 'primary'
  },
});

const anchor = computed(() => {
  if (props.position === 'top' || props.position === 'bottom') {
    return `${props.position} middle`;
  } else {
    return `center ${props.position}`;
  }
})

const self = computed(() => {
  switch (props.position) {
    case 'bottom':
      return 'top middle';
    case 'top':
      return 'bottom middle';
    case 'left':
      return 'center right';
    case 'right':
      return 'center left';
    default:
      return '';
  }
})
</script>

<style lang="scss">
</style>
