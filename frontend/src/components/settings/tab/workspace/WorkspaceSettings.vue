<template>
  <section class="workspace-settings">
    <o-common-card small header padding>
      <template #header>
        <q-btn icon="arrow_back" flat round @click="emit('back')" />
        <span class="q-ml-sm">{{ title }}</span>
      </template>

      <section class="col-12">
        <q-list no-border link>
          <q-item class="profile">
            <q-item-section avatar>
              <q-avatar size="80px"
                        class="bg-accent"
                        :class="{ 'editable': editable }"
                        square>
                <o-icon :name="workspaceAlt.icon || '🍃'" size="64px" />
                <o-general-icon-menu anchor="top right" self="top left"
                                     :offset="[8, 0]"
                                     @select="onSelectIcon"
                                     v-if="editable" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="title">
                <o-editable-label v-model="name"
                                  @update:modelValue="onUpdateName"
                                  :editable="editable" />
                <o-chip v-bind="getArrayItem(WorkspaceTypes, workspaceAlt.type)"
                        class="q-ml-md"
                        square dense />
              </q-item-label>
              <q-item-label class="q-pt-xs" caption>
                <o-editable-label v-model="desc"
                                  @update:modelValue="onUpdateDesc"
                                  :editable="editable" />
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                <q-btn :label="$t('workspace.invites.accept')"
                       class="bg-amber text-white"
                       flat
                       @click="onAcceptInvite"
                       v-if="workspaceAlt.memberStatus === 0" />
                <o-chip :label="$t('workspace.invites.joined')" color="green"
                        square
                        v-else />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </o-common-card>

    <o-common-card :title="$t('workspace.members')" small header>
      <template #header>
        <q-chip :label="`${rows.length} members`" size="sm" square />
      </template>
      <template #right>
        <q-btn icon="person_add" :label="$t('workspace.invites.member')"
               class="bg-primary text-white"
               flat @click="onInvite()"
               v-if="editable && workspaceAlt.type === 'team'" />
      </template>
      <section class="col-12">
        <q-table class="col-12"
                 row-key="index"
                 :columns="columns"
                 :rows="rows"
                 :pagination="{rowsPerPage: 10}"
                 hide-bottom
                 flat>

          <template #body-cell-userName="props">
            <q-td :props="props">
              <span class="q-mr-xs">{{props.value}}</span>
              <o-badge color="blue" square
                       v-if="props.row.userId === workspaceAlt.userId">owner</o-badge>
              <o-badge color="grey" square
                       v-if="props.row.userId === account.id">me</o-badge>
            </q-td>
          </template>
          <template #body-cell-role="props">
            <q-td :props="props">
              <template v-if="props.value === 'owner' || !editable">
                <span>
                  {{ getArrayItem(WorkspaceMemberRoles, props.value).label }}
                </span>
              </template>
              <o-hover-menu-btn :label="getArrayItem(WorkspaceMemberRoles, props.value).label"
                                dropdown
                                flat
                                dense
                                style="font-weight: normal;"
                                v-else>
                <template v-for="(item, index) in WorkspaceMemberRoles.filter(w => w.value !== 'owner')"
                          :key="`${props.row.id}-${index}`">
                  <o-common-item v-bind="item"
                                 :active="item.value === props.value"
                                 :clickable="item.value !== props.value"
                                 closable
                                 @click="onAssignRole(props.row, item)" />
                </template>
              </o-hover-menu-btn>
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <o-chip v-bind="getArrayItem(WorkspaceMemberStatus, props.value)" square dense />
            </q-td>
          </template><template #body-cell-actions="props">
          <q-td :props="props">
            <template v-if="editable && props.row.role !== 'owner'">
              <q-btn :label="$t('disable')" class="bg-red text-white" flat dense
                     @click="updateStatus(props.row)"
                     v-if="props.row.status === 1" />
              <q-btn :label="$t('enable')" class="bg-primary text-white" flat dense
                     @click="updateStatus(props.row)"
                     v-else-if="props.row.status === -1" />
              <template v-else>-</template>
            </template>
            <template v-else>-</template>
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
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue'
import { workspaceMemberService, workspaceService } from 'src/api/service/remote'
import { timeMulti } from 'core/utils/dayjs.js'
import WorkspaceMemberInvite from './WorkspaceMemberInvite.vue'
import OSideDialog from 'core/components/dialog/OSideDialog.vue'
import OEditableLabel from 'core/components/form/OEditableLabel.vue'
import useMetadata from 'src/hooks/useMetadata'
import useCommon from 'core/hooks/useCommon'
import OGeneralIconMenu from 'components/icon/OGeneralIconMenu.vue'
import useAccount from 'src/hooks/useAccount'
import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
})
const emit = defineEmits(['back'])

const $q = useQuasar()
const { t } = useCommon()
const { account, workspace, initWorkspace, setWorkspace } = useAccount()
const {
  getArrayItem,
  WorkspaceMemberRoles,
  WorkspaceMemberStatus,
  WorkspaceTypes
} = useMetadata()
const name = ref('')
const desc = ref('')
const workspaceAlt = ref<Indexable>({})
const rows = ref<Indexable[]>([])
const side = reactive<Indexable>({
  show: false,
  title: t('workspace.invites.member'),
  icon: 'person_add',
  position: 'standard',
  style: {width: '30vw', minWidth: '600px'},
  contentClass: 'card pi-card-dialog-theme'
})

const columns = computed(() => {
  return [
    { field: 'userName', label: t('name'), align: 'left', name: 'userName', classes: 'text-bold' },
    { field: 'userEmail', label: t('email'), align: 'left', name: 'userEmail' },
    { field: 'role', label: t('role'), align: 'center', name: 'role' },
    { field: 'status', label: t('status'), align: 'left', name: 'status' },
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

const editable = computed(() => {
  return ['owner', 'admin'].includes(props.data.memberRole)
    && props.data.memberStatus === 1
})

function onUpdateName() {
  updateCurrent({name: name.value})
}

function onUpdateDesc() {
  updateCurrent({desc: desc.value})
}

function onSelectIcon(options: Indexable) {
  updateCurrent({icon: options.value})
}

function updateCurrent(value: Indexable) {
  workspaceService.update({ ...value, id: props.data.id  }).then(res => {
    if (props.data.id === workspace.value.id) {
      setWorkspace(res)
      initWorkspace()
    }
    workspaceAlt.value = {
      ...workspaceAlt.value,
      ...res
    }
  })
}

const initData = () => {
  name.value = props.data.name
  desc.value = props.data.desc
  workspaceAlt.value = props.data

  queryMembers()
}

const queryMembers = () => {
  const body = {
    pageSize: 1000,
    condition: {
      workspaceId: props.data.id
    }
  }
  workspaceMemberService.queryDetails(body).then(res => {
    rows.value = res.list
  })
}

const onInvite = () => {
  side.show = true
  side.icon = 'person_add'
}

const onAcceptInvite = () => {
  workspaceMemberService.acceptInvite(props.data.workspaceMemberId).then(res => {
    workspaceAlt.value.memberStatus = res.status
    queryMembers()
  })
}

const onAssignRole = (item: Indexable, role: Indexable) => {
  console.log('assign role', item, role)
  $q.dialog({
    class: 'pi-dialog-theme',
    title: t('confirm'),
    message: `${t('workspace.assignRoleConfirm', {name: item.userName})}
      <div class="tag">${role.label}</div>`,
    html: true,
    cancel: true
  }).onOk( () => {
    assignRole(item, role.value)
  })
}

const assignRole = (row: Indexable, role: string) => {
  workspaceMemberService.assignRole(row.id, role).then(res => {
    postChange(row, res)
  })
}

const updateStatus = (row: Indexable) => {
  if (row.status === 1) {
    workspaceMemberService.disable(row.id).then(res => {
      postChange(row, res)
    })
  } else {
    workspaceMemberService.enable(row.id).then(res => {
      postChange(row, res)
    })
  }
}

const postChange = (row: Indexable, res: Indexable) => {
  const idx = rows.value.findIndex(r => r.id === row.id)
  if (idx >= 0) {
    rows.value.splice(idx, 1, {
      ...row,
      ...res
    })
  }
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
</script>

<style lang="scss">
.workspace-settings {
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

  .profile {
    padding: 0;

    .q-avatar {
      border-radius: 4px !important;
      &.editable:hover {
        cursor: pointer;
        background: var(--q-dark) !important;
      }
    }

    .title {
      font-size: 2rem;
      font-weight: 600;
    }
  }

  .q-table {
    .q-btn--dense {
      padding: 0 6px;
      min-height: unset;
    }
  }
}
</style>
