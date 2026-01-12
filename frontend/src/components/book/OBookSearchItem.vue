<template>
  <section class="o-book-search-item">
    <template v-for="(topItem, i) of data" :key="`topItem-${i}`">
      <q-expansion-item class="dense"
                        default-opened>
        <template v-slot:header>
          <q-item-section class="text-info text-bold title">
            <q-item-label lines="1">
              {{ topItem.label }}
            </q-item-label>
          </q-item-section>
        </template>
        <q-separator class="bg-accent" v-if="separator" />

        <template v-for="(item, j) of topItem.subitems" :key="`item-${j}`">
          <q-item class="text-info data-item o-navi-item"
                  :class="{'active': currentItem.item?.cfi === item.cfi}"
                  clickable @click="onClick(topItem, i, item, j)">
            <q-item-section class="row item-label">
              <q-item-label class="text-readable" lines="5">
                <span>{{ item.excerpt.pre }}</span>
                <span class="text-primary">{{ item.excerpt.match }}</span>
                <span>{{ item.excerpt.post }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-expansion-item>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import useBook from 'src/hooks/useBook'

const props = defineProps({
  data: {
    type: Array as PropType<Indexable[]>,
    default: () => {
      return []
    }
  },
  separator: { type: Boolean, default: false },
})
const emit = defineEmits(['navi'])

const { store } = useBook()
const currentItem = computed(() => {
  return store.search.current || {}
})

function onClick(topItem: Indexable, topIndex: number,
                 item: Indexable, itemIndex: number) {
  emit('navi', {
    top: topItem,
    topIndex: topIndex,
    item: item,
    itemIndex: itemIndex
  })
}
</script>

<style lang="scss">
.o-book-search-item {
  .q-item {
    min-height: 30px;

    &.data-item {
      padding: 8px !important;
      background: var(--q-secondary);

      &:not(:first-child) {
        margin-top: 8px;
      }
    }
  }
}
</style>
