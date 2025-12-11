<template>
  <q-tooltip ref="tooltipRef" class="o-tooltip text-white" :class="`bg-${color}`"
             :anchor="anchor"
             :self="self"
             :transition-show="transitionShow"
             :transition-hide="transitionHide"
             @show="onShow">
    <div class="message">
      {{message}}
      <slot></slot>
    </div>

    <template v-if="caption">
      <div class="caption">
        {{caption}}
      </div>
      <slot name="caption"></slot>
    </template>
  </q-tooltip>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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
  transition: {
    type: Boolean,
    default: false
  },
})

const tooltipRef = ref(null)

const anchor = computed(() => {
  if (props.position === 'top' || props.position === 'bottom') {
    return `${props.position} middle`
  } else {
    return `center ${props.position}`
  }
})

const self = computed(() => {
  switch (props.position) {
    case 'bottom':
      return 'top middle'
    case 'top':
      return 'bottom middle'
    case 'left':
      return 'center right'
    case 'right':
      return 'center left'
    default:
      return ''
  }
})

const transitionShow = computed(() => {
  let value = props.position
  switch (props.position) {
    case 'bottom':
      value = 'down'
      break
    case 'top':
      value = 'up'
      break
  }
  return props.transition ? `jump-${value}` : undefined
})

const transitionHide = computed(() => {
  let value = props.position
  switch (props.position) {
    case 'bottom':
      value = 'up'
      break
    case 'top':
      value = 'down'
      break
    case 'left':
      value = 'right'
      break
    case 'right':
      value = 'left'
      break
  }
  return props.transition ?  `jump-${value}` : undefined
})

function onShow() {
  if (props.autohide) {
    setTimeout(() => {
      tooltipRef.value?.hide()
    }, props.hideTimeout)
  }
}
</script>

<style lang="scss">
.o-tooltip {
  font-size: 1rem;

  .title {
    font-size: 1.1rem;
  }
  .caption {
    font-size: 0.9rem;
    opacity: 0.5;
  }
}
</style>
