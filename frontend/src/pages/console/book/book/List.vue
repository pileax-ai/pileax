<template>
  <o-console-page class="book-list"
                  title=" "
                  icon="book"
                  v-bind="query"
                  disable-meta
                  enable-fullscreen fixed-header>
    <template #header-left>
      <q-btn icon="tune"
             class="filter"
             :class="filter ? 'bg-primary text-white' : 'bg-dark'"
             @click="filter = !filter"
             flat v-if="false" />
      <div class="query-item no-drag-region">
        <q-input v-model="condition.title__icontains"
                 class="pi-field"
                 placeholder="搜索"
                 debounce="800"
                 standout dense clearable
                 @update:model-value="query.onQuery(true)">
          <template #prepend>
            <q-icon name="search" class="text-readable" />
          </template>
        </q-input>
      </div>
    </template>

    <!--Actions-->
    <template #actions>
      <q-btn icon="add" flat round>
        <q-menu v-model="addMenu" class="pi-menu" :offset="[0, 4]">
          <q-list style="min-width: 400px">
            <div>
              <div class="text-tips">上传添加</div>
              <div class="q-pa-md">
                <o-book-uploader :accept="bookAccept"
                                 :max-size="500 * 1024 * 1024"
                                 :progress="uploadProgress"
                                 leading
                                 @ready="onAddReady" />
              </div>
            </div>
            <q-separator class="bg-dark" />
            <o-common-item icon="search" label="从书库中添加" class="bg-accent" closable clickable @click="onOpenAdd" />
          </q-list>
        </q-menu>
      </q-btn>
      <book-filter-btn @view="onView" @sort="onSort">
        <q-separator class="bg-accent" />
        <o-view-item label="Total" :value="total" align="right" />
      </book-filter-btn>
    </template>

    <section class="row full-width">
      <nav class="col-auto" v-show="filter">
        Book Filters
      </nav>
      <section class="col">
        <q-infinite-scroll ref="scrollRef" @load="query.onLoadMore" :offset="350">
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
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
            <o-no-data message="没有记录" image v-if="condition.title__like" />
            <section class="row col-12 justify-center no-records" v-else>
              <span class="text-readable">书库中还没有记录，快来添加吧</span>

              <div class="row col-12 justify-center action">
                <q-btn icon="add" label="添加图书"
                       class="bg-primary text-white"
                       flat @click="onAdd" v-if="false" />
                <o-book-uploader :accept="bookAccept"
                                 :progress="uploadProgress"
                                 :max-size="500 * 1024 * 1024"
                                 leading
                                 @ready="onAddReady" />
              </div>
            </section>
          </template>

          <div class="col-12 text-center q-pt-lg text-tips" v-if="!query.paging.more">
            共{{total}}条记录，没有更多数据了
          </div>
        </q-infinite-scroll>
      </section>
    </section>

    <template #side-panel>
      <book-details :data="data"
                    @close="onClose"
                    @edit="onEdit"
                    v-if="view==='details'" />
      <book-edit :data="data"
                    @close="onClose"
                    v-if="view==='edit'" />
      <book-add @close="onClose"
                v-if="view==='add'" />
    </template>
  </o-console-page>
</template>

<script setup lang="ts">
import { onActivated, ref, watch } from 'vue';
import { importBooks, uploadBook } from 'src/service/book';
import { userBookService } from 'src/service/remote/user-book';
import BookGridItem from './BookGridItem.vue';
import BookListItem from './BookListItem.vue';
import BookDetails from './BookDetails.vue';
import BookEdit from './BookEdit.vue';
import BookAdd from './BookAdd.vue';
import BookFilterBtn from './BookFilterBtn.vue';
import OBookUploader from 'core/components/fIle/OBookUploader.vue';

import useReader from 'src/hooks/useReader';
import useLoadMore from 'src/hooks/useLoadMore';
import { ipcService } from 'src/api/ipc';
import { READER_TITLE_BAR_HEIGHT } from 'core/constants/style';
import { sleep } from 'core/utils/misc'

const { queryTimer } = useReader();
const { condition, loading, sort, rows, view, query, scrollRef, total, initQuery } = useLoadMore();

const addMenu = ref(false);
const data = ref<Indexable>({});
const uploadProgress = ref(0);
const filter = ref(false);
const bookView = ref('grid');
const bookAccept = ref('.epub,.mobi,.azw3,.fb2,.cbz,.pdf');

function onView(value: string) {
  bookView.value = value;
}

function onSort(value: Indexable) {
  sort.value = value;
  query.value.onQuery();
}

function onDetails(item: any) {
  data.value = item;
  query.value.openSide('480px', 'details');
}

function onEdit() {
  query.value.openSide('480px', 'edit', 'edit_note', 'Edit');
}

function onClose(options: Indexable) {
  if (options && options.action && options.item) {
    const bookId = options.item.bookId
    const index = rows.value.findIndex(e => e.bookId === bookId)
    console.log('onClose', index, options)
    if (index !== -1) {
      switch (options.action) {
        case 'edit':
          rows.value.splice(index, 1, options.item)
          break;
        case 'remove':
          rows.value.splice(index, 1)
          break;
      }
    }
  } else {
    query.value.onQuery();
  }
  query.value.closeSide(false, false);
}

function onOpenAdd() {
  query.value.openSide('70vw', 'add', 'add', 'Add book');
}

async function onAddReady(files: File[]) {
  const total = files.length
  for (let i = 0; i < total; i++) {
    uploadProgress.value = (i + 1) / total * 100;
    const file = files.at(i);
    await uploadBook(file!);
    await sleep(500);
  }

  addMenu.value = false;
  uploadProgress.value = 0;
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
  ipcService.openNewWindow(item.id, `/reader/book?id=${item.id}`,
    READER_TITLE_BAR_HEIGHT);
}

function initData() {
  initQuery({
    api: 'userBook',
    path: '/query/details',
    title: 'Book'
  });
}

watch(() => queryTimer.value, (newValue) => {
  query.value.onQuery();
})

onActivated(() => {
  initData();
})
</script>

<style lang="scss">
.book-list {
  .filter {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
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
