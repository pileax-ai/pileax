<template>
  <o-query-page class="knowledges"
                v-bind="query"
                @dense="query.onDense"
                @query="query.onQuery"
                @reset="query.onReset"
                enable-fullscreen>
    <!--Actions-->
    <template #actions-start>
      <q-btn icon="add"
             label="知识库"
             class="bg-primary text-white q-mr-sm"
             @click="query.onDetails('')"
             flat rounded />
    </template>

    <!--Condition-->
    <template #query-start>
      <div class="col-lg-2 col-md-3 col-sm-4 query-item">
        <q-input v-model="condition.name"
                 placeholder="名称"
                 debounce="800"
                 standout dense clearable
                 @update:model-value="query.onQuery">
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>
    <template #query-end>
      end
    </template>

    <!--Results-->
    <template #results>
      <q-table ref="tableRef" row-key="index" class="col-12 o-table"
               v-bind="table"
               v-model:pagination="table.paging"
               :grid="tableView==='grid'"
               @request="query.onRequest">
        <!-- Grid -->
        <template v-slot:item="props">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 row-item">
            <item-card :data="props.row"
                        @edit="onEdit(props.row)" />
          </div>
        </template>
      </q-table>
    </template>

    <!--Side Panel-->
    <template #side-panel>
      <Item :id="`${id}`"
            @success="onClose"
            v-if="view==='details'" />
    </template>

  </o-query-page>
</template>

<script setup lang="ts">
import {computed, ref, onActivated} from 'vue'

import useCommon from 'core/hooks/useCommon'
import useQuery from 'src/hooks/useQuery'

import Item from './Item.vue'
import ItemCard from './ItemCard.vue'
import useKnowledge from 'src/hooks/useKnowledge'
import { formatFileSize } from 'core/utils/format'

const { knowledgeStore } = useKnowledge()
const { confirm } = useCommon()
const {
  id,
  condition,
  query,
  table,
  tableRef,
  tableView,
  view,
  initQuery,
} = useQuery()

const apiName = 'knowledge'
const data = ref<Indexable>({})
const columns = computed(() => {
  return [
    { field: 'path', label: '预览', align: 'left', name: 'path' },
    { field: 'originalName', label: '名称', align: 'left', name: 'originalName', classes: 'ellipsis' },
    { field: 'mimetype', label: 'MimeType', align: 'left', name: 'mimetype' },
    { field: 'refType', label: '业务类型', align: 'left', name: 'refType' },
    { field: 'size', label: '大小', align: 'left', name: 'size', sortable: true, format: (val: number) => formatFileSize(val) },
    { field: 'status', label: '状态', align: 'left', name: 'status' },
    { field: 'updateTime', label: '时间', align: 'left', name: 'updateTime', sortable: true },
    { field: 'actions', label: '操作', name: 'actions', align: 'right' }
  ]
})

function init() {
  tableView.value = 'grid'
  initQuery({
    api: apiName,
    path: '/query',
    columnList: columns.value as Indexable[],
    title: '知识库'
  })
}

function onEdit(value: Indexable) {
  data.value = value
  query.value.onDetails(value.id)
}

function onClose() {
  knowledgeStore.setQueryTimer(Date.now())
  query.value.closeSide()
}

onActivated(() => {
  init()
})
</script>

<style lang="scss">
.knowledges {
  .console-content {
    padding: 0 21px 21px 21px !important;
  }

  .query-wrap {
    .q-table__grid-content {
      margin: -0.5rem;
      .row-item {
        padding: 0.5rem;
      }
    }
  }

}
</style>
