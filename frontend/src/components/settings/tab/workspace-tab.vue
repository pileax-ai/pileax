<template>
  <setting-card class="workspace-tab">
    <o-common-card title="当前空间" small header padding>
      <section class="col-12">
        <q-list no-border link>
          <q-item class="profile">
            <q-item-section avatar>
              <q-avatar size="80px"
                        :class="{ 'editable': editable }"
                        square>
                <o-icon :name="workspace.icon || '🍃'" size="64px" />

                <o-general-icon-menu anchor="top right" self="top left"
                                     :offset="[8, 0]"
                                     @emoji="onSelectEmoji"
                                     @icon="onSelectIcon"
                                     v-if="editable" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Workspace Name</q-item-label>
              <q-item-label>
                <q-input v-model="name" class="pi-field"
                         debounce="800"
                         @update:modelValue="onUpdateName"
                         standout dense autofocus
                         :readonly="!editable" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </o-common-card>
    <o-common-card title="管理空间" small header>
      <template #right>
        <q-btn icon="add" label="添加空间"
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

          <template #body-cell-icon="props">
            <q-td :props="props">
              <o-icon :name="props.value" size="2rem" v-if="props.value" />
              <o-icon name="🍃" size="2rem" v-else />
            </q-td>
          </template>

          <template #body-cell-type="props">
            <q-td :props="props">
              <o-chip v-bind="getArrayItem(WorkspaceTypes, props.value)" square />
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="primary" icon="edit" @click="onEditWorkspace(props.row)"
                     flat dense v-if="props.row.userId === account.id">
                <o-tooltip :message="$t('edit')"/>
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
  </setting-card>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive, onActivated } from 'vue'
import useAccount from 'src/hooks/useAccount'
import SettingCard from './setting-card.vue'
import OSideDialog from 'core/components/dialog/OSideDialog.vue'
import WorkspaceAdd from './workspace/WorkspaceAdd.vue'
import { workspaceService } from 'src/api/service/remote/workspace'
import { getArrayItem, WorkspaceTypes } from 'src/app/metadata'
import { timeMulti } from 'core/utils/format'
import OGeneralIconMenu from 'components/icon/OGeneralIconMenu.vue'

const { account, workspace, workspaces, initWorkspace, setWorkspace } = useAccount()
const name = ref('')
const avatar = ref('')
const side = reactive<Indexable>({
  show: false,
  title: 'Workspace',
  icon: 'workspaces',
  position: 'standard',
  style: {width: '30vw', minWidth: '600px'},
  contentClass: 'card'
})
const workspaceItemId = ref('')
const workspaceItem = ref<Indexable>()
const editable = computed(() => {
  return workspace.value.userId === account.value.id
})

function onUpdateName() {
  updateCurrent({name: name.value})
}

function onSelectEmoji(options: Indexable) {
  updateCurrent({icon: options.emoji})
}

function onSelectIcon(options: Indexable) {
  updateCurrent({icon: options.name})
}

function updateCurrent(data: Indexable) {
  workspaceService.update({ ...data, id: workspace.value.id  }).then(res => {
    setWorkspace(res)
    initWorkspace()
  })
}

const columns = computed(() => {
  return [
    { field: 'icon', label: '图标', align: 'left', name: 'icon' },
    { field: 'name', label: '名称', align: 'left', name: 'name', classes: 'text-bold' },
    { field: 'type', label: '类型', align: 'left', name: 'type' },
    { field: 'updateTime', label: '更新时间', align: 'left', name: 'updateTime', format: (val: string) => timeMulti(val).timestamp },
    { field: 'actions', label: '操作', name: 'actions', align: 'right', style: 'width: 80px' }
  ]
})

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
  initWorkspace()
}

const onSideClose = () => {
  side.show = false
  workspaceItemId.value = ''
}

onMounted(() => {
  name.value = workspace.value.name
  avatar.value = workspace.value.avatar
  initWorkspace()
})

onActivated(() => {
  initWorkspace()
})
</script>

<style lang="scss">
.workspace-tab {
  .profile {
    padding: 0;

    .q-avatar.editable:hover {
      cursor: pointer;
      background: var(--q-accent);
    }

    .q-field {
      max-width: 320px;
    }
  }
}
</style>
