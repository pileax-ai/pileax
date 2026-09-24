<template>
  <q-btn icon="more_horiz" flat round>
    <q-menu class="pi-menu" :offset="[0, 4]">
      <q-list :style="{minWidth: '240px'}">
        <template v-for="(action, index) in actions" :key="`action-${index}`">
          <q-separator class="bg-accent" v-if="action.separator" />
          <o-common-item v-bind="action"
                         class="text-tips"
                         :class="{ 'active': action.selected }"
                         @click="onAction(action)"
                         clickable
                         closable
                         right-side>
            <template #side>
              <q-icon :name="library.orderDesc ? 'south' : 'north'"
                      v-if="action.sortable" />
            </template>
          </o-common-item>
        </template>
        <template v-if="group">
          <q-separator class="bg-accent" />
          <o-common-item icon="o_dataset"
                         :label="$t('book.groups.group')" right-side>
            <template #side>
              <q-toggle v-model="grouped"
                        @update:model-value="emit('filter')" />
            </template>
          </o-common-item>
        </template>

        <slot></slot>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useCommon from 'core/hooks/useCommon'
import useReading from 'src/hooks/useReading'

const props = defineProps({
  group: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['filter', 'sort'])

const { t } = useCommon()
const { library, setLibraryItem } = useReading()

const grouped = computed({
  get() {
    return library.value.grouped
  },
  set(value: string) {
    setLibraryItem('grouped', value)
  }
})

const actions = computed(() => {
  return [
    {
      label: t('view.gridTitle'),
      value: 'grid_title',
      icon: 'mdi-cards-variant',
      selected: library.value.view === 'grid_title',
    },
    {
      label: t('view.grid'),
      value: 'grid',
      icon: 'grid_view',
      selected: library.value.view === 'grid',
    },
    {
      label: t('view.compact'),
      value: 'compact',
      icon: 'view_cozy',
      selected: library.value.view === 'compact',
    },
    {
      label: t('view.list'),
      value: 'list',
      icon: 'list',
      selected: library.value.view === 'list',
    },
    {
      label: t('sortBy.recentAdd'),
      value: 'recentAdd',
      icon: 'schedule',
      selected: library.value.orderBy === 'recentAdd',
      sortable: true,
      separator: true,
    },
    {
      label: t('sortBy.recentRead'),
      value: 'recentRead',
      icon: 'schedule',
      selected: library.value.orderBy === 'recentRead',
      sortable: true,
    },
    {
      label: t('sortBy.title'),
      value: 'title',
      icon: 'sort_by_alpha',
      selected: library.value.orderBy === 'title',
      sortable: true,
    },
  ] as Indexable[]
})

function onAction (action :any) {
  const value = action.value
  switch (value) {
    case 'grid':
    case 'grid_title':
    case 'compact':
    case 'list':
      setLibraryItem('view', value)
      break
    case 'recentAdd':
    case 'recentRead':
    case 'title':{
      const desc = library.value.orderBy === value ? !library.value.orderDesc : true
      setLibraryItem('orderDesc', desc)
      setLibraryItem('orderBy', value)
      emit('sort')
      break
    }
    default:
      break
  }
}
</script>
