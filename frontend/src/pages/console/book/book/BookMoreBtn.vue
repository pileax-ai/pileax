<template>
  <q-btn icon="more_horiz" flat round>
    <q-menu class="pi-menu" :offset="[0, 4]">
      <q-list :style="{minWidth: '200px'}">
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
              <q-icon :name="orderDesc ? 'south' : 'north'"
                      v-if="action.sortable" />
            </template>
          </o-common-item>
        </template>
        <slot></slot>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useCommon from 'core/hooks/useCommon'
const emit = defineEmits(['view', 'sort'])

const { t, confirm } = useCommon()
const bookView = ref('grid')
const orderField = ref('recentRead')
const orderDesc = ref(true)

const props = defineProps({
  view: {
    type: String,
    default: 'grid'
  },
  orderBy: {
    type: String,
    default: 'recentRead'
  },
  source: {
    type: String,
    default: 'book'
  },
})

const actions = computed(() => {
  return [
    {
      label: t('view.grid'),
      value: 'grid',
      icon: 'grid_view',
      selected: bookView.value === 'grid',
    },
    {
      label: t('view.list'),
      value: 'list',
      icon: 'list',
      selected: bookView.value === 'list',
    },
    {
      label: t('view.compact'),
      value: 'compact',
      icon: 'view_cozy',
      selected: bookView.value === 'compact',
    },
    {
      label: t('sortBy.recentAdd'),
      value: 'recentAdd',
      icon: 'schedule',
      sources: ['book', 'book-add'],
      selected: orderField.value === 'recentAdd',
      sortable: true,
      separator: true,
    },
    {
      label: t('sortBy.recentRead'),
      value: 'recentRead',
      icon: 'schedule',
      sources: ['book'],
      selected: orderField.value === 'recentRead',
      sortable: true,
    },
    {
      label: t('sortBy.title'),
      value: 'title',
      icon: 'sort_by_alpha',
      sources: ['book', 'book-add'],
      selected: orderField.value === 'title',
      sortable: true,
    },
  ].filter(i => !i.sources || i.sources.includes(props.source))
})

function onAction (action :any) {
  const value = action.value
  switch (value) {
    case 'grid':
    case 'compact':
    case 'list':
      bookView.value = value
      emit('view', value)
      break
    case 'recentAdd':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value
      } else {
        orderDesc.value = true
      }
      orderField.value = value
      if (props.source === 'book-add') {
        emit('sort', { 'book.update_time': orderDesc.value ? 'desc' : 'asc' })
      } else {
        emit('sort', { 'workspacebook.update_time': orderDesc.value ? 'desc' : 'asc' })
      }
      break
    case 'recentRead':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value
      } else {
        orderDesc.value = true
      }
      orderField.value = value
      if (props.source === 'book-add') {
        emit('sort', { 'book.update_time': orderDesc.value ? 'desc' : 'asc' })
      } else {
        emit('sort', { 'userbook.update_time': orderDesc.value ? 'desc' : 'asc' })
      }
      break
    case 'title':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value
      } else {
        orderDesc.value = false
      }
      orderField.value = value
      emit('sort', { 'book.title_pinyin': orderDesc.value ? 'desc' : 'asc' })
      break
    default:
      break
  }
}

onMounted(() => {
  bookView.value = props.view
  orderField.value = props.orderBy
})
</script>
