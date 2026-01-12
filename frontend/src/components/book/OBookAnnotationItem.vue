<template>
  <q-item class="o-book-annotation-item"
          :class="{ 'active': item.id === store.annotationId }"
          clickable
          @click="onClick">
    <q-item-section class="row item-label">
      <q-item-label lines="2">
        {{ item.note }}
      </q-item-label>
      <q-item-label lines="1" caption>
        {{ item.chapter }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      {{ item.page }}
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

import useBook from 'src/hooks/useBook'
import type { BookTocItem } from 'src/types/reading'

const props = defineProps({
  item: {
    type: Object as PropType<BookTocItem>,
    default: () => {
      return {}
    }
  },
})

const { store, setTocItem } = useBook()

function onClick() {
  store.setAnnotationId(props.item.id)
  window.ebook.goToHref(props.item.value)
}
</script>

<style lang="scss">
.o-book-annotation-item {
  padding: 6px 10px;
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
