<template>
  <nav class="book-collection-filter pi-menu">
    <header>
    </header>
    <q-list>
      <q-item-label class="group" caption>
        Book Collection
      </q-item-label>
      <template v-for="(item, index) of collections" :key="`item-${index}`">
        <o-common-item v-bind="item"
                       :class="`text-${item.color} ${item.value === modelValue ? 'active' : ''}`"
                       @click="onAction(item)"
                       clickable
                       closable
                       right-side>
          <template #side>
            <q-btn icon="more_vert"
                   flat
                   v-if="item.value && item.value !== 'add'">
              <q-menu class="pi-menu" :offset="[0, 4]" anchor="bottom right" self="top right">
                <q-list>
                  <template v-for="(action, _index) in actions" :key="_index">
                    <o-common-item v-bind="action"
                                   class="text-readable"
                                   @click="onAction({...action, value: item.value, itemLabel: item.label})"
                                   clickable
                                   closable>
                    </o-common-item>
                  </template>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
        </o-common-item>
      </template>
      <slot></slot>
    </q-list>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { bookCollectionService } from 'src/service/remote/book-collection'
import useCrud from 'src/hooks/useCrud';

const apiName = 'bookCollection';
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['action', 'update:modelValue']);

const { crud } = useCrud();
const list = ref<Indexable[]>();

const collections = computed(() => {
  const newList = list.value?.map(item => {
    return {
      label: item.title,
      value: item.id,
      icon: item.icon || '🍃',
      color: item.color,
      action: 'filter',
    }
  }) || [] as Indexable[]
  newList.unshift({
    label: 'All',
    value: '',
    icon: 'icon-reading-list',
    color: '',
    action: 'filter',
  })
  newList.push({
    label: 'Add Collection',
    value: 'add',
    icon: 'add',
    color: '',
    action: 'add',
  })
  return newList
});

const actions = computed(() => {
  return [
    {
      label: 'Edit',
      value: '',
      action: 'edit',
      icon: 'edit'
    },
    {
      label: 'Delete',
      value: '',
      action: 'delete',
      icon: 'delete'
    },
  ]
})

function onAction (item :Indexable) {
  switch (item.action) {
    case 'filter':
      emit('update:modelValue', item.value)
      break;
    case 'delete':
      onDelete(item)
      break;
    default:
      break;
  }
  emit('action', item)
}

function onDelete(item: Indexable) {
  crud.remove(item.value, {
    label: item.itemLabel,
    callback: () => {
      refresh()
    }
  })
}

function refresh() {
  bookCollectionService.getAll().then(res => {
    list.value = res
  })
}

onMounted(() => {
  crud.init(apiName);
  refresh();
})

defineExpose({
  refresh
})
</script>

<style lang="scss">
.book-collection-filter {
  .q-list {
    .group {
      margin: 20px 0 6px 0;
      font-size: 0.9rem;
    }

    .q-item {
      padding: 4px 10px;
      min-height: 44px;
    }
  }
}
</style>
