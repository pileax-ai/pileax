<template>
  <setting-card class="workspace-tab">
    <workspace-manage @view="onView"
                      v-if="view === 'main'" />
    <workspace-settings :title="$t('workspace.details')"
                        :data="data"
                        @back="view = 'main'"
                        v-if="view === 'details'" />
    <workspace-settings :title="$t('workspace.settings')"
                        :data="data"
                        @back="view = 'main'"
                        v-if="view === 'settings'" />
  </setting-card>
</template>

<script setup lang="ts">
import { ref, } from 'vue'
import SettingCard from './setting-card.vue'
import WorkspaceManage from './workspace/WorkspaceManage.vue'
import WorkspaceSettings from './workspace/WorkspaceSettings.vue'

const view = ref('main')
const data = ref<Indexable>({})

const onView = (viewAlt: string, value: Indexable) => {
  view.value = viewAlt
  data.value = value
}
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
