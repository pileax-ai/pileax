<template>
  <nav class="book-filter pi-menu">
    <header>
    </header>
    <q-list>
      <template v-for="(action, index) in actions" :key="`action-${index}`">
        <q-item-label class="group" caption v-if="action.group">
          {{action.group}}
        </q-item-label>
        <q-separator class="bg-accent" v-if="action.separator" />
        <o-common-item v-bind="action"
                       class="text-readable"
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
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
const emit = defineEmits(['view', 'sort']);

const bookView = ref('grid');
const orderField = ref('recent');
const orderDesc = ref(true);

const actions = computed(() => {
  return [
    {
      label: 'All',
      value: 'grid',
      icon: 'grid_view',
      selected: bookView.value === 'grid',
      group: 'Library',
    },
    {
      label: 'List',
      value: 'list',
      icon: 'list',
      selected: bookView.value === 'list',
    },
    {
      label: 'PDF',
      value: 'list',
      icon: 'list',
      selected: bookView.value === 'list',
    },
    {
      label: '未读',
      value: 'recent',
      icon: 'schedule',
      selected: orderField.value === 'recent',
      sortable: true,
      group: 'Reading status',
    },
    {
      label: '想读',
      value: 'title',
      icon: 'sort_by_alpha',
      sortable: true,
      selected: orderField.value === 'title',
    },
    {
      label: '在读',
      value: 'title',
      icon: 'sort_by_alpha',
      sortable: true,
      selected: orderField.value === 'title',
    },
    {
      label: '已读',
      value: 'title',
      icon: 'sort_by_alpha',
      sortable: true,
      selected: orderField.value === 'title',
    },
    {
      label: '未读',
      value: 'recent',
      icon: 'schedule',
      selected: orderField.value === 'recent',
      sortable: true,
      group: 'Color tag',
    },
    {
      label: '想读',
      value: 'title',
      icon: 'sort_by_alpha',
      sortable: true,
      selected: orderField.value === 'title',
    },
    {
      label: '在读',
      value: 'title',
      icon: 'sort_by_alpha',
      sortable: true,
      selected: orderField.value === 'title',
    },
  ];
});

function onAction (action :any) {
  const value = action.value;
  switch (value) {
    case 'grid':
    case 'list':
      bookView.value = value;
      emit('view', value);
      break;
    case 'recent':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value;
      } else {
        orderDesc.value = true;
      }
      orderField.value = value;
      emit('sort', { update_time: orderDesc.value ? 'desc' : 'asc' });
      break;
    case 'title':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value;
      } else {
        orderDesc.value = false;
      }
      orderField.value = value;
      emit('sort', { title: orderDesc.value ? 'desc' : 'asc' });
      break;
    default:
      break;
  }
}
</script>

<style lang="scss">
.book-filter {
  .q-list {
    .group {
      margin: 20px 0 6px 0;
      font-size: 0.9rem;
    }

    .q-item {
      padding: 4px 10px;
    }
  }
}
</style>
