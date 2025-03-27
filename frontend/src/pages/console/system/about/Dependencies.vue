<template>
  <o-query-section class="about-dependencies"
                   icon="extension" title="第三方依赖"
                   extend-header
                   disable-actions :show-query-action="false">
    <!--Results-->
    <template #results>
      <q-table row-key="index" class="col-12 o-table"
               :rows="rows"
               :columns="columns"
               v-model:pagination="pagination" hide-bottom>
        <template #body-cell-image="props">
          <q-td :props="props">
            <img :src="props.value" height="100" v-if="props.value" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="open_in_new" flat dense @click="openLink(props.row)">
              <o-tooltip :message="$t('home')"/>
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
import {computed, ref} from 'vue';

import OQuerySection from 'core/page/section/OQuerySection.vue';
import { openPath } from 'core/hooks/useRouter';

const appInfo = __APP_INFO__;
const rows = appInfo.package.dependencies;

const pagination = ref({
  rowsPerPage: 1000
});

const columns = computed(() => {
  return [
    { field: 'name', label: '名称', align: 'left', name: 'name', sortable: true },
    { field: 'version', label: '版本', align: 'left', name: 'version' },
    { field: 'description', label: '描述', align: 'left', name: 'description', style: 'width: 60%;', classes: 'ellipsis' },
    { field: 'license', label: 'License', align: 'left', name: 'license' },
    { field: 'actions', label: '操作', name: 'actions', align: 'right' }
  ];
});

function openLink(row :Indexable) {
  let link = row.homepage || row.repository.url;
  openPath(link);
}

</script>

<style lang="scss">
</style>
