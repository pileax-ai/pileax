<template>
  <q-page class="o-split-page">
    <q-splitter v-model="verticalSideWidth"
                :limits="[0, 100]"
                before-class="before-v"
                after-class="after-v"
                separator-class="bg-dark separator-v"
                reverse
                @update:modelValue="onVerticalChanged">
      <template #before>
        <q-splitter v-model="horizontalSideWidth"
                    :limits="[0, 100]"
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
            <q-btn :icon="horizontalSideWidth ? 'keyboard_arrow_down' :  'keyboard_arrow_up'"
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
import { PropType, ref } from 'vue'
const props = defineProps({
  vertical: {
    type: String as PropType<'left' | 'right'>,
    default: 'right',
    validator: (val: string) => ['left', 'right'].includes(val)
  },
  verticalSide: {
    type: Number,
    default: 20
  },
  horizontal: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'bottom',
    validator: (val: string) => ['top', 'bottom'].includes(val)
  },
  horizontalSide: {
    type: Number,
    default: 16
  }
});

const verticalSideWidth = ref(props.verticalSide);
const verticalSideWidthRestore = ref(0);
const horizontalSideWidth = ref(props.horizontalSide);
const horizontalSideWidthRestore = ref(0);

function expandHorizontalSide(expanded: boolean) {
  horizontalSideWidth.value = expanded
    ? 100
    : (horizontalSideWidthRestore.value || props.horizontalSide);
}

function onToggleHorizontal() {
  if (horizontalSideWidth.value) {
    horizontalSideWidthRestore.value = horizontalSideWidth.value;
    horizontalSideWidth.value = 0;
  } else {
    horizontalSideWidth.value = horizontalSideWidthRestore.value || props.horizontalSide;
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
}

function onHorizontalChanged(value: number) {
  horizontalSideWidthRestore.value = value;
}

defineExpose({
  expandHorizontalSide
})
</script>

<style lang="scss">
.o-split-page {
  .q-splitter--vertical {
    height: calc(100vh - 40px);

    .q-splitter__before {
      overflow: hidden;
    }

    &:has(.after-v:hover, .separator-v:hover) {
      .toggle-v {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
  }

  .q-splitter--horizontal {
    height: calc(100vh - 40px);

    .q-splitter__before {
      overflow: hidden;
    }

    &:has(.after-h:hover, .separator-h:hover) {
      .toggle-h {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
  }

  .toggle-h {
    min-height: unset;
    padding: 0 16px;
    height: 24px;
    margin-top: -12px;
    border-radius: 4px 4px 0 0;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;
  }

  .toggle-v {
    min-width: unset;
    padding: 16px 0;
    width: 24px;
    margin-left: -12px;
    border-radius: 4px 0 0 4px;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;
  }

}
</style>
