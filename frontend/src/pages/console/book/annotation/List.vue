<template>
  <o-console-page class="book-annotation-list"
                  v-bind="query"
                  disable-meta
                  enable-fullscreen fixed-header>
    <template #header-left>
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
      <q-infinite-scroll ref="scrollRef" @load="query.onLoadMore" :offset="350">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <template v-if="rows.length">
          <section class="row col-12 justify-center pi-view-list">
            <q-list>
              <template v-for="(item) in rows" :key="item.id">
                <annotation-list-item :data="item" @details="onDetails" />
              </template>
            </q-list>
          </section>
        </template>
        <template v-else>
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
  </o-console-page>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue'
import AnnotationFilterBtn from './AnnotationFilterBtn.vue'
import AnnotationListItem from './AnnotationListItem.vue'
import AnnotationDetails from './AnnotationDetails.vue'

import useLoadMore from 'src/hooks/useLoadMore'
import useCommon from 'core/hooks/useCommon'

const { t } = useCommon()
const { condition, sort, rows, view, query, scrollRef, total, initQuery } = useLoadMore()

const isActivated = ref(false)
const data = ref({})
const coverUrl = ref('')

function onSort(value: Indexable) {
  sort.value = value
  query.value.onQuery()
}

function initData() {
  initQuery({
    api: 'bookAnnotation',
    path: '/query/details',
    title: t('details')
  })
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
