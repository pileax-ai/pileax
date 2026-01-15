<template>
  <o-navi-tabs class="recent-note-list">
    <template v-for="(item, index) in list" :key="index">
      <q-tab :ripple="false">
        <note-grid-item :data="item" />
      </q-tab>
    </template>
  </o-navi-tabs>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import ONaviTabs from 'core/components/navi/ONaviTabs.vue'
import NoteGridItem from './NoteGridItem.vue'
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
        title: t('note.create'),
        updateTime: ''
      }
    ]
})
</script>

<style lang="scss">
.recent-note-list {
  height: 190px;

  .note-grid-item {
    width: 180px;
    height: 180px;
    border-radius: 1rem;
  }
}
</style>
