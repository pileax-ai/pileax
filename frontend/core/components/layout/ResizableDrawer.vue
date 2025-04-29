<template>
  <q-drawer
    v-model="value"
    :width="width"
    :side="side"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    class="resizable-drawer">
    <slot></slot>
    <div class="drawer-separator"
         :class="`${side} ${isResizing ? 'is-resizing' : '' }`">
      <div
        class="drawer-handle"
        v-touch-pan.horizontal.prevent.mouse.preserveCursor="onMouseMove">
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  defaultWidth: {
    type: Number,
    default: 200
  },
  minWidth: {
    type: Number,
    default: 200
  },
  maxWidth: {
    type: Number,
    default: 600
  },
  side: {
    type: String as () => 'left' | 'right',
    default: 'left'
  },
});
const emit = defineEmits(['enter', 'leave', 'resize', 'update:modelValue']);
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const width = ref(props.defaultWidth);
const drawerOpen = ref(false);
const isResizing = ref(false);
const startX = ref(0);
const startWidth = ref(0);

function onMouseMove(e :any) {
  if (e.isFirst) {
    startWidth.value = width.value;
    startX.value = e.position.left;
    isResizing.value = true;
    document.documentElement.style.cursor = 'col-resize';
  } else if (e.isFinal) {
    isResizing.value = false;
    document.documentElement.style.cursor = '';
  } else {
    const deltaX = props.side === 'left'
      ? e.position.left - startX.value
      : startX.value - e.position.left;
    const newWidth = startWidth.value + deltaX;
    width.value = Math.max(props.minWidth, Math.min(props.maxWidth, newWidth));
    emit('resize', width.value);
  }
}

function onMouseEnter(event: MouseEvent) {
  if (!isResizing.value) {
    emit('enter', event);
  }
}

/**
 * emit leave event only when resize stopped.
 *
 * @param event MouseEvent
 */
function onMouseLeave(event: MouseEvent) {
  if (!isResizing.value) {
    emit('leave', event);
  }
}

onBeforeMount(() => {
  drawerOpen.value = props.modelValue;
})

</script>

<style lang="scss">
.resizable-drawer {
  .drawer-separator {
    position: absolute;
    top: 0;
    bottom: 0;
    background: transparent;
    z-index: 3;
    cursor: col-resize;
    user-select: none;
    width: 1px;

    &.left {
      right: 0;
    }

    &.right {
      left: 0;
    }

    &:hover, &.is-resizing {
      //background: var(--q-primary);
    }
  }
  .drawer-handle {
    position: absolute;
    left: -6px;
    right: -6px;
    top: 0;
    bottom: 0;
    cursor: col-resize;
    user-select: none;
    z-index: 1000;
    background: transparent;
  }
}

</style>
