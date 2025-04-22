<template>
  <o-query-page class="ai-config-llm"
                v-bind="query"
                @dense="query.onDense"
                @query="query.onQuery"
                @reset="query.onReset"
                enable-fullscreen>

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
        <template #body-cell-home="props">
          <q-td :props="props">
            <a :href="`${props.value}`" target="_blank">
              {{props.value}}
              <q-icon name="open_in_new" />
            </a>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn color="primary" icon="edit" @click="query.onDetails(props.row.id, '640px')" flat dense>
              <o-tooltip :message="$t('edit')" />
            </q-btn>
            <q-btn color="red" icon="delete" @click="query.onDelete(apiName, props.row.id, props.row.title)" flat dense>
              <o-tooltip :message="$t('delete')" />
            </q-btn>
          </q-td>
        </template>

        <!-- Grid -->
        <template v-slot:item="props">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 row-item">
            <provider-card :data="props.row"
                        @edit="onEdit(props.row)"
                        @disable="onDisable(props.row)" />
          </div>
        </template>
      </q-table>
    </template>

    <!--Side Panel-->
    <template #side-panel>
      <Item :id="`${id}`"
            :data="data"
            @success="query.closeSide(true, true)"
            v-if="view==='details'" />
    </template>

  </o-query-page>
</template>

<script setup lang="ts">
import {computed, ref, onActivated} from 'vue';

import { TableViews } from 'src/app/metadata';
import useCommon from 'core/hooks/useCommon';
import useQuery from 'src/hooks/useQuery';
import { aiProviderService } from 'src/service/remote/ai-provider';

import Item from './item/index.vue';
import ProviderCard from './ProviderCard.vue';
import { notifyDone } from 'core/utils/control'

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

const apiName = 'aiProvider';
const data = ref<Indexable>({});
const columns = computed(() => {
  return [
    { field: 'name', label: '名称', align: 'left', name: 'name' },
    { field: 'title', label: '标题', align: 'left', name: 'title' },
    { field: 'description', label: '简介', align: 'left', name: 'description', classes: 'ellipsis' },
    { field: 'home', label: '主页', align: 'left', name: 'home' },
    { field: 'huggingface', label: 'HuggingGace', align: 'left', name: 'huggingface' },
    { field: 'status', label: '状态', align: 'left', name: 'status', sortable: true },
    { field: 'actions', label: '操作', name: 'actions', align: 'right' }
  ];
});

function onPagination(pagination: Indexable) {
  console.log('pagination', pagination)
}

function init() {
  tableView.value = 'grid';
  initQuery({
    api: apiName,
    path: '/all',
    columnList: columns.value as Indexable[],
    title: 'AI Provider'
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
.ai-config-llm {
  .console-content {
    padding: 0 21px 21px 21px !important;
  }

  .query-wrap {
    .q-separator {
      display: none;
    }

    .condition {
      .col-auto {
        display: none;
      }
    }

    .q-table__grid-content {
      margin: -0.5rem;
      .row-item {
        padding: 0.5rem;
      }
    }
  }

  .query-table-actions {
    //display: none;
  }

}
</style>
