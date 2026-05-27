<template>
  <o-split-page ref="pageRef" :init-size="200" v-model:show="showFilter">
    <template #before>
      <book-filter @filter="onFilter" />
    </template>
    <template #after>
      <o-console-section class="book-list"
                         title=" "
                         icon="book"
                         v-bind="query"
                         disable-meta
                         enable-fullscreen fixed-header
                         @full-screen="onFullScreen"
                         @sideClose="onSideClose">
        <template #header-left>
          <q-btn icon="tune"
                 class="filter"
                 :class="showFilter ? 'bg-primary text-white' : 'bg-dark'"
                 @click="onToggleFiler()"
                 flat />
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
          <q-btn icon="add" flat round>
            <q-menu v-model="addMenu" class="pi-menu" :offset="[0, 4]">
              <q-list style="min-width: 400px">
                <div>
                  <div class="text-tips text-bold">
                    {{ $t('upload') }}
                  </div>
                  <div class="q-pa-md">
                    <o-book-uploader :accept="bookAccept"
                                     :max-size="500 * 1024 * 1024"
                                     multiple
                                     leading
                                     @completed="onUploadCompleted" />
                  </div>
                </div>
                <q-separator class="bg-dark" />
                <o-common-item icon="o_local_library"
                               :label="$t('book.library.add')"
                               closable clickable
                               @click="onOpenAdd" />
                <o-common-item icon="o_book"
                               :label="$t('book.newEntry')"
                               closable clickable
                               @click="onEntry" />
              </q-list>
            </q-menu>
          </q-btn>
          <book-more-btn :view="library.view"
                         @view="onView"
                         @sort="onSort" />
        </template>

        <section class="col-12">
          <q-infinite-scroll ref="scrollRef" @load="query.onLoadMore" :offset="350">
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>

            <template v-if="rows.length">
              <section class="row col-12 justify-center pi-view-list" v-if="library.view === 'list'">
                <q-list>
                  <template v-for="(item) in rows" :key="`${item.id}-${item.updateTime}`">
                    <book-list-item :data="item"
                                    @click="openBook(item)"
                                    @details="onDetails(item)">
                      <book-context-menu :data="item"
                                         @close="onClose"
                                         @edit="onEdit"
                                         @upload="onUpload"
                                         context-menu />
                    </book-list-item>
                  </template>
                </q-list>
              </section>
              <section class="pi-view-grid"
                       :class="{ 'book': ['grid', 'grid_title'].includes(library.view) }"
                       v-else>
                <template v-for="(item) in rows" :key="`${item.id}-${item.updateTime}`">
                  <div class="">
                    <component :is="bookComponents[library.view] || bookComponents.grid"
                               :data="item"
                               @click="openBook(item)"
                               @details="onDetails(item)">
                      <book-context-menu :data="item"
                                         @close="onClose"
                                         @edit="onEdit"
                                         @upload="onUpload"
                                         context-menu />
                    </component>
                  </div>
                </template>
              </section>
            </template>
            <template v-else>
              <o-no-data :message="$t('query.noRecords')" image
                         v-if="condition.title__icontains" />
              <section class="row col-12 justify-center no-records" v-else>
                <span class="text-readable">{{ $t('book.library.noBooks') }}</span>
                <div class="row col-12 justify-center q-mt-lg action">
                  <o-book-uploader :accept="bookAccept"
                                   :max-size="500 * 1024 * 1024"
                                   multiple
                                   leading
                                   @completed="onUploadCompleted" />
                </div>
              </section>
            </template>

            <div class="col-12 text-center q-pt-lg text-tips" v-if="!query.paging.more">
              {{ $t('query.noMoreData', {total: total}) }}
            </div>
          </q-infinite-scroll>
        </section>

        <template #side-panel>
          <book-details :data="data"
                        source="book-list"
                        @close="onClose"
                        @edit="onEdit"
                        @upload="onUpload"
                        v-if="view==='details'" />
          <book-meta-edit :data="data"
                     @close="onClose"
                     v-if="view==='edit'" />
          <book-upload :data="data"
                     @close="onClose"
                     v-if="view==='upload'" />
          <book-entry :data="data"
                     @close="onClose"
                     v-if="view==='entry'" />
          <book-add @close="onClose"
                    v-if="view==='add'" />
        </template>
      </o-console-section>
    </template>
  </o-split-page>
</template>

<script setup lang="ts">
import { onActivated, onMounted, onUnmounted, ref, watch } from 'vue'
import BookContextMenu from './BookContextMenu.vue'
import BookGridItem from './BookGridItem.vue'
import BookGridTitleItem from './BookGridTitleItem.vue'
import BookCompactItem from './BookCompactItem.vue'
import BookListItem from './BookListItem.vue'
import BookDetails from './BookDetails.vue'
import BookUpload from './BookUpload.vue'
import BookEntry from './BookEntry.vue'
import BookAdd from './BookAdd.vue'
import BookFilter from './BookFilter.vue'
import BookMoreBtn from './BookMoreBtn.vue'
import OBookUploader from 'core/components/fIle/OBookUploader.vue'
import OSplitPage from 'core/page/template/OSplitPage.vue'
import BookMetaEdit from 'components/book/book-meta/edit.vue'

import useReading from 'src/hooks/useReading'
import useLoadMore from 'src/hooks/useLoadMore'
import OConsoleSection from 'core/page/section/OConsoleSection.vue'
import useCommon from 'core/hooks/useCommon'
import { globalBus } from 'src/api/event/event-bus'

const { t } = useCommon()
const { library, setLibraryItem, openBook } = useReading()
const { condition, sort, rows, view, query, scrollRef, total, initQuery } = useLoadMore()

const pageRef = ref<InstanceType<typeof OSplitPage>>()
const addMenu = ref(false)
const data = ref<Indexable>({})
const showFilter = ref(true)
const bookAccept = ref('.epub,.mobi,.azw3,.fb2,.cbz,.pdf')
const needRefresh = ref(false)

const bookComponents = {
  grid: BookGridItem,
  grid_title: BookGridTitleItem,
  compact: BookCompactItem,
} as Indexable

function onView(value: string) {
  setLibraryItem('view', value)
}

function onSort(value: Indexable) {
  sort.value = value
  query.value.onQuery()
}

function onFilter(value: Indexable) {
  switch (value.filter) {
    case 'extension':
      condition.value['extension__in'] = value.filterValue
      delete condition.value['is_physical']
      break
    case 'physical':
      condition.value['is_physical'] = value.filterValue
      delete condition.value['extension__in']
      break
    default:
      condition.value[value.filter] = value.filterValue
      break
  }
  query.value.onQuery()
}

function onDetails(item: any) {
  data.value = item
  query.value.openSide('480px', 'details', 'book', t('book._'))
}

function onEdit(item: Indexable) {
  data.value = item
  query.value.openSide('720px', 'edit', 'edit_note', t('book.metadata.edit'))

  // showDialog({
  //   type: 'book-meta',
  //   id: item.bookId,
  //   onOk: onClose
  // })
}

function onUpload(item: Indexable) {
  data.value = item
  query.value.openSide('480px', 'upload', 'mdi-arrow-collapse-up', t('upload'))
}

function onEntry() {
  query.value.openSide('480px', 'entry', 'add', t('book.entry'))
}

function onClose(options: Indexable) {
  if (options && options.action && options.item) {
    const bookId = options.item.bookId
    const index = rows.value.findIndex(e => e.bookId === bookId)
    // console.log('onClose', options, index)
    if (index >= 0) {
      switch (options.action) {
        case 'edit':
          rows.value.splice(index, 1, options.item)
          break
        case 'remove':
          rows.value.splice(index, 1)
          break
      }
    } else {
      rows.value.unshift(options.item)
    }
  } else {
    query.value.onQuery()
  }
  query.value.closeSide(false, false)
}

function onSideClose() {
  if (['add', 'edit'].includes(view.value) && needRefresh.value) {
    query.value.onQuery()
    needRefresh.value = false
  }
}

function onOpenAdd() {
  query.value.openSide('80vw', 'add', 'add', t('book.add'))
}

async function onUploadCompleted() {
  addMenu.value = false
  query.value.onQuery()
}

function initData() {
  initQuery({
    api: 'workspaceBook',
    path: '/query/details',
    title: t('book._'),
    sortBy: { 'userbook.update_time': 'desc' }
  })
}

function onFullScreen(value: boolean) {
  pageRef.value?.setFullScree(value)
  showFilter.value = false
}

function onToggleFiler() {
  showFilter.value = !showFilter.value
}

function onLibraryRefresh(item: Indexable) {
  needRefresh.value = true
}

onActivated(() => {
  initData()
})

onMounted(() => {
  globalBus.on('library-need-refresh', onLibraryRefresh)
})

onUnmounted(() => {
  globalBus.off('library-need-refresh', onLibraryRefresh)
})
</script>

<style lang="scss">
.book-list {
  .no-records {
    padding: 60px 0;
  }
}
</style>
