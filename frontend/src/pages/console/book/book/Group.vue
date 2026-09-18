<template>
  <o-split-page ref="pageRef" :init-size="200" v-model:show="showFilter">
    <template #before>
      <book-filter @filter="onFilter" />
    </template>
    <template #after>
      <o-console-section class="book-group"
                         title=" "
                         icon="book"
                         v-bind="query"
                         disable-meta
                         enable-fullscreen fixed-header
                         @full-screen="onFullScreen"
                         @sideClose="onDialogClose">
        <template #header-left>
          <q-btn :label="$t('all')"
                 color="primary"
                 class="all"
                 @click="router.push('/book/library')"
                 flat />
          <q-icon name="arrow_forward_ios" size="0.8rem" class="text-tips q-mx-sm" />
          <span class="collection-title">{{ group.title }}</span>
        </template>

        <!--Actions-->
        <template #actions>
          <q-btn icon="tune"
                 class="filter"
                 :class="showFilter ? 'bg-primary text-white' : 'bg-dark'"
                 @click="onToggleFiler()"
                 flat v-if="false" />
          <div class="query-item q-mx-sm no-drag-region">
            <q-input v-model="title"
                     class="pi-field w-wide"
                     :placeholder="$t('book.search')"
                     debounce="800"
                     standout dense clearable
                     @update:model-value="onFilter(true)">
              <template #prepend>
                <q-icon name="search" class="text-readable" />
              </template>
            </q-input>
          </div>
          <q-btn icon="add" flat round :loading="bookUploading">
            <o-tooltip position="left" transition>
              {{ $t('upload') }}
            </o-tooltip>
            <q-menu v-model="addMenu" class="pi-menu" :offset="[0, 4]">
              <q-list style="min-width: 400px">
                <div>
                  <div class="text-tips text-bold">
                    {{ $t('upload') }}
                  </div>
                  <div class="q-pa-md">
                    <o-book-uploader :accept="bookAccept"
                                     :max-size="500 * 1024 * 1024"
                                     :book-group-id="groupId"
                                     multiple
                                     leading
                                     @uploading="onUploading"
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
          <book-more-btn @sort="onSort" />
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
                                         @dialog-close="onDialogClose"
                                         @edit="onEdit"
                                         @upload="onUpload"
                                         context-menu group />
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
                                         @dialog-close="onDialogClose"
                                         @edit="onEdit"
                                         @upload="onUpload"
                                         context-menu group />
                    </component>
                  </div>
                </template>
              </section>
            </template>
            <template v-else-if="loaded">
              <o-no-data :message="$t('query.noRecords')" image
                         v-if="condition.title__icontains" />
              <section class="row col-12 justify-center no-records" v-else>
                <span class="text-readable">{{ $t('book.library.noBooks') }}</span>
                <div class="row col-12 justify-center q-mt-lg action">
                  <o-book-uploader :accept="bookAccept"
                                   :max-size="500 * 1024 * 1024"
                                   :book-group-id="groupId"
                                   multiple
                                   leading
                                   @uploading="onUploading"
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
                        group
                        v-if="view==='details'" />
          <book-meta-edit :data="data"
                          @close="onClose"
                          v-if="view==='edit'" />
          <book-upload :data="data"
                       @close="onClose"
                       v-if="view==='upload'" />
          <book-entry :group-id="groupId"
                      @close="onClose"
                      v-if="view==='entry'" />
          <book-add :group-id="groupId"
                    @close="onClose"
                    v-if="view==='add'" />
        </template>
      </o-console-section>
    </template>
  </o-split-page>
</template>

<script setup lang="ts">
import { computed, onActivated, onDeactivated, ref } from 'vue'
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
import { bookCollectionService } from 'src/api/service/remote'
import { router } from 'src/router'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useCommon()
const { library, bookUploading, setLibraryItem, getLibrarySort, getLibraryFilter, setBookUploading, openBook } = useReading()
const { initial, condition, sort, rows, loaded, view, query, scrollRef, total, initQuery } = useLoadMore()

const pageRef = ref<InstanceType<typeof OSplitPage>>()
const addMenu = ref(false)
const groupId = ref('')
const group = ref<Indexable>({})
const data = ref<Indexable>({})
const showFilter = ref(true)
const bookAccept = ref('.epub,.mobi,.azw3,.fb2,.cbz,.pdf')
const needRefresh = ref(false)

const bookComponents = {
  grid: BookGridItem,
  grid_title: BookGridTitleItem,
  compact: BookCompactItem,
} as Indexable

const title = computed({
  get() {
    return library.value.title
  },
  set(value: string) {
    setLibraryItem('title', value)
  }
})

function onSort() {
  sort.value = getLibrarySort()
  query.value.onQuery()
}

function onFilter(runQuery = true) {
  const filter = getLibraryFilter()
  condition.value = {
    ...condition.value,
    ...filter
  }
  if (library.value.extension === 'physical') {
    delete condition.value['extension__in']
    condition.value['is_physical'] = 1
  } else {
    delete condition.value['is_physical']
  }

  if (runQuery) {
    onQuery()
  }
}

function onDetails(item: any) {
  data.value = item
  query.value.openSide('480px', 'details', 'book', t('book._'))
}

function onEdit(item: Indexable) {
  data.value = item
  query.value.openSide('720px', 'edit', 'edit_note', t('book.metadata.edit'))
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

function onDialogClose(type = 'side') {
  if (needRefresh.value) {
    switch (type) {
      case 'book-group':
        onQuery()
        break
      default:
        if (['add', 'edit'].includes(view.value)) {
          query.value.onQuery()
        }
        break
    }
    needRefresh.value = false
  }
}

function onOpenAdd() {
  query.value.openSide('80vw', 'add', 'add', t('book.add'))
}

function onUploading(progress: Indexable) {
  setBookUploading(true)
}

async function onUploadCompleted() {
  setBookUploading(false)
  addMenu.value = false
  query.value.onQuery()
}

function onQuery(scrollReset = true) {
  query.value.onQuery(scrollReset)
}

function getGroup() {
  bookCollectionService.get(groupId.value).then(res => {
    group.value = res
  })
}

function initData() {
  groupId.value = (route.params.id || '') as string
  condition.value['bookGroupId'] = groupId.value

  onFilter(false)
  getGroup()

  if (initial.value) {
    onQuery()
  } else {
    initQuery({
      api: 'workspaceBook',
      path: '/query/details',
      title: t('book._'),
      sortBy: getLibrarySort()
    })
  }

}

function onFullScreen(value: boolean) {
  pageRef.value?.setFullScree(value)
  showFilter.value = false
}

function onToggleFiler() {
  showFilter.value = !showFilter.value
}

function onLibraryRefresh(item: Indexable, immediate = false) {
  if (immediate) {
    query.value.onQuery()
  } else {
    needRefresh.value = true
  }
}

onActivated(() => {
  initData()
  globalBus.on('library-need-refresh', onLibraryRefresh)
})

onDeactivated(() => {
  globalBus.off('library-need-refresh', onLibraryRefresh)
})
</script>

<style lang="scss">
.book-group {
  .no-records {
    padding: 60px 0;
  }

  .meta {
    .q-btn.all {
      width: unset !important;
      margin: 0 0 0 -6px !important;
      padding: 4px 6px;
      font-size: 1.1rem;
    }

    .collection-title {
      margin-left: 4px;
      font-size: 1.1rem;
    }
  }
}
</style>
