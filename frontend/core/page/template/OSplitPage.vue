<template>
  <q-page ref="pageRef" class="o-split-page"
          :class="{'page-full-screen': fullScreen, 'closed': closed}">
    <q-splitter v-model="size"
                :limits="[0, maxSize]"
                :reverse="reverse"
                :horizontal="horizontal"
                unit="px"
                :before-class="{ 'toggle-activator': !reverse }"
                :after-class="{ 'toggle-activator': reverse }"
                separator-class="bg-dark toggle-activator"
                @update:modelValue="onSizeChanged">
      <template #before>
        <slot name="before"></slot>
      </template>
      <template v-slot:separator>
        <q-btn :icon="toggleIcon"
               class="bg-dark text-tips"
               :class="{
                  'reverse': reverse,
                  'toggle-v': !horizontal,
                  'toggle-h': horizontal
               }"
               flat
               @click="onToggle" />
      </template>
      <template #after>
        <q-scroll-area class="o-page-container">
          <slot name="after"></slot>
        </q-scroll-area>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, useTemplateRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core';

const props = defineProps({
  horizontal: {
    type: Boolean,
    default: false
  },
  reverse: {
    type: Boolean,
    default: false
  },
  initSize: {
    type: Number,
    default: 260
  },
  maxSize: {
    type: Number,
    default: 300
  },
  show: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['size', 'update:show']);

const pageRef = useTemplateRef<HTMLElement>('pageRef');
const { width, height } = useElementSize(pageRef);
const fullScreen = ref(false);

const size = ref(0);
const sizeRestore = ref(0);

const toggleIcon = computed(() => {
  if (props.horizontal) {
    return props.reverse
      ? size.value > 0 ? 'keyboard_arrow_down' :  'keyboard_arrow_up'
      : size.value > 0 ? 'keyboard_arrow_up' :  'keyboard_arrow_down'
  } else {
    return props.reverse
      ? size.value > 0 ? 'keyboard_arrow_right' :  'keyboard_arrow_left'
      : size.value > 0 ? 'keyboard_arrow_left' :  'keyboard_arrow_right'
  }
})

const closed = computed(() => {
  return size.value === 0
})

function onToggle() {
  !props.show ? open() : close();
}

function open() {
  size.value = sizeRestore.value || props.initSize;
}

function close() {
  sizeRestore.value = size.value;
  size.value = 0;
}

function onSizeChanged(value: number) {
  sizeRestore.value = value;
}

function setFullScree(value: boolean) {
  fullScreen.value = value
}

watch(() => props.show, (newValue) => {
  newValue ? open() : close();
})

watch(size, (newValue) => {
  emit('size', newValue)
  emit('update:show', newValue > 0)
})

defineExpose({
  setFullScree,
})

onMounted(() => {
  size.value = props.show ? props.initSize : 0
})
</script>

<style lang="scss">
.o-split-page {
  &.closed {
    .q-splitter__separator {
      width: 0;
    }
  }

  .q-splitter--vertical {
    height: calc(100vh - 40px);

    &:has(.toggle-activator:hover) {
      .toggle-v {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    .q-splitter__before {
      overflow: hidden;
      //transition: width 0.3s ease-in-out;
    }

    .q-splitter__separator-area {
      left: -16px !important;
      right: -16px !important;

      &:before {
        content: '';
        position: absolute;
        left: 15px;
        width: 2px;
        top: 0;
        bottom: 0;
        background: var(--q-dark);
        opacity: 0;
        transform: translateX(0.5px);
        transition: opacity 0.3s ease;
      }
    }
  }

  .q-splitter--horizontal {
    &:has(.toggle-activator:hover) {
      .toggle-h {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    .q-splitter__before {
      overflow: hidden;
    }

    .q-splitter__separator-area {
      top: -16px !important;
      bottom: -16px !important;
      &:after {
        content: '';
        position: absolute;
        top: 15px;
        height: 2px;
        left: 0;
        right: 0;
        background: var(--q-dark);
        opacity: 0;
        transform: translateY(0.5px);
        transition: opacity 0.3s ease;
      }
    }
  }

  .q-splitter--active > .q-splitter__separator, .q-splitter__separator:hover {
    .q-splitter__separator-area {
      &:before, &:after {
        opacity: 1 !important;
      }
    }
  }

  .toggle-h {
    min-height: unset;
    padding: 0 16px;
    height: 24px;
    margin-top: 12px;
    border-radius: 0 0 4px 4px;

    &.reverse {
      margin-top: -12px;
      border-radius: 4px 4px 0 0;
    }
  }

  .toggle-v {
    min-width: unset;
    padding: 16px 0;
    width: 24px;
    margin-left: 12px;
    border-radius: 0 4px 4px 0;

    &.reverse {
      margin-left: -12px;
      border-radius: 4px 0 0 4px;
    }
  }

  .toggle-h, .toggle-v {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;
  }

  &.page-full-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2002;
    background: var(--q-secondary);


    .q-splitter--vertical, .q-splitter--horizontal {
      height: 100vh;
    }
  }
}
</style>
