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
                     :placeholder="$t('search')"
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
            <o-tooltip position="bottom">{{ $t('book.collections.add') }}</o-tooltip>
          </q-btn>
          <book-collection-more-btn @view="onView" @sort="onSort" />
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
                                    @details="onDetails(item)">
                      <book-collection-context-menu :data="item"
                                                    @close="onClose"
                                                    @edit="onEdit"
                                                    context-menu />
                    </book-grid-item>
                  </div>
                </template>
              </section>
              <section class="row col-12 justify-center pi-view-list" v-else>
                <q-list>
                  <template v-for="(item) in rows" :key="item.id">
                    <book-list-item :data="item"
                                    @click="openBook(item)"
                                    @details="onDetails(item)">
                      <book-collection-context-menu :data="item"
                                                    @close="onClose"
                                                    @edit="onEdit"
                                                    context-menu />
                    </book-list-item>
                  </template>
                </q-list>
              </section>
            </template>
            <template v-else>
              <o-no-data :message="$t('query.noRecords')" image />
            </template>

            <div class="col-12 text-center q-pt-lg text-tips" v-if="!query.paging.more">
              {{ $t('query.noMoreData', {total: total}) }}
            </div>
          </q-infinite-scroll>
        </section>

        <template #side-panel>
          <book-details :data="data"
                        @close="onClose"
                        @edit="onEditBook"
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
import { onActivated, ref, watch } from 'vue'
import OConsoleSection from 'core/page/section/OConsoleSection.vue'
import BookGridItem from '../book/BookGridItem.vue'
import BookListItem from '../book/BookListItem.vue'
import BookDetails from './BookDetails.vue'
import BookCollectionContextMenu from './BookCollectionContextMenu.vue'
import BookCollectionEdit from './BookCollectionEdit.vue'
import BookCollectionFilter from './BookCollectionFilter.vue'
import BookCollectionMoreBtn from './BookCollectionMoreBtn.vue'
import OSplitPage from 'core/page/template/OSplitPage.vue'

import useReader from 'src/hooks/useReader'
import useLoadMore from 'src/hooks/useLoadMore'
import useCommon from 'core/hooks/useCommon'
import useReading from 'src/hooks/useReading'

const { t } = useCommon()
const { queryTimer } = useReader()
const { openBook } = useReading()
const { condition, sort, rows, view, query, scrollRef, total, initQuery } = useLoadMore()

const pageRef = ref<InstanceType<typeof OSplitPage>>()
const filterRef = ref<InstanceType<typeof BookCollectionFilter>>()
const collectionId = ref('')
const editCollectionId = ref('')
const addMenu = ref(false)
const data = ref<Indexable>({})
const showFilter = ref(true)
const bookView = ref('grid')

function onAction(item: Indexable) {
  switch (item.action) {
    case 'filter':
      collectionId.value = item.value
      doQuery()
      break
    case 'add':
      onEdit()
      break
    case 'edit':
      onEdit(item.value, 'edit', item.label)
      break
  }
}

function onView(value: string) {
  bookView.value = value
}

function onSort(value: Indexable) {
  sort.value = value
  doQuery()
}

function onDetails(item: any) {
  data.value = item
  query.value.openSide('480px', 'details')
}

function onEdit(id = '', icon = 'add', title = t('book.collections.add')) {
  editCollectionId.value = id
  query.value.openSide('480px', 'edit', icon, title)
}

function onEditBook(item: Indexable) {
  data.value = item
  query.value.openSide('480px', 'edit-book', 'edit_note', t('edit'))
}

function onClose(options: Indexable) {
  console.log('close', options)
  if (options.action === 'book-collection-edit') {
    filterRef.value?.refresh()
  } else if (options && options.action && options.item) {
    const bookId = options.item.bookId
    const index = rows.value.findIndex(e => e.bookId === bookId)
    // console.log('onClose', index, options)
    if (index !== -1) {
      switch (options.action) {
        case 'edit':
          rows.value.splice(index, 1, options.item)
          break
        case 'remove':
          rows.value.splice(index, 1)
          break
      }
    }
  } else {
    doQuery()
  }
  query.value.closeSide(false, false)
}

async function onUploadCompleted() {
  addMenu.value = false
  doQuery()
}

function doQuery() {
  condition.value['bookCollectionId'] = collectionId.value
  query.value.onQuery()
}

function initData() {
  initQuery({
    api: 'workspaceBookCollection',
    path: '/query/book/details',
    title: t('book._'),
    sortBy: { 'workspacebookcollection.update_time': 'desc' }
  })
}

function onFullScreen(value: boolean) {
  pageRef.value?.setFullScree(value)
  showFilter.value = false
}

function onToggleFiler() {
  showFilter.value = !showFilter.value
}

watch(() => queryTimer.value, (newValue) => {
  doQuery()
})

onActivated(() => {
  filterRef.value?.refresh().then(res => {
    const collectionList = res as Indexable[]
    if (collectionList.length) {
      collectionId.value = collectionList[0]!.id
      condition.value['bookCollectionId'] = collectionId.value
    }
    initData()
  })
})
</script>

<style lang="scss">
.book-collection-list {
  .no-records {
    padding: 60px 0;
  }
}
</style>
