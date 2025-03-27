<template>
  <section class="cursor-pointer o-hover-menu"
         @mouseenter="!nohover && (menuOver = true)"
         @mouseleave="!nohover && (menuOver = false)">
    <slot name="trigger"></slot>
    <q-menu v-model="menu"
            :anchor="anchor"
            :self="self"
            :offset="offset"
            :class="menuClass"
            class="shadow-2">
      <div :style="{minWidth: minWidth, maxWidth: maxWidth}">
        <q-list no-border link inset-delimiter
                @mouseenter="!nohover && (listOver = true)"
                @mouseleave="!nohover && (listOver = false)">
          <slot></slot>
        </q-list>
      </div>
    </q-menu>
  </section>
</template>

<script setup lang="ts">
import { debounce } from 'quasar';
import {computed, onMounted, PropType, ref, watch} from 'vue';

const props = defineProps({
  nohover: { type: Boolean, default: false },
  anchor: {type: undefined, default: 'bottom right'},
  self: { type: String, default: 'top right' },
  offset: {
    type: Array as PropType<number[]>,
    default: () => {
      return [0, 0];
    }
  },
  minWidth: { type: String, default: '160px' },
  maxWidth: { type: String, default: '300px' },
  menuClass: { type: String, default: '' },
});

const menu = ref(false);
const menuOver = ref(false);
const listOver = ref(false);

function toggleMenu() {
  menu.value = menuOver.value || listOver.value;
}

watch(menuOver, () => {
  toggleMenu();
})

watch(listOver, () => {
  toggleMenu();
})

onMounted(() => {
  toggleMenu = debounce(toggleMenu, 100); // todo: Cannot assign to because it is a function.
});
</script>

<style lang="scss">
.o-hover-menu {
  .mdi-none {
    display: none;
  }
}
</style>
