<template>
  <setting-card class="workspace-tab">
    <o-common-card title="当前空间" small header padding>
      <section class="col-12">
        <q-list no-border link>
          <q-item class="profile">
            <q-item-section avatar>
              <q-avatar size="80px">
                <img :src="avatar || $public('/logo.png')" alt="Avatar" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Display Name</q-item-label>
              <q-item-label>
                <q-input v-model="name" class="pi-field"
                         debounce="800"
                         @update:modelValue="onUpdateName"
                         standout dense autofocus />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </o-common-card>
    <o-common-card title="管理空间" small header>
      <template #right>
        <q-btn icon="add" label="添加空间" class="bg-primary text-white" flat />
      </template>
      <section class="col-12">
        <q-table class="col-12 o-table"
                 row-key="index"
                 :columns="columns"
                 :rows="workspaces"
                 :pagination="{rowsPerPage: 10}"
                 hide-bottom
                 flat>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn label="当前空间"
                     class="bg-accent text-tips"
                     disable flat dense
                     v-if="props.row.id === workspace.id" />
              <q-btn label="切换空间"
                     class="bg-accent text-readable"
                     flat dense v-else />
            </q-td>
          </template>
        </q-table>
      </section>
    </o-common-card>
  </setting-card>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { userService } from 'src/api/service/remote/user';
import useAccount from 'src/hooks/useAccount';
import SettingCard from './setting-card.vue';

const { account, workspace, workspaces, setAccount } = useAccount();
const name = ref('');
const avatar = ref('');

function onUpdateName() {
  console.log('name', name.value);
  setAccount({ ...account.value, name: name.value });
  userService.save({ id: account.value.id, name: name.value });
}

const columns = computed(() => {
  return [
    { field: 'name', label: '名称', align: 'left', name: 'name', classes: 'text-bold' },
    { field: 'type', label: '类型', align: 'left', name: 'type' },
    { field: 'updateTime', label: '更新时间', align: 'left', name: 'updateTime' },
    { field: 'actions', label: '操作', name: 'actions', align: 'right', style: 'width: 80px' }
  ];
});

onMounted(() => {
  name.value = workspace.value.name;
  avatar.value = workspace.value.avatar;
})
</script>

<style lang="scss">
.workspace-tab {
  .profile {
    padding: 8px 0;
    .q-field {
      max-width: 320px;
    }
  }
}
</style>
