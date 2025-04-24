<template>
  <o-query-section class="dataset-tab"
                   icon="dataset"
                   title="Dataset"
                   v-bind="query"
                   sticky-first
                   sticky-last extend-header>
    <template #header-extension>
      <div class="q-pb-sm text-tips">
        Please wait for your files to finish parsing before starting an AI-powered chat.
      </div>
    </template>

    <!--Actions-->
    <template #query-start>
      <o-hover-menu-btn label="批量操作"
                        anchor="bottom left"
                        self="top left"
                        class="bg-accent"
                        menu-class="pi-menu dense"
                        min-width="160px" flat dropdown>
        <template v-for="(item, index) in actions"
        :key="index">
          <q-separator class="bg-accent" v-if="item.separator" />
          <o-common-item v-bind="item" clickable closable>
          </o-common-item>
        </template>
      </o-hover-menu-btn>
    </template>
    <template #query-end>
      <div class="query-item q-mr-sm">
        <q-input v-model="condition.status"
                 placeholder="名称"
                 standout dense clearable
                 @update:model-value="query.onQuery">
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-btn icon="add" label="添加文件" class="bg-primary text-white"
             @click="query.onDetails('')" flat/>
    </template>

    <!--Results-->
    <template #results>
      <q-table row-key="id" class="col-12 o-table"
               v-bind="table"
               v-model:pagination="table.paging"
               v-model:selected="selected"
               selection="multiple"
               @request="query.onRequest">
        <template #body-cell-status="props">
          <q-td :props="props">
            <o-badge v-bind="getArrayItem(Status, props.value)" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="handyman" color="blue"
                   @click="$router.push({name: 'store-investment-configs', query: {productId: productId, productStoreId: props.row.id, type: '0'}})"
                   flat dense>
              <o-tooltip message="分成比例"/>
            </q-btn>
            <q-btn color="primary" icon="edit" @click="query.onDetails(props.row.id, '640px')" flat dense>
              <o-tooltip :message="$t('edit')" />
            </q-btn>
            <q-btn color="primary" icon="download" @click="query.onDetails(props.row.id, '640px')" flat dense>
              <o-tooltip :message="$t('download')" />
            </q-btn>
            <q-btn color="red" icon="delete" @click="query.onDelete(apiName, props.row.id, props.row.title)" flat dense>
              <o-tooltip :message="$t('delete')" />
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>

    <!--Side Panel-->
    <template #side-panel>
    </template>

  </o-query-section>
</template>

<script setup lang="ts">
import {computed, onActivated, onMounted, ref} from 'vue';

import OQuerySection from 'core/page/section/OQuerySection.vue';
import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue';
import {ActiveStatus, getArrayItem, Status} from 'src/app/metadata';
import useQuery from 'src/hooks/useQuery';
import { formatFileSize, formatNumber, timeAdd, timeMulti } from 'core/utils/format'
import { Locales } from 'core/constants/metadata'

const props = defineProps({
  productId: {
    type: Number,
    default: 0
  }
});

const { id, condition, query, table, initQuery } = useQuery();
const selected = ref([]);

const apiName = 'file';
const columns = computed(() => {
  return [
    { field: 'originalName', label: '名称', align: 'left', name: 'originalName', classes: 'ellipsis' },
    { field: 'mimetype', label: 'MimeType', align: 'left', name: 'mimetype' },
    { field: 'refType', label: '业务类型', align: 'left', name: 'refType' },
    { field: 'size', label: '大小', align: 'left', name: 'size', sortable: true, format: (val: number) => formatFileSize(val) },
    { field: 'status', label: '状态', align: 'left', name: 'status', sortable: true },
    { field: 'updateTime', label: '时间', align: 'left', name: 'updateTime' },
    { field: 'actions', label: '操作', name: 'actions', align: 'right', style: 'width: 120px' }
  ];
});

const actions = computed(() => {
  return [
    { label: '启用', value: 'enable', icon: 'check_circle', color: 'blue' },
    { label: '禁用', value: 'disable', icon: 'cancel', color: 'amber' },
    { label: '解析', value: 'enable', icon: 'play_circle', color: 'blue', separator: true },
    { label: '取消', value: 'disable', icon: 'stop_circle', color: 'amber' },
    { label: '删除', value: 'disable', icon: 'delete', color: 'red', separator: true },
  ]
})

function reset() {
  condition.value = {
    productId: props.productId
  };
  query.value.onQuery();
}

onMounted(() => {
  table.value.paging.descending = false;
  query.value.onReset = reset;
  condition.value.productId = props.productId;

  initQuery({
    api: apiName,
    columnList: columns.value,
    title: 'File'
  });
})
</script>

<style lang="scss">
.dataset-tab {

}
</style>
