<template>
  <o-console-page class="book-list"
                  title=" "
                  icon="book"
                  v-bind="query"
                  disable-meta
                  enable-fullscreen>
    <template #header-left>
      <div class="query-item no-drag-region">
        <q-input v-model="condition.title"
                 class="pi-field"
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
      <o-file-uploader-btn :accept="bookAccept" :loading="loading" leading
                       @ready="onAddReady" />
      <o-refresh-btn icon="add"
                     tooltip="添加"
                     :loading="loading"
                     @click="onAdd" v-if="false" />
      <book-filter-btn @view="onView" @sort="onSort" />
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
      <o-no-data message="没有记录" image v-if="condition.title" />
      <section class="row col-12 justify-center no-records" v-else>
        <span class="text-readable">书库中还没有记录，快来添加吧</span>

        <div class="row col-12 justify-center action">
          <q-btn icon="add" label="添加图书"
                 class="bg-primary text-white"
                 flat @click="onAdd" v-if="false" />
          <o-file-uploader :accept="bookAccept" :loading="loading" leading
                           @ready="onAddReady" />
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
import { importBooks, uploadBook, queryBook } from 'src/service/book';
import { bookService } from 'src/service/remote/book';
import BookGridItem from './BookGridItem.vue';
import BookListItem from './BookListItem.vue';
import BookDetails from './BookDetails.vue';
import BookFilterBtn from './BookFilterBtn.vue';
import OFileUploader from 'core/components/fIle/OFileUploader.vue';
import OFileUploaderBtn from 'core/components/fIle/OFileUploaderBtn.vue';

import useReader from 'src/hooks/useReader';
import useQuery from 'src/hooks/useQuery';

const { queryTimer } = useReader();
const { view, query } = useQuery();

const data = ref({});
const condition = ref<Indexable>({});
const rows = ref([]);
const loading = ref(false);
const bookView = ref('grid');
const bookAccept = ref('.epub,.mobi,.azw3');
const orderBy = ref<Indexable>({
  updateTime: 'desc'
});

function onView(value: string) {
  bookView.value = value;
}

function onSort(value: Indexable) {
  console.log('sort', value);
  orderBy.value = value;
  doQuery();
}

function onDetails(item: any) {
  data.value = item;
  query.value.openSide('480px', 'details');
}

function onClose() {
  query.value.closeSide();
  doQuery();
}

async function onAddReady(file: File, icon: string) {
  console.log('file', file, icon)
  loading.value = true;
  await uploadBook(file);
  loading.value = false;
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
  if (process.env.MODE === 'electron') {
    window.electronAPI.openNewWindow(item.id, `/reader/book?id=${item.id}`);
  } else {
    window.open(`/reader/book?id=${item.id}`, '_blank');
  }
}

function doQuery() {
  const query = {
    pageIndex: 1,
    pageSize: 20,
    condition: {
      'title|like': condition.value.title
    },
    orderBy: orderBy.value
  };

  bookService.queryBook(query).then(res => {
    rows.value = res;
  });
}

function initData() {
  // query.value.side.contentClass = '';
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
