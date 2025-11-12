<template>
  <o-split-page ref="pageRef"
                :init-size="260"
                :max-size="420"
                v-model:show="showFilter">
    <template #before>
      <book-collection-filter ref="filterRef"
                              v-model="collectionId"
                              @action="onAction" />
    </template>
    <template #after>
      <o-console-section class="book-collection-list"
                         title=" "
                         icon="book"
                         v-bind="query"
                         disable-meta
                         enable-fullscreen
                         fixed-header
                         @full-screen="onFullScreen">
        <template #header-left>
          <q-btn icon="tune"
                 class="filter"
                 :class="showFilter ? 'bg-primary text-white' : 'bg-dark'"
                 @click="onToggleFiler()"
                 flat v-if="true" />
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
          <q-btn icon="add" flat round @click="onEdit('')">
            <o-tooltip position="bottom">Add Collection</o-tooltip>
          </q-btn>
          <book-filter-btn @view="onView" @sort="onSort">
            <q-separator class="bg-accent" />
            <o-view-item label="Total" :value="total" align="right" />
          </book-filter-btn>
        </template>

        <section class="col-12">
          <q-infinite-scroll ref="scrollRef" @load="query.onLoadMore" :offset="350">
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>

            <template v-if="rows.length">
              <section class="pi-view-grid" v-if="bookView === 'grid'">
                <template v-for="(item) in rows" :key="item.id">
                  <div class="">
                    <book-grid-item :data="item"
                                    @click="openBook(item)"
                                    @details="onDetails(item)" />
                  </div>
                </template>
              </section>
              <section class="row col-12 justify-center pi-view-list" v-else>
                <q-list>
                  <template v-for="(item) in rows" :key="item.id">
                    <book-list-item :data="item"
                                    @click="openBook(item)"
                                    @details="onDetails(item)" />
                  </template>
                </q-list>
              </section>
            </template>
            <template v-else>
              <o-no-data message="没有记录" image v-if="condition.title__icontains" />
              <section class="row col-12 justify-center no-records" v-else>
                <span class="text-readable">书库中还没有记录，快来添加吧</span>
                <div class="row col-12 justify-center q-mt-lg action">
                  <o-book-uploader :accept="bookAccept"
                                   :max-size="500 * 1024 * 1024"
                                   leading
                                   @completed="onUploadCompleted" />
                </div>
              </section>
            </template>

            <div class="col-12 text-center q-pt-lg text-tips" v-if="!query.paging.more">
              共{{total}}条记录，没有更多数据了
            </div>
          </q-infinite-scroll>
        </section>

        <template #side-panel>
          <book-details :data="data"
                        @close="onClose"
                        @edit="onEdit"
                        v-if="view==='details'" />
          <book-collection-edit :id="editCollectionId"
                     @close="onClose"
                     v-if="view==='edit'" />
        </template>
      </o-console-section>
    </template>
  </o-split-page>
</template>

<script setup lang="ts">
import { onActivated, ref, watch } from 'vue';
import BookGridItem from './BookGridItem.vue';
import BookListItem from './BookListItem.vue';
import BookDetails from './BookDetails.vue';
import BookCollectionEdit from './BookCollectionEdit.vue';
import BookAdd from './BookAdd.vue';
import BookCollectionFilter from './BookCollectionFilter.vue';
import BookFilterBtn from './BookFilterBtn.vue';
import OBookUploader from 'core/components/fIle/OBookUploader.vue';
import OSplitPage from 'core/page/template/OSplitPage.vue';

import useReader from 'src/hooks/useReader';
import useLoadMore from 'src/hooks/useLoadMore';
import { ipcService } from 'src/api/ipc';
import { READER_TITLE_BAR_HEIGHT } from 'core/constants/style';
import OConsoleSection from 'core/page/section/OConsoleSection.vue'

const { queryTimer } = useReader();
const { condition, loading, sort, rows, view, query, scrollRef, total, initQuery } = useLoadMore();

const pageRef = ref<InstanceType<typeof OSplitPage>>();
const filterRef = ref<InstanceType<typeof BookCollectionFilter>>();
const collectionId = ref('');
const editCollectionId = ref('');
const addMenu = ref(false);
const data = ref<Indexable>({});
const showFilter = ref(true);
const bookView = ref('grid');
const bookAccept = ref('.epub,.mobi,.azw3,.fb2,.cbz,.pdf');

function onAction(item: Indexable) {
  switch (item.action) {
    case 'filter':
      collectionId.value = item.value
      break;
    case 'add':
      onEdit()
      break;
    case 'edit':
      onEdit(item.value, 'edit', item.label)
      break;
  }
}

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

function onEdit(id = '', icon = 'add', title = 'Add Collection') {
  editCollectionId.value = id
  query.value.openSide('480px', 'edit', icon, title);
}

function onClose(options: Indexable) {
  console.log('close', options)
  if (options.action === 'book-collection-edit') {
    filterRef.value?.refresh()
  } else if (options && options.action && options.item) {
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
  query.value.openSide('80vw', 'add', 'add', 'Add book');
}

async function onUploadCompleted() {
  addMenu.value = false;
  query.value.onQuery();
}

function openBook(item: any) {
  ipcService.openNewWindow(item.id, `/reader/book?id=${item.id}`,
    READER_TITLE_BAR_HEIGHT);
}

function initData() {
  initQuery({
    api: 'tenantBook',
    path: '/query/details',
    title: 'Book'
  });
}

function onFullScreen(value: boolean) {
  pageRef.value?.setFullScree(value)
  showFilter.value = false
}

function onToggleFiler() {
  showFilter.value = !showFilter.value
}

watch(() => queryTimer.value, (newValue) => {
  query.value.onQuery();
})

onActivated(() => {
  initData();
})
</script>

<style lang="scss">
.book-collection-list {
  .no-records {
    padding: 60px 0;
  }
}
</style>
