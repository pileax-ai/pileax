<template>
  <o-console-page class="book-add"
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
      <book-filter-btn @view="onView" @sort="onSort" />
    </template>

    <section class="row full-width">
      <nav class="col-auto" v-show="filter">
        Book Filters
      </nav>
      <section class="col">
        <template v-if="rows.length">
          <section class="row col-12 q-col-gutter-lg grid-view" v-if="bookView === 'grid'">
            <template v-for="(item, index) in rows" :key="index">
              <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                <book-grid-item :data="item"
                                @click.stop
                                @add="addBook(item)"
                                @details="onDetails(item)" add />
              </div>
            </template>
          </section>
          <section class="row col-12 justify-center list-view" v-else>
            <q-list>
              <template v-for="(item, index) in rows" :key="index">
                <book-list-item :data="item"
                                @click.stop
                                @add="addBook(item)"
                                @details="onDetails(item)" add />
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
      </section>
    </section>

    <template #side-panel>
      <book-details :data="data"
                    @add="addBook(data)"
                    @close="onClose"
                    v-if="view==='details'" add />
    </template>
  </o-console-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { importBooks, uploadBook } from 'src/service/book';
import { bookService } from 'src/service/remote/book';
import { userBookService } from 'src/service/remote/user-book';
import BookGridItem from './BookGridItem.vue';
import BookListItem from './BookListItem.vue';
import BookDetails from './BookDetails.vue';
import BookFilterBtn from './BookFilterBtn.vue';
import OFileUploader from 'core/components/fIle/OFileUploader.vue';

import useReader from 'src/hooks/useReader';
import useQuery from 'src/hooks/useQuery';
import { notifyWarning } from 'core/utils/control'

const emit = defineEmits(['close']);

const { queryTimer } = useReader();
const { view, query } = useQuery();

const data = ref({});
const condition = ref<Indexable>({});
const rows = ref([]);
const loading = ref(false);
const filter = ref(false);
const bookView = ref('grid');
const bookAccept = ref('.epub,.mobi,.azw3,.fb2,.cbz,.pdf');
const orderBy = ref<Indexable>({
  updateTime: 'desc'
});

function onView(value: string) {
  bookView.value = value;
}

function onSort(value: Indexable) {
  orderBy.value = value;
  doQuery();
}

function onDetails(item: any) {
  data.value = item;
  query.value.openSide('480px', 'details');
}

function onClose() {
  query.value.closeSide(false, false);
  doQuery();
}

async function onAddReady(file: File, icon: string) {
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

function addBook(book: any) {
  userBookService.save({
    bookId: book.id
  }).then(res => {
    emit('close');
  }).catch(res => {
    console.log('res', res)
    const data = res.response.data
    if (data.message.indexOf('UNIQUE') === 0) {
      notifyWarning('已经添加本书')
    } else {
      notifyWarning(data.message)
    }
  })
}

function doQuery() {
  const query = {
    pageIndex: 1,
    pageSize: 20,
    condition: {
      'title|like': condition.value.title
    },
    sort: orderBy.value
  };

  bookService.query(query).then(res => {
    console.log('res', res)
    rows.value = res.list;
  });
}

function initData() {
  doQuery();
}

watch(() => queryTimer.value, (newValue) => {
  doQuery();
})

onMounted(() => {
  initData();
})
</script>

<style lang="scss">
.book-add {
  .o-console-section {
    padding-top: 64px;

    .fixed-header {
      padding: 21px 21px 21px 21px;
      border: none;
      .console-toolbar {
        padding: 0;
      }
    }
  }


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
