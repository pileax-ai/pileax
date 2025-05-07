<template>
  <o-query-page class="system-files"
                v-bind="query"
                @dense="query.onDense"
                @query="query.onQuery"
                @reset="query.onReset"
                enable-fullscreen fixed-header>

    <!--Condition-->
    <template #condition>
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

    <!--Actions-->
    <template #actions-start>
      <q-btn-toggle
        v-model="tableView"
        color="accent"
        text-color="readable"
        toggle-color="cyan"
        toggle-text-color="white"
        rounded
        unelevated
        dense
        size="12px"
        :options="TableViews.map(e => {
          return {value: e.value, icon: e.icon}
        })"
      />

      <div class="q-mx-sm">
        <q-separator class="bg-accent" vertical />
      </div>
    </template>

    <template #actions>
    </template>

    <!--Results-->
    <template #results>
      <q-table ref="tableRef" row-key="index" class="col-12 o-table"
               v-bind="table"
               v-model:pagination="table.paging"
               :grid="tableView==='grid'"
               @request="query.onRequest" @update:pagination="onPagination">
        <!-- List -->
        <template #body-cell-path="props">
          <q-td :props="props">
            <div class="row items-center">
              <div class="responsive">
                <q-responsive :ratio="16/9">
                  <q-img :src="getFileUrl(props.value)" spinner-size="1rem" />
                </q-responsive>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-refType="props">
          <q-td :props="props">
            <o-badge v-bind="getArrayItem(RefTypes, props.value)" />
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <o-badge v-bind="getArrayItem(Status, props.value)" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn color="primary" icon="info" @click="query.onDetails(props.row.id)" flat dense>
              <o-tooltip :message="$t('details')" />
            </q-btn>
          </q-td>
        </template>

        <!-- Grid -->
        <template v-slot:item="props">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 row-item">
            <item-card :data="props.row"
                        @edit="onEdit(props.row)"
                        @disable="onDisable(props.row)" />
          </div>
        </template>
      </q-table>
    </template>

    <!--Side Panel-->
    <template #side-panel>
      <Item :id="`${id}`"
            @success="query.closeSide(true, true)"
            v-if="view==='details'" />
    </template>

  </o-query-page>
</template>

<script setup lang="ts">
import {computed, ref, onActivated} from 'vue';

import { getArrayItem, RefTypes, Status, TableViews } from 'src/app/metadata'
import useCommon from 'core/hooks/useCommon';
import useQuery from 'src/hooks/useQuery';
import { aiProviderService } from 'src/service/remote/ai-provider';

import Item from './Item.vue';
import ItemCard from './ItemCard.vue';
import { notifyDone } from 'core/utils/control'
import useApi from 'src/hooks/useApi';
import { formatFileSize } from 'core/utils/format'

const { getFileUrl } = useApi();
const { confirm } = useCommon();
const {
  id,
  condition,
  query,
  table,
  tableRef,
  tableView,
  view,
  initQuery,
} = useQuery();

const apiName = 'file';
const data = ref<Indexable>({});
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
  ];
});

function onPagination(pagination: Indexable) {
  console.log('pagination', pagination)
}

function init() {
  // tableView.value = 'grid';
  initQuery({
    api: apiName,
    path: '/query',
    columnList: columns.value as Indexable[],
    title: 'File'
  });
}

function onEdit(value: Indexable) {
  data.value = value;
  query.value.onDetails(value.id);
}

function onDisable(value: Indexable) {
  const label = ` [<span class="text-orange text-bold">${value.title}</span>] `;
  confirm(`确认禁用${label}？`, () => {
    disable(value);
  })
}

function disable(value: Indexable) {
  aiProviderService.disable(value.name).then(res => {
    notifyDone();
    query.value.onQuery();
  })
}

onActivated(() => {
  init();
})
</script>

<style lang="scss">
.system-files {
  .console-content {
    //padding: 50px 21px 21px 21px !important;
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
