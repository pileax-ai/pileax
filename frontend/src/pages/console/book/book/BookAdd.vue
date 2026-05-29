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
      <div class="query-item q-px-md">
        <q-chip square>
          <q-avatar color="primary" text-color="white">{{ $t('book.library._') }}</q-avatar>
          {{ $t('book.library.containBooks') }}
        </q-chip>
      </div>
    </template>

    <!--Actions-->
    <template #actions>
      <book-more-btn view="compact"
                     order-by="recentAdd"
                     source="book-add"
                     @view="onView"
                     @sort="onSort" />
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
            <section class="pi-view-grid" v-if="bookView === 'grid'">
              <template v-for="(item, index) in rows" :key="item.id">
                <div class="">
                  <book-grid-item :data="item"
                                  add
                                  @click="addBook(item, index)"
                                  @add="addBook(item, index)"
                                  @details="onDetails(item)">
                  </book-grid-item>
                </div>
              </template>
            </section>
            <section class="pi-view-grid" v-else-if="bookView === 'compact'">
              <template v-for="(item, index) in rows" :key="item.id">
                <div class="">
                  <book-compact-item :data="item"
                                     add
                                     @click="addBook(item, index)"
                                     @add="addBook(item, index)"
                                     @details="onDetails(item)">
                  </book-compact-item>
                </div>
              </template>
            </section>
            <section class="row col-12 justify-center pi-view-list" v-else>
              <q-list>
                <template v-for="(item, index) in rows" :key="item.id">
                  <book-list-item :data="item"
                                  add
                                  @click="addBook(item, index)"
                                  @add="addBook(item, index)"
                                  @details="onDetails(item)">
                  </book-list-item>
                </template>
              </q-list>
            </section>
          </template>

          <div class="col-12 text-center q-pt-lg text-tips" v-if="!query.paging.more">
            {{ $t('query.noMoreData', {total: total}) }}
          </div>
        </q-infinite-scroll>
      </section>
    </section>

    <template #side-panel>
      <book-details :data="data"
                    source="book-add"
                    @add="addBook(data)"
                    @close="onClose"
                    v-if="view==='details'" add />
    </template>
  </o-console-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { workspaceBookService } from 'src/api/service/remote'
import BookGridItem from './BookGridItem.vue'
import BookCompactItem from './BookCompactItem.vue'
import BookListItem from './BookListItem.vue'
import BookDetails from './BookDetails.vue'
import BookMoreBtn from './BookMoreBtn.vue'

import { notifyDone, notifyWarning } from 'core/utils/control'
import useLoadMore from 'src/hooks/useLoadMore'
import useCommon from 'core/hooks/useCommon'
import { globalBus } from 'src/api/event/event-bus'

const emit = defineEmits(['close'])

const { t } = useCommon()
const { condition, loading, sort, rows, view, query, scrollRef, total, initQuery } = useLoadMore()

const data = ref({})
const filter = ref(false)
const bookView = ref('compact')

function onView(value: string) {
  bookView.value = value
}

function onSort(value: Indexable) {
  sort.value = value
  query.value.onQuery()
}

function onDetails(item: any) {
  data.value = item
  query.value.openSide('480px', 'details')
}

function onClose() {
  query.value.closeSide(false, false)
}

function addBook(book: any, idx: number) {
  workspaceBookService.save({
    bookId: book.id
  }).then(res => {
    book.workspaceBookId = res.id
    rows.value.splice(idx, 1, book)
    notifyDone()
    globalBus.emit('library-need-refresh', res)
  }).catch(res => {
    const data = res.response.data
    if (data.message.indexOf('UNIQUE') === 0) {
      notifyWarning('已经添加本书')
    } else {
      notifyWarning(data.message)
    }
  })
}

function initData() {
  initQuery({
    api: 'book',
    path: '/query/library',
    title: t('book._'),
    sortBy: { 'book.update_time': 'desc' }
  })
}

onMounted(() => {
  initData()
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

    .query-item {
      .q-avatar {
        width: unset !important;
        padding: 0 6px;
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
