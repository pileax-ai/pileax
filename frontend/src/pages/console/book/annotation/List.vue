<template>
  <o-console-page class="book-annotation-list"
                  v-bind="query"
                  disable-meta
                  enable-fullscreen fixed-header>
    <template #header-left>
      <div class="query-item no-drag-region">
        <q-input v-model="condition.note__icontains"
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
          <o-no-data message="没有记录" image v-if="condition.title__icontains" />
          <section class="row col-12 justify-center no-records" v-else>
            <span class="text-readable">还没有书摘记录，快去阅读添加吧</span>
          </section>
        </template>

        <div class="col-12 text-center q-pt-lg text-tips" v-if="!query.paging.more">
          共{{total}}条记录，没有更多数据了
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
import { computed, onActivated, onMounted, ref } from 'vue'
import AnnotationFilterBtn from './AnnotationFilterBtn.vue'
import AnnotationListItem from './AnnotationListItem.vue'
import AnnotationDetails from './AnnotationDetails.vue'

import useLoadMore from 'src/hooks/useLoadMore'

const { condition, rows, view, query, scrollRef, total, initQuery } = useLoadMore()

const isActivated = ref(false)
const data = ref({})
const coverUrl = ref('')
const orderBy = ref<Indexable>({
  updateTime: 'desc'
})

function onSort(value: Indexable) {
  orderBy.value = value
  query.value.onQuery()
}

function initData() {
  initQuery({
    api: 'bookAnnotation',
    path: '/query/details',
    title: 'BookAnnotation'
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
