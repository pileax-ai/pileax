<template>
  <section class="workspace-manage">
    <o-common-card :title="$t('workspace.admin')" small header>
      <template #right>
        <q-btn icon="add"
               :label="$t('workspace.add')"
               class="bg-primary text-white"
               flat @click="onAddWorkspace()" />
      </template>
      <section class="col-12">
        <q-table class="col-12 o-table"
                 row-key="index"
                 :columns="columns"
                 :rows="workspaces"
                 :pagination="{rowsPerPage: 100}"
                 hide-bottom
                 flat>

          <template #body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center">
                <o-icon :name="props.row.icon" size="2rem" v-if="props.row.icon" />
                <o-icon name="🍃" size="2rem" v-else />
                <span class="q-mx-sm">{{ props.value }}</span>

                <o-badge color="blue-grey" round v-if="props.row.id === workspace.id">
                  {{ $t('current') }}
                </o-badge>
              </div>
            </q-td>
          </template>

          <template #body-cell-type="props">
            <q-td :props="props">
              <o-badge v-bind="getArrayItem(WorkspaceTypes, props.value)" square />
            </q-td>
          </template>
          <template #body-cell-memberRole="props">
            <q-td :props="props">
              {{getArrayItem(WorkspaceMemberRoles, props.value).label}}
            </q-td>
          </template>
          <template #body-cell-memberStatus="props">
            <q-td :props="props">
              <o-badge v-bind="getArrayItem(WorkspaceMemberStatus, props.value)" square dense />
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <template v-if="props.row.memberStatus === -1">-</template>
              <q-btn icon="more_vert"
                     flat dense
                     v-else>
                <q-menu class="pi-menu" :offset="[0, 4]" anchor="bottom right" self="top right">
                  <q-list>
                    <template v-for="(action, _index) in availableActions(props.row)" :key="_index">
                      <template v-if="action.value !== 'switch' || props.row.id !== workspace.id">
                        <q-separator class="bg-accent" v-if="action.separator" />
                        <o-common-item v-bind="action"
                                       class="text-readable"
                                       @click="onAction(action, props.row)"
                                       clickable
                                       closable>
                        </o-common-item>
                      </template>
                    </template>
                  </q-list>
                </q-menu>
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
        <workspace-add :id="workspaceItemId"
                       :data="workspaceItem"
                       @success="onClose" />
      </template>
    </o-side-dialog>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive, onActivated } from 'vue'
import useAccount from 'src/hooks/useAccount'
import OSideDialog from 'core/components/dialog/OSideDialog.vue'
import WorkspaceAdd from './WorkspaceAdd.vue'
import { workspaceService } from 'src/api/service/remote/workspace'
import { timeMulti } from 'core/utils/dayjs'
import useCommon from 'core/hooks/useCommon'
import useMetadata from 'src/hooks/useMetadata'

const emit = defineEmits(['view'])

const { t } = useCommon()
const { workspace, setWorkspaces, switchWorkspace } = useAccount()
const {
  getArrayItem,
  WorkspaceMemberRoles,
  WorkspaceMemberStatus,
  WorkspaceTypes
} = useMetadata()
const side = reactive<Indexable>({
  show: false,
  title: t('workspace._'),
  icon: 'workspaces',
  position: 'standard',
  style: {width: '30vw', minWidth: '600px'},
  contentClass: 'card pi-card-dialog-theme'
})
const workspaceItemId = ref('')
const workspaceItem = ref<Indexable>()
const workspaces = ref<Indexable[]>([])

const columns = computed(() => {
  return [
    { field: 'name', label: t('name'), align: 'left', name: 'name', classes: 'text-bold' },
    { field: 'type', label: t('type'), align: 'left', name: 'type' },
    { field: 'memberRole', label: t('role'), align: 'left', name: 'memberRole' },
    { field: 'memberStatus', label: t('status'), align: 'left', name: 'memberStatus' },
    {
      field: 'updateTime',
      label: t('updateTime'),
      align: 'right',
      name: 'updateTime',
      format: (val: string) => timeMulti(val, 'YYYY/MM/DD').timestamp()
    },
    { field: 'actions', label: t('actions'), name: 'actions', align: 'center', style: 'width: 80px' }
  ]
})

const actions = computed(() => {
  return [
    {
      label: t('edit'),
      value: 'edit',
      icon: 'edit',
      roles: 'owner,admin',
      status: '1',
    },
    {
      label: t('workspace.settings'),
      value: 'settings',
      icon: 'tune',
      roles: 'owner,admin',
      status: '1',
    },
    {
      label: t('workspace.details'),
      value: 'details',
      icon: 'details',
      roles: 'editor,normal',
      status: '0,1',
    },
    {
      label: t('workspace.switch'),
      value: 'switch',
      icon: 'start',
      roles: 'owner,admin,editor,normal',
      status: '1',
      separator: true
    },
  ]
})

const availableActions = (item: Indexable) => {
  return actions.value.filter(a =>
    a.roles.split(',').includes(item.memberRole)
    && a.status.split(',').includes(`${item.memberStatus}`)
  )
}

function onAction (action: Indexable, item :Indexable) {
  switch (action.value) {
    case 'edit':
      onEditWorkspace(item)
      break
    case 'details':
      emit('view', 'details', item)
      break
    case 'settings':
      emit('view', 'settings', item)
      break
    case 'switch':
      switchWorkspace(item)
      break
    default:
      break
  }
}

function getWorkspaces() {
  workspaceService.getWorkspacesDetails().then(res => {
    workspaces.value = res
    setWorkspaces(res)
  })
}

const onAddWorkspace = () => {
  workspaceItemId.value = ''
  side.show = true
  side.icon = 'add'
}


const onEditWorkspace = (item: Indexable) => {
  workspaceItemId.value = item.id
  side.show = true
  side.icon = 'edit'
}

const onClose = () => {
  side.show = false
  getWorkspaces()
}

const onSideClose = () => {
  side.show = false
  workspaceItemId.value = ''
}

onMounted(() => {
  getWorkspaces()
})

onActivated(() => {
  getWorkspaces()
})
</script>

<style lang="scss">
.workspace-manage {
}
</style>
