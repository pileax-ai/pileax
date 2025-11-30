<template>
  <q-page ref="pageRef" class="o-split-size-page">
    <q-splitter v-model="verticalSideWidth"
                :limits="[0, Infinity]"
                unit="px"
                before-class="before-v"
                after-class="after-v"
                separator-class="bg-dark separator-v"
                reverse
                @update:modelValue="onVerticalChanged">
      <template #before>
        <q-splitter v-model="horizontalSideHeight"
                    :limits="[0, Infinity]"
                    unit="px"
                    before-class="before-h"
                    after-class="after-h"
                    separator-class="bg-dark separator-h"
                    horizontal
                    reverse
                    @update:modelValue="onHorizontalChanged">
          <template #before>
            <slot></slot>
          </template>
          <template v-slot:separator>
            <q-btn :icon="horizontalSideHeight ? 'keyboard_arrow_down' :  'keyboard_arrow_up'"
                   class="bg-dark text-tips toggle-h"
                   flat
                   @click="onToggleHorizontal" />
          </template>
          <template #after>
            <slot name="horizontal-side"></slot>
          </template>
        </q-splitter>
      </template>
      <template v-slot:separator>
        <q-btn :icon="verticalSideWidth ? 'keyboard_arrow_right' :  'keyboard_arrow_left'"
               class="bg-dark text-tips toggle-v"
               flat
               @click="onToggleVertical" />
      </template>
      <template #after>
        <slot name="vertical-side"></slot>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { PropType, ref, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core';

const props = defineProps({
  vertical: {
    type: String as PropType<'left' | 'right'>,
    default: 'right',
    validator: (val: string) => ['left', 'right'].includes(val)
  },
  verticalSide: {
    type: Number,
    default: 320
  },
  horizontal: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'bottom',
    validator: (val: string) => ['top', 'bottom'].includes(val)
  },
  horizontalSide: {
    type: Number,
    default: 160
  }
});
const emit = defineEmits(['sideWidth', 'sideHeight']);

const pageRef = useTemplateRef<HTMLElement>('pageRef');
const { width, height } = useElementSize(pageRef);

const verticalSideWidth = ref(props.verticalSide);
const verticalSideWidthRestore = ref(0);
const horizontalSideHeight = ref(props.horizontalSide);
const horizontalSideHeightRestore = ref(0);

function expandHorizontalSide(expanded: boolean) {
  horizontalSideHeight.value = expanded
    ? height.value
    : (horizontalSideHeightRestore.value || props.horizontalSide);
}

function onToggleHorizontal() {
  if (horizontalSideHeight.value) {
    horizontalSideHeightRestore.value = horizontalSideHeight.value;
    horizontalSideHeight.value = 0;
  } else {
    horizontalSideHeight.value = horizontalSideHeightRestore.value || props.horizontalSide;
  }
}

function onToggleVertical() {
  if (verticalSideWidth.value) {
    verticalSideWidthRestore.value = verticalSideWidth.value;
    verticalSideWidth.value = 0;
  } else {
    verticalSideWidth.value = verticalSideWidthRestore.value || props.verticalSide;
  }
}

function onVerticalChanged(value: number) {
  verticalSideWidthRestore.value = value;
  emit('sideWidth', value);
}

function onHorizontalChanged(value: number) {
  horizontalSideHeightRestore.value = value;
  emit('sideHeight', value);
}

defineExpose({
  expandHorizontalSide
})
</script>

<style lang="scss">
.o-split-size-page {
  .q-splitter--vertical {
    height: calc(100vh - 40px);

    &:has(.after-v:hover, .separator-v:hover) {
      .toggle-v {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    .q-splitter__before {
      overflow: hidden;
    }

    .separator-v .q-splitter__separator-area {
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
    &:has(.after-h:hover, .separator-h:hover) {
      .toggle-h {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    .q-splitter__before {
      overflow: hidden;
    }

    .separator-h .q-splitter__separator-area {
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
    margin-top: -12px;
    border-radius: 4px 4px 0 0;
  }

  .toggle-v {
    min-width: unset;
    padding: 16px 0;
    width: 24px;
    margin-left: -12px;
    border-radius: 4px 0 0 4px;
  }

  .toggle-h, .toggle-v {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;
  }

}
</style>
