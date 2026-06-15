import { computed } from 'vue'
import { useAccountStore } from 'stores/account'
import { useWorkspaceStore } from 'src/stores/workspace'
import { useTabStore } from 'stores/tab'
import type { TabItem } from 'core/types/menu'

export default function () {
  const accountStore = useAccountStore()
  const workspaceStore = useWorkspaceStore()
  const tabStore = useTabStore()

  const isLogin = computed(() => {
    return accountStore.accountId !== undefined
  })

  const workspaces = computed(() => {
    return workspaceStore.workspaces
  })

  const workspace = computed(() => {
    return workspaceStore.workspace
  })

  const workspaceId = computed(() => {
    return workspaceStore.workspace?.id
  })

  const loadWorkspace = async () => {
    if (isLogin.value) {
      workspaceStore.loadWorkspace()
    }
  }

  const setWorkspace = (value: Indexable) => {
    workspaceStore.setWorkspace(value)
  }

  const switchWorkspace = (workspace: Indexable) => {
    workspaceStore.switchWorkspace(workspace)
    tabStore.updateWorkspace(workspace.id)
  }

  const switchWorkspaceByTab = (tab: TabItem) => {
    const workspace = workspaceStore.getWorkspace(tab.workspaceId)
    if (workspace) {
      workspaceStore.switchWorkspace(workspace, '')
    }
  }


  return {
    workspaceId,
    workspace,
    workspaces,

    loadWorkspace,
    setWorkspace,
    switchWorkspace,
    switchWorkspaceByTab,
  }
}
