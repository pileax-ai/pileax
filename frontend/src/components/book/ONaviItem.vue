<template>
  <q-item class="o-navi-item" clickable @click="onClick">
    <q-item-section class="row item-label">
      <q-item-label lines="1">
        {{ item.label }}
      </q-item-label>
    </q-item-section>
    <q-item-section side v-if="false">
      <q-icon name="open_in_new" size="1rem" class="text-info" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import useBook from 'src/hooks/useBook';
import type { BookTocItem } from 'src/types/reading';

const props = defineProps({
  item: {
    type: Object as PropType<BookTocItem>,
    default: () => {
      return {};
    }
  },
  showItemIcon: {
    type: Boolean,
    default: false
  }
});

const { setTocItem } = useBook();

function onClick() {
  setTocItem(props.item);
  window.ebook.goToHref(props.item.href);
}
</script>

<style lang="scss">
.o-navi-item {
  padding: 0 10px 0 10px;
  min-height: 42px;

  &.active:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    color: var(--q-primary) !important;
    background-color: var(--q-primary);
    opacity: 0.1;
  }

  &.active:after {
    content: "";
    width: 2px;
    position: absolute;
    right: 0;
    top: 10px;
    bottom: 10px;
    background-color: var(--q-primary);
  }
}
</style>
