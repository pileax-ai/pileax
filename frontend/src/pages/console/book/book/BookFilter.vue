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
                       :class="{ 'active': isActive(action) }"
                       @click="onAction(action)"
                       clickable
                       closable
                       right-side>
          <template #side>
            <q-icon name="circle" size="8px" v-if="isActive(action)" />
          </template>
        </o-common-item>
      </template>

      <slot></slot>
    </q-list>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { workspaceBookService } from 'src/api/service/remote'
import { bookExtensions } from 'src/api/service/ebook/book'
const emit = defineEmits(['filter']);

const bookType = ref('');
const readingStatus = ref('');

const actions = computed(() => {
  return [
    {
      label: 'All',
      value: '',
      icon: 'grid_view',
      filter: 'extension',
      filterValue: '',
      group: 'Library',
    },
    {
      label: 'Book',
      value: 'book',
      icon: 'book',
      filter: 'extension',
      filterValue: bookExtensions,
    },
    {
      label: 'PDF',
      value: 'pdf',
      icon: 'mdi-file-pdf-box',
      filter: 'extension',
      filterValue: 'pdf',
    },
    {
      label: '所有',
      value: '',
      icon: 'grid_view',
      filter: 'reading_status',
      group: 'Reading status',
      filterValue: '',
    },
    {
      label: '未读',
      value: 'not_started',
      icon: 'schedule',
      filter: 'reading_status',
      filterValue: 0,
    },
    {
      label: '想读',
      value: 'want_to_read',
      icon: 'arrow_circle_right',
      filter: 'reading_status',
      filterValue: 1,
    },
    {
      label: '在读',
      value: 'currently_reading',
      icon: 'downloading',
      filter: 'reading_status',
      filterValue: 2,
    },
    {
      label: '已读',
      value: 'finished',
      icon: 'check_circle',
      filter: 'reading_status',
      filterValue: 3,
    },
  ] as Indexable[]
});

function isActive(action: Indexable) {
  return (action.filter === 'extension' && action.value === bookType.value)
    || (action.filter === 'reading_status' && action.value === readingStatus.value)
}

function onAction (action: Indexable) {
  switch (action.filter) {
    case 'extension':
      bookType.value = action.value
      break;
    case 'reading_status':
      readingStatus.value = action.value
      break;
    default:
      break;
  }
  emit('filter', action);
}


function refresh() {
  workspaceBookService.getStats().then(res => {
    // list.value = res
  })
}

onMounted(() => {
  refresh()
})
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
