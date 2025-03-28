<template>
  <q-tooltip ref="tooltipRef" class="o-tooltip text-white" :class="`bg-${color}`"
             :anchor="anchor"
             :self="self" @show="onShow">
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
import { computed, ref } from 'vue';

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
  autohide: {
    type: Boolean,
    default: false
  },
  hideTimeout: {
    type: Number,
    default: 1000
  },
});

const tooltipRef = ref(null)

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

function onShow() {
  if (props.autohide) {
    setTimeout(() => {
      tooltipRef.value?.hide();
    }, props.hideTimeout)
  }
}
</script>

<style lang="scss">
</style>
