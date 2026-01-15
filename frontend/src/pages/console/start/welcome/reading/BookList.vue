<template>
  <o-navi-tabs class="recent-book-list">
    <template v-for="(item) in list" :key="item.id">
      <q-tab :ripple="false">
        <book-grid-item :data="item" />
      </q-tab>
    </template>
  </o-navi-tabs>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import ONaviTabs from 'core/components/navi/ONaviTabs.vue'
import BookGridItem from './BookGridItem.vue'
import useCommon from 'core/hooks/useCommon'

const props = defineProps({
  items: {
    type: Array as PropType<Indexable[]>,
    default: () => {
      return []
    }
  },
})

const { t } = useCommon()
const list = computed(() => {
  return props.items.length > 0
    ? props.items
    : [
      {
        title: t('book.add'),
        updateTime: ''
      }
    ]
})
</script>

<style lang="scss" scoped>
.recent-book-list {
  height: 210px;

  .book-grid-item {
    height: 200px;
    width: 150px;
    border-radius: 1rem;
  }
}
</style>
