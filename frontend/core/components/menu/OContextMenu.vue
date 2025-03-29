<template>
  <q-menu class="o-context-menu pi-menu dense"
          ref="menu"
          :anchor="contextMenu ? 'bottom left' : anchor"
          :self="contextMenu ? 'top left' : self"
          :offset="offset"
          :context-menu="contextMenu">
    <q-list>
      <template v-for="(item, index) in list" :key="index">
        <q-separator class="bg-accent" v-if="item.separator" />
        <o-common-item v-bind="item"
                       clickable closable
                       @click="emit('command', item)" />
      </template>
      <slot name="list"></slot>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import {PropType} from 'vue';

defineProps({
  contextMenu: {
    type: Boolean,
    default: false
  },
  anchor: {
    type: String,
    default: 'bottom right'
  },
  self: {
    type: String,
    default: 'top right'
  },
  offset: {
    type: Array,
    default: function () {
      return [0, 8];
    }
  },
  list: {
    type: Array as PropType<Indexable[]>,
    default: function () {
      return [];
    }
  }
});
const emit = defineEmits(['command']);
</script>

<style lang="scss">
.o-context-menu {
  width: 240px;
  max-height: 400px;
}
</style>
