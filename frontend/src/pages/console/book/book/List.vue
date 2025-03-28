<template>
  <o-console-page class="book-list"
                title=" "
                icon="book" disable-meta
                  v-bind="query">
    <template #header-left>
      <div class="query-item no-drag-region">
        <q-input v-model="condition.title"
                 placeholder="搜索"
                 debounce="800"
                 standout dense clearable
                 @update:model-value="doQuery">
          <template #prepend>
            <q-icon name="search" class="text-readable" />
          </template>
        </q-input>
      </div>
    </template>

    <!--Actions-->
    <template #actions>
      <o-refresh-btn icon="add"
                     tooltip="添加"
                     :loading="loading"
                     @click="onAdd" />
      <q-btn icon="more_horiz" flat round>
        <q-menu class="o-menu">
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
                </o-common-item>
              </template>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
    </template>

    <template v-if="rows.length">
      <section class="row col-12 q-col-gutter-lg grid-view" v-if="bookView === 'grid'">
        <template v-for="(item, index) in rows" :key="index">
          <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <book-grid-item :data="item"
                            @click="openBook(item)"
                            @details="onDetails(item)" />
          </div>
        </template>
      </section>
      <section class="row col-12 justify-center list-view" v-else>
        <q-list>
          <template v-for="(item, index) in rows" :key="index">
            <book-list-item :data="item"
                            @click="openBook(item)"
                            @details="onDetails(item)" />
          </template>
        </q-list>
      </section>
    </template>
    <template v-else>
      <section class="row col-12 justify-center no-records">
        <span class="text-readable">书库中还没有记录，快来添加吧</span>

        <div class="row col-12 justify-center action">
          <q-btn icon="add" label="添加图书"
                 class="bg-primary text-white"
                 flat @click="onAdd" />
        </div>
      </section>
    </template>

    <template #side-panel>
      <book-details :data="data"
                    @close="onClose"
                    v-if="view==='details'" />
    </template>
  </o-console-page>
</template>

<script setup lang="ts">
import {computed, onActivated, ref, watch} from 'vue';
import { importBooks, queryBook } from 'src/service/book';
import { bookService } from 'src/service/remote/book';
import BookGridItem from './BookGridItem.vue';
import BookListItem from './BookListItem.vue';
import BookDetails from './BookDetails.vue';

import useReader from 'src/hooks/useReader';
import useQuery from 'src/hooks/useQuery';

const { queryTimer } = useReader();
const { view, query } = useQuery();

const data = ref({});
const condition = ref<Indexable>({});
const rows = ref([]);
const loading = ref(false);
const bookView = ref('grid');
const sortBy = ref('recent');

const actions = computed(() => {
  return [
    {
      label: 'Grid',
      value: 'grid',
      icon: 'grid_view',
      selected: bookView.value === 'grid',
    },
    {
      label: 'List',
      value: 'list',
      icon: 'list',
      selected: bookView.value === 'list',
    },
    {
      label: 'Recent',
      value: 'recent',
      icon: 'schedule',
      selected: sortBy.value === 'recent',
      separator: true
    },
    {
      label: 'Title',
      value: 'title',
      icon: 'sort_by_alpha',
      selected: sortBy.value === 'title',
    },
  ];
});


function onAction (action :any) {
  switch (action.value) {
    case 'grid':
    case 'list':
      bookView.value = action.value;
      break;
    case 'recent':
    case 'title':
      sortBy.value = action.value;
      break;
    default:
      break;
  }
}

function onDetails(item: any) {
  data.value = item;
  query.value.openSide('480px', 'details');
}

function onClose() {
  query.value.closeSide();
  doQuery();
}

function onAdd() {
  loading.value = true;
  window.electronAPI.showDialog({
    filters: [
      { name: 'EBook', extensions: ['epub', 'mobi'] }
    ],
    properties: ['openFile', 'multiSelections']
  }).then(async (result: any) => {
    if (!result.canceled && result.filePaths.length > 0) {
      await importBooks(result.filePaths);
    }
    loading.value = false;
  }).catch((err: any) => {
    console.error('导入文件失败：', err);
    loading.value = false;
  });
}

function openBook(item: any) {
  window.electronAPI.openNewWindow(item.id, `/reader/view?id=${item.id}`);
}

function doQuery() {
  bookService.queryBook({
    title: condition.value.title
  }).then(res => {
    rows.value = res;
  });
}

function initData() {
  doQuery();
}

watch(() => queryTimer.value, (newValue) => {
  doQuery();
})

onActivated(() => {
  initData();
})
</script>

<style lang="scss">
.book-list {
  .list-view {
    .q-list {
      width: 100%;
      max-width: 1000px;
    }
  }

  .no-records {
    padding: 60px 0;

    .action {
      margin-top: 21px;

      .q-btn {
        height: 48px;
        width: 160px;
      }
    }
  }
}
</style>
