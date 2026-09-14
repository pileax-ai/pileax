<template>
  <o-query-section class="workspace-models-manage"
                   icon="mdi-cube-outline"
                   title="模型管理"
                   v-bind="query"
                   @dense="query.onDense"
                   @query="query.onQuery"
                   @reset="query.onReset" disable-meta>
    <template #header-left>
      <q-btn icon="arrow_back" flat round @click="emit('view', 'provider')" />
      <o-svg-icon :name="provider.logo" size="2.4rem" colored />
      <span class="q-ml-sm toolbar-title">{{ provider.alias }}</span>
    </template>

    <!--Actions-->
    <template #actions-start>
      <div class="query-item">
        <q-input v-model="condition.modelName__icontains"
                 :placeholder="$t('name')"
                 class="pi-field"
                 debounce="800"
                 standout dense clearable
                 @update:model-value="query.onQuery">
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div>
        <q-btn icon="add" :label="$t('add')"
               class="bg-primary text-white"
               flat
               @click="query.onDetails('', { width: '480px' })"
               v-if="isSuper" />
      </div>
    </template>

    <!--Results-->
    <template #results>
      <q-table ref="tableRef" row-key="index" class="col-12 o-table"
               v-bind="table"
               v-model:pagination="table.paging"
               :grid="tableView==='grid'"
               @request="query.onRequest">
        <template #body-cell-label="props">
          <q-td :props="props">
            <div class="row items-center">
              <o-svg-icon :name="props.row.logo" size="2.4rem" colored />
              <span class="q-ml-md">{{props.value}}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-tags="props">
          <q-td :props="props">
            <div class="row" style="gap: 4px;">
              <template v-for="(tag, _index) in props.value.split(',')" :key="_index">
                <o-badge color="accent">{{tag}}</o-badge>
              </template>
            </div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <o-badge v-bind="getArrayItem(Status, props.value)" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn color="primary" icon="edit"
                   @click="query.onDetails(props.row.id, { width: '480px' })"
                   flat dense
                   v-if="isSuper">
              <o-tooltip :message="$t('details')" />
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>

    <!--Side Panel-->
    <template #side-panel>
      <ModelItem :id="`${id}`"
                 :provider="provider"
                 @success="query.closeSide()"
                 v-if="view==='details'" />
    </template>

  </o-query-section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, onActivated, type PropType } from 'vue'
import OQuerySection from 'core/page/section/OQuerySection.vue'
import ModelItem from './WorkspaceModelItem.vue'

import { timeMulti } from 'core/utils/dayjs'
import useCommon from 'core/hooks/useCommon'
import useAccount from 'src/hooks/useAccount'
import useMetadata from 'src/hooks/useMetadata'
import useQuery from 'src/hooks/useQuery'

const props = defineProps({
  provider: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})
const emit = defineEmits(['view'])

const { t } = useCommon()
const {
  getArrayItem,
  Status
} = useMetadata()
const { isSuper } = useAccount()

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

const apiName = 'workspaceLLM'
const data = ref<Indexable>({})
const columns = computed(() => {
  return [
    { field: 'modelName', label: t('ai.providers.model.name'), align: 'left', name: 'modelName', sortable: true, classes: 'text-bold' },
    { field: 'modelAlias', label: t('ai.providers.model.alias'), align: 'left', name: 'modelAlias' },
    { field: 'modelType', label: t('ai.providers.model.type'), align: 'left', name: 'modelType', sortable: true },
    { field: 'maxTokens', label: t('ai.providers.model.maxTokens'), align: 'left', name: 'maxTokens', sortable: true },
    { field: 'provider', label: t('ai.providers._'), align: 'left', name: 'provider' },
    { field: 'status', label: t('status'), align: 'left', name: 'status' },
    {
      field: 'updateTime',
      label: t('updateTime'),
      align: 'right',
      name: 'updateTime',
      sortable: true,
      format: (val: string) => timeMulti(val).timestamp()
    },
    { field: 'actions', label: t('actions'), name: 'actions', align: 'center', style: 'width: 80px' }
  ]
})

function onEdit(item: Indexable) {
  data.value = item
  id.value = item.id
  query.value.openSide('480px', 'details')
}

function init() {
  condition.value.provider = props.provider.name
  initQuery({
    api: apiName,
    path: '/query',
    columnList: columns.value as Indexable[],
    title: t('ai.providers.model._')
  })
}

onMounted(() => {
  init()
})

onActivated(() => {
  init()
})
</script>

<style lang="scss">
.workspace-models-manage {
  .o-console-section .console-header .console-toolbar {
    padding: 0;
  }

  .console-header {
    //border-bottom: none;
    .console-toolbar {
      min-height: 56px;
    }
  }
  .console-content {
    padding: 0 !important;
  }
  .query-condition-card .condition {
    padding: 1rem 0 0 0;
  }
}
</style>
