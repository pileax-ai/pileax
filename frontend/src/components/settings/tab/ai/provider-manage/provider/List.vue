<template>
  <o-query-section class="providers-manage"
                   icon="mdi-cube-outline"
                   :title="$t('ai.providers.title')"
                   v-bind="query"
                   @dense="query.onDense"
                   @query="query.onQuery"
                   @reset="query.onReset">
    <!--Actions-->
    <template #actions-start>
      <div class="query-item">
        <q-input v-model="condition.name__icontains"
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
        <q-btn icon="refresh" :label="$t('update')"
               class="bg-primary text-white"
               flat
               :loading="updating"
               @click="onUpdate"
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
        <template #body-cell-alias="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <o-svg-icon :name="props.row.logo" size="2.4rem" colored />
              <div class="q-ml-sm">
                <div class="name">{{props.value}}</div>
                <div class="vendor text-tips">{{props.row.vendor}}</div>
              </div>
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
            <q-btn color="primary" icon="edit" @click="onEdit(props.row)" flat dense v-if="isSuper">
              <o-tooltip :message="$t('edit')" />
            </q-btn>
            <q-btn color="cyan" icon="mdi-cube-outline" @click="emit('view', 'model', props.row)" flat dense>
              <o-tooltip :message="$t('ai.providers.models')" />
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>

    <!--Side Panel-->
    <template #side-panel>
      <ProviderItem :id="`${id}`" :data="data"
            @success="query.closeSide()"
            v-if="view==='details'" />
    </template>

  </o-query-section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, onActivated } from 'vue'
import OQuerySection from 'core/page/section/OQuerySection.vue'
import ProviderItem from './Item.vue'

import { timeMulti } from 'core/utils/dayjs'
import useCommon from 'core/hooks/useCommon'
import useAccount from 'src/hooks/useAccount'
import useMetadata from 'src/hooks/useMetadata'
import useQuery from 'src/hooks/useQuery'
import { llmProviderService } from 'src/api/service/remote'
import { notifyDone } from 'core/utils/control'

const emit = defineEmits(['view'])

const { t } = useCommon()
const { isSuper } = useAccount()
const { getArrayItem, Status } = useMetadata()

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

const apiName = 'llmProvider'
const data = ref<Indexable>({})
const updating = ref(false)
const columns = computed(() => {
  return [
    { field: 'alias', label: t('ai.providers._'), align: 'left', name: 'alias', sortable: true },
    { field: 'tags', label: t('tags'), align: 'left', name: 'tags' },
    { field: 'version', label: t('version'), align: 'left', name: 'version' },
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
  query.value.onDetails(item.id, { width: '480px' })
}

function onUpdate() {
  updating.value = true
  llmProviderService.updateProviders()
    .then(() => {
      notifyDone()
      query.value.onQuery()
    })
    .finally(() => {
      updating.value = false
    })
}

function init() {
  initQuery({
    api: apiName,
    path: '/query',
    columnList: columns.value as Indexable[],
    title: t('ai.providers._')
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
.providers-manage {
  td {
    .name {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .vendor {
      font-size: 0.6rem;
    }
  }

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
