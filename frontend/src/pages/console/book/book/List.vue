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
                                     leading
                                     @completed="onUploadCompleted" />
                  </div>
                </div>
                <q-separator class="bg-dark" />
                <o-common-item icon="o_local_library"
                               :label="$t('book.library.add')"
                               class="bg-accent"
                               closable clickable
                               @click="onOpenAdd" />
              </q-list>
            </q-menu>
          </q-btn>
          <book-more-btn @view="onView" @sort="onSort" />
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
                      <book-context-menu :data="item"
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
                      <book-context-menu :data="item"
                                         @close="onClose"
                                         @edit="onEdit"
                                         context-menu />
                    </book-list-item>
                  </template>
                </q-list>
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
                        @close="onClose"
                        @edit="onEdit"
                        v-if="view==='details'" />
          <book-edit :data="data"
                     @close="onClose"
                     v-if="view==='edit'" />
          <book-add @close="onClose"
                    v-if="view==='add'" />
        </template>
      </o-console-section>
    </template>
  </o-split-page>
</template>

<script setup lang="ts">
import { onActivated, ref, watch } from 'vue'
import BookContextMenu from './BookContextMenu.vue'
import BookGridItem from './BookGridItem.vue'
import BookListItem from './BookListItem.vue'
import BookDetails from './BookDetails.vue'
import BookEdit from './BookEdit.vue'
import BookAdd from './BookAdd.vue'
import BookFilter from './BookFilter.vue'
import BookMoreBtn from './BookMoreBtn.vue'
import OBookUploader from 'core/components/fIle/OBookUploader.vue'
import OSplitPage from 'core/page/template/OSplitPage.vue'

import useReader from 'src/hooks/useReader'
import useReading from 'src/hooks/useReading'
import useLoadMore from 'src/hooks/useLoadMore'
import OConsoleSection from 'core/page/section/OConsoleSection.vue'
import useCommon from 'core/hooks/useCommon'

const { t } = useCommon()
const { queryTimer } = useReader()
const { openBook } = useReading()
const { condition, loading, sort, rows, view, query, scrollRef, total, initQuery } = useLoadMore()

const pageRef = ref<InstanceType<typeof OSplitPage>>()
const addMenu = ref(false)
const data = ref<Indexable>({})
const showFilter = ref(true)
const bookView = ref('grid')
const bookAccept = ref('.epub,.mobi,.azw3,.fb2,.cbz,.pdf')

function onView(value: string) {
  bookView.value = value
}

function onSort(value: Indexable) {
  sort.value = value
  query.value.onQuery()
}

function onFilter(value: Indexable) {
  switch (value.filter) {
    case 'extension':
      condition.value[`${value.filter}__in`] = value.filterValue
      break
    default:
      condition.value[value.filter] = value.filterValue
      break
  }
  query.value.onQuery()
}

function onDetails(item: any) {
  data.value = item
  query.value.openSide('480px', 'details')
}

function onEdit(item: Indexable) {
  data.value = item
  query.value.openSide('480px', 'edit', 'edit_note', t('edit'))
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
          break
        case 'remove':
          rows.value.splice(index, 1)
          break
      }
    }
  } else {
    query.value.onQuery()
  }
  query.value.closeSide(false, false)
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

watch(() => queryTimer.value, (newValue) => {
  query.value.onQuery()
})

onActivated(() => {
  initData()
})
</script>

<style lang="scss">
.book-list {
  .no-records {
    padding: 60px 0;
  }
}
</style>
