<template>
  <q-btn icon="more_horiz" flat round>
    <q-menu class="pi-menu">
      <q-list :style="{minWidth: '200px'}">
        <template v-for="(action, index) in actions" :key="`action-${index}`">
          <template v-if="true">
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
        </template>
      </q-list>
    </q-menu>
  </q-btn>
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
      label: 'Recent',
      value: 'recent',
      icon: 'schedule',
      selected: orderField.value === 'recent',
      sortable: true,
      separator: false
    },
    {
      label: 'Note',
      value: 'note',
      icon: 'sort_by_alpha',
      sortable: true,
      selected: orderField.value === 'note',
    },
  ];
});

function onAction (action :any) {
  const value = action.value;
  switch (value) {
    case 'recent':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value;
      } else {
        orderDesc.value = true;
      }
      orderField.value = value;
      emit('sort', { updateTime: orderDesc.value ? 'desc' : 'asc' });
      break;
    case 'note':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value;
      } else {
        orderDesc.value = false;
      }
      orderField.value = value;
      emit('sort', { note: orderDesc.value ? 'desc' : 'asc' });
      break;
    default:
      break;
  }
}
</script>
