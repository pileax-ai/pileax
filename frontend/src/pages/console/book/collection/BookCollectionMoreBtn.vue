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
import { computed, ref } from 'vue'
import useCommon from 'core/hooks/useCommon'
const emit = defineEmits(['view', 'sort'])

const { t } = useCommon()
const bookView = ref('grid')
const orderField = ref('recent')
const orderDesc = ref(true)

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
      label: t('sortBy.recent'),
      value: 'recent',
      icon: 'schedule',
      selected: orderField.value === 'recent',
      sortable: true,
      separator: true
    },
    {
      label: t('sortBy.title'),
      value: 'title',
      icon: 'sort_by_alpha',
      sortable: true,
      selected: orderField.value === 'title',
    },
  ]
})

function onAction (action :any) {
  const value = action.value
  switch (value) {
    case 'grid':
    case 'list':
      bookView.value = value
      emit('view', value)
      break
    case 'recent':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value
      } else {
        orderDesc.value = true
      }
      orderField.value = value
      emit('sort', { 'workspacebookcollection.update_time': orderDesc.value ? 'desc' : 'asc' })
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
</script>
