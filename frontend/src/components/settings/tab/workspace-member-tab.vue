<template>
  <setting-card class="workspace-member-tab">
    <o-common-card small header>
      <template #header>
        <q-item class="workspace">
          <q-item-section avatar>
            <o-icon :name="workspace.icon || '🍃'" size="42px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{workspace.name}}</q-item-label>
            <q-item-label caption>
              <q-chip :label="getArrayItem(WorkspaceTypes, workspace.type).label" size="sm" square />
              <q-chip :label="`${rows.length} members`" size="sm" square />
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template #right>
        <q-btn icon="add" label="邀请成员"
               class="bg-primary text-white"
               flat @click="onInvite()" v-if="workspace.type === 'team'" />
      </template>
      <section class="col-12">
        <q-table class="col-12 o-table"
                 row-key="index"
                 :columns="columns"
                 :rows="rows"
                 :pagination="{rowsPerPage: 10}"
                 hide-bottom
                 flat>

          <template #body-cell-userName="props">
            <q-td :props="props">
              <o-chip color="blue" square v-if="props.row.userId === workspace.userId">{{props.value}}</o-chip>
              <span v-else>{{props.value}}</span>
            </q-td>
          </template>
          <template #body-cell-role="props">
            <q-td :props="props">
              {{getArrayItem(WorkspaceMemberRoles, props.value).label}}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <o-chip v-bind="getArrayItem(WorkspaceMemberStatus, props.value)" square dense />
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="blue" icon="assignment_ind" @click="onDelete(props.row)" flat dense>
                <o-tooltip message="Assign role" />
              </q-btn>
              <q-btn color="red" icon="person_remove" @click="onDelete(props.row)" flat dense>
                <o-tooltip message="Remove member" />
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </section>
    </o-common-card>

    <o-side-dialog v-bind="side"
                   :seamless="false"
                   scrollable
                   @show="side.show = true"
                   @close="onSideClose">
      <template #content>
        <workspace-member-invite @success="onClose" />
      </template>
    </o-side-dialog>
  </setting-card>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive, onActivated } from 'vue'
import { workspaceMemberService } from 'src/api/service/remote'
import useAccount from 'src/hooks/useAccount'
import SettingCard from './setting-card.vue'
import { timeMulti } from 'core/utils/format'
import WorkspaceMemberInvite from './workspace/WorkspaceMemberInvite.vue'
import OSideDialog from 'core/components/dialog/OSideDialog.vue'
import { getArrayItem, WorkspaceMemberRoles, WorkspaceMemberStatus, WorkspaceTypes } from 'src/app/metadata'

const { workspace } = useAccount()
const rows = ref<Indexable[]>([])
const side = reactive<Indexable>({
  show: false,
  title: 'Invite member',
  icon: 'person_add',
  position: 'standard',
  style: {width: '30vw', minWidth: '600px'},
  contentClass: 'card'
})

const columns = computed(() => {
  return [
    { field: 'userName', label: '名称', align: 'left', name: 'userName', classes: 'text-bold' },
    { field: 'userEmail', label: '邮箱', align: 'left', name: 'userEmail' },
    { field: 'role', label: '角色', align: 'left', name: 'role' },
    { field: 'status', label: '状态', align: 'left', name: 'status' },
    { field: 'updateTime', label: '更新时间', align: 'left', name: 'updateTime', format: (val: string) => timeMulti(val).timestamp },
    { field: 'actions', label: '操作', name: 'actions', align: 'right', style: 'width: 80px' }
  ]
})

const initData = () => {
  const body = {
    pageSize: 1000
  }
  workspaceMemberService.queryDetails(body).then(res => {
    rows.value = res.list
  })
}

const onInvite = () => {
  side.show = true
  side.icon = 'person_add'
}

const onDelete = (item: Indexable) => {

}

const onClose = () => {
  side.show = false
  initData()
}

const onSideClose = () => {
  side.show = false
}

onMounted(() => {
  initData()
})

onActivated(() => {
  initData()
})
</script>

<style lang="scss">
.workspace-member-tab {
  .workspace {
    padding: 0;
    .q-item__section--avatar {
      min-width: unset;

      .o-icon {
        width: 42px;
        height: 42px;
      }
    }
    .q-item__section--side {
      padding-right: 12px;
    }
    .q-item__label--caption {
      .q-chip:first-of-type {
        margin-left: 0;
      }
    }
  }
}
</style>
