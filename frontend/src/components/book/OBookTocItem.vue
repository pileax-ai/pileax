<template>
  <section class="o-navi-expansion-item">
    <q-expansion-item class="dense" :class="`level-${level}`"
                      :header-class="{ 'root': root, 'header-item': true }"
                      :header-style="{ 'paddingLeft': `${(level-1)*10}px` }"
                      :default-opened="root"
                      :expand-icon-toggle="root"
                      v-if="data.subitems?.length">
      <template v-slot:header>
        <q-item-section class="text-info title">
          <q-item-label lines="1">
            {{ data.label }}
          </q-item-label>
        </q-item-section>
      </template>
      <q-separator class="bg-accent" v-if="separator" />
      <slot></slot>

      <template v-for="(item, index) of data.subitems" :key="`${data.id}-${index}`">
        <o-book-toc-item v-if="item.subitems && item.subitems.length > 0"
                         :parent-key="`${parentKey}-${item.id}`"
                         :level="level+1"
                         :data="item" />
        <o-navi-item class="text-info data-item"
                     :class="{'active': tocItem.id === item.id}"
                     :style="`padding-left: ${ level > 1 ? (level)*20 - (level-1)*16 : 10}px`"
                     :item="item"
                     v-else />
      </template>
    </q-expansion-item>
    <o-navi-item class="text-info data-item"
                 :class="{'active': tocItem.id === data.id}"
                 :item="data"
                 :show-item-icon="showItemIcon"
                 v-else />
  </section>
</template>

<script setup lang="ts">
import {computed, PropType, defineAsyncComponent, watch} from 'vue';

import ONaviItem from 'src/components/book/ONaviItem.vue';
import useBook from 'src/hooks/useBook';
import {BookTocItem} from 'src/types/reading';

const props = defineProps({
  root: { type: Boolean, default: false },
  level: { type: Number, default: 0 },
  parentKey: { type: String, default: '' },
  data: {
    type: Object as PropType<BookTocItem>,
    default: () => {
      return {};
    }
  },
  separator: { type: Boolean, default: false },
  collapse: { type: Boolean, default: false },
  showItemIcon: { type: Boolean, default: false },
});

defineAsyncComponent(() =>
  import('src/components/book/OBookTocItem.vue')
);

const { tocItem } = useBook();

</script>

<style lang="scss">
.o-navi-expansion-item {
  .separator {
    padding: 0 12px;
    margin: 16px 0 4px 0;
    opacity: 0.3;
  }

  .q-item {
    padding: 0 10px 0 0;
    min-height: 30px;
    &.root {
      .q-item__section--main {
        padding: 0 !important;
      }
      .q-item__section--side {
        display: none;
      }
    }

    .q-icon {
      font-size: 1.4rem;
    }

    .item-label {
      .q-badge {
        font-size: 8px;
        padding: 2px 2px 0 2px;
        margin-left: 4px;
        border-radius: 2px;
        line-height: unset;
        min-height: unset !important;
        vertical-align: middle;
      }
    }
  }
}
</style>
