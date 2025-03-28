<template>
  <o-console-page class="book-annotation-list"
                  disable-meta
                  v-bind="query">
    <template #header-left>
      <div class="query-item no-drag-region">
        <q-input v-model="condition.note"
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
    </template>

    <template v-if="rows.length">
      <section class="row col-12 justify-center list-view">
        <q-list>
          <template v-for="(item, index) in rows" :key="index">
            <annotation-list-item :data="item" @details="onDetails" />
          </template>
        </q-list>
      </section>
    </template>
    <template v-else>
      <section class="row col-12 justify-center no-records">
        <span class="text-readable">书库中还没有记录，快来添加吧</span>
      </section>
    </template>

    <template #side-panel>
      <annotation-details :data="data"
                          :cover-url="coverUrl"
                          @close="onClose"
                          v-if="view==='details'" />
    </template>
  </o-console-page>
</template>

<script setup lang="ts">
import {computed, onActivated, ref, watch} from 'vue';
import { joinQueryAnnotation } from 'src/service/book-annotation';
import AnnotationListItem from './AnnotationListItem.vue';
import AnnotationDetails from './AnnotationDetails.vue';

import useReader from 'src/hooks/useReader';
import useQuery from 'src/hooks/useQuery';

const { queryTimer } = useReader();
const { view, query } = useQuery();

const data = ref({});
const coverUrl = ref('');
const condition = ref({});
const rows = ref([]);
const loading = ref(false);
const bookView = ref('grid');
const sortBy = ref('recent');


function openBook(item: any) {
  window.electronAPI.openNewWindow(item.id, `/reader/view?id=${item.id}`);
}

function doQuery() {
  joinQueryAnnotation(condition.value.note).then(res => {
    console.log('res', res);
    rows.value = res;
  });
}

function initData() {
  doQuery();
}

function onDetails(item: any, cover: string) {
  data.value = item;
  coverUrl.value = cover;
  query.value.openSide('480px', 'details');
}

function onClose() {
  query.value.closeSide();
}

watch(() => queryTimer.value, (newValue) => {
  doQuery();
})

onActivated(() => {
  initData();
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
