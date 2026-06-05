<template>
  <o-split-page ref="pageRef"
                :init-size="260"
                :max-size="420"
                v-model:show="showFilter">
    <template #before>
      <annotation-filter ref="filterRef"
                         @filter="onFilter" />
    </template>
    <template #after>
      <o-console-section class="book-annotation-list"
                         v-bind="query"
                         disable-meta
                         enable-fullscreen
                         fixed-header
                         @full-screen="onFullScreen">
        <template #header-left>
          <q-btn icon="tune"
                 class="filter"
                 :class="showFilter ? 'bg-primary text-white' : 'bg-dark'"
                 @click="onToggleFiler"
                 flat />
          <div class="query-item no-drag-region">
            <q-input v-model="condition.note__icontains"
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
          <annotation-filter-btn @sort="onSort" />
        </template>

        <section class="col-12">
          <section class="row col-12 justify-center pi-view-list q-mb-md" v-if="book.bookId">
            <q-list>
              <book-item :data="book" :key="book.bookId" />
            </q-list>
          </section>

          <q-infinite-scroll ref="scrollRef" @load="query.onLoadMore" :offset="350">
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>

            <template v-if="rows.length">
              <section class="row col-12 justify-center pi-view-list"
                       :class="{ 'single-book': !!book.bookId }">
                <q-list>
                  <template v-for="(item) in rows" :key="item.id">
                    <annotation-list-item :data="item"
                                          :annotation-only="!!book.bookId"
                                          @details="onDetails" />
                  </template>
                </q-list>
              </section>
            </template>
            <template v-else-if="loaded">
              <o-no-data image>
                {{ condition.note__icontains
                ? $t('query.noRecords')
                : $t('book.annotations.noRecords')
                }}
              </o-no-data>
            </template>

            <div class="col-12 text-center q-pt-lg text-tips" v-if="!query.paging.more">
              {{ $t('query.noMoreData', {total: total}) }}
            </div>
          </q-infinite-scroll>
        </section>

        <template #side-panel>
          <annotation-details :data="data"
                              :cover-url="coverUrl"
                              @close="onClose"
                              v-if="view==='details'" />
        </template>
      </o-console-section>
    </template>
  </o-split-page>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue'
import OSplitPage from 'core/page/template/OSplitPage.vue'
import OConsoleSection from 'core/page/section/OConsoleSection.vue'
import AnnotationFilter from './AnnotationFilter.vue'
import AnnotationFilterBtn from './AnnotationFilterBtn.vue'
import AnnotationListItem from './AnnotationListItem.vue'
import AnnotationDetails from './AnnotationDetails.vue'
import BookItem from './BookItem.vue'

import useLoadMore from 'src/hooks/useLoadMore'
import useCommon from 'core/hooks/useCommon'

const { t } = useCommon()
const { condition, sort, rows, loaded, view, query, scrollRef, total, initQuery } = useLoadMore()

const pageRef = ref<InstanceType<typeof OSplitPage>>()
const filterRef = ref<InstanceType<typeof AnnotationFilter>>()
const showFilter = ref(true)
const isActivated = ref(false)
const data = ref<Indexable>({})
const book = ref<Indexable>({})
const coverUrl = ref('')

function onFilter(item: Indexable) {
  switch (item.field) {
    default:
      condition.value[item.field] = item.value
      break
  }
  if (item.field === 'bookId') {
    book.value = item.data
  }
  doQuery()
}

function onSort(value: Indexable) {
  sort.value = value
  doQuery()
}

function doQuery() {
  query.value.onQuery()
}

function initData() {
  initQuery({
    api: 'bookAnnotation',
    path: '/query/details',
    title: t('details')
  })
}

function onFullScreen(value: boolean) {
  pageRef.value?.setFullScree(value)
  showFilter.value = false
}

function onToggleFiler() {
  showFilter.value = !showFilter.value
}

function onDetails(item: any, cover: string) {
  data.value = item
  coverUrl.value = cover
  query.value.openSide('480px', 'details')
}

function onClose() {
  query.value.closeSide()
}

onActivated(() => {
  if (isActivated.value) {
    query.value.onQuery()
  }

  isActivated.value = true
})

onMounted(() => {
  initData()
})
</script>

<style lang="scss">
.book-annotation-list {
  .single-book {
    .annotation-list-item {
      background: transparent!important;
    }

    .q-list {
      border-radius: 8px;
      border: solid 1px var(--q-dark);
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
