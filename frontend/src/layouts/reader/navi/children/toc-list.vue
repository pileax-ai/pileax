<template>
  <drawer-navi class="toc-navi-list">
    <template #content>
      <q-list class="list" :style="`width: ${width}px`">
        <o-book-toc-item class="root-items"
                         :parent-key="activity"
                         :data="activeMenu"
                         :show-icon="true"
                         :level="1"
                         root
                         show-item-icon
                         separator />
      </q-list>
    </template>
  </drawer-navi>
</template>

<script setup lang="ts">
import DrawerNavi from 'core/page/DrawerNavi.vue';
import OBookTocItem from 'src/components/book/OBookTocItem.vue';
import {computed} from 'vue';
import useNavi from 'src/hooks/useNavi';
import useBook from 'src/hooks/useBook';

const { activity } = useNavi();
const { toc } = useBook();

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
});

const activeMenu = computed(() => {
  return {
    id: 0,
    label: '',
    subitems: toc.value
  };
})

</script>

<style lang="scss">
.toc-navi-list {
  .header-item.root {
    height: 60px !important;
  }

  .list {
    padding: 0 8px;
  }

  .root-item > .q-expansion-item > .q-expansion-item__container > .q-item {
    .title {
      padding-left: 30px;
      text-align: center;
      font-weight: 600;
    }
  }

  .q-expansion-item {
    .q-item {
      height: 36px;
      border-radius: 4px;
      margin-top: 2px;
      .q-icon {
        font-size: 1.5rem;
      }
      svg {
        width: 1.6rem;
        height: 1.6rem;
      }

      &.active:before {
        border-radius: 4px;
      }

      &.active:after {
        content: "";
        width: 2px;
        height: 20px;
        position: absolute;
        right: 0;
        top: 8px;
        background-color: var(--q-primary);
      }
    }
  }
}
</style>
