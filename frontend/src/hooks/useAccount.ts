import { computed } from 'vue'
import { useAccountStore } from 'stores/account'
import { useWorkspaceStore } from 'stores/workspace'
import { useTabStore } from 'stores/tab'
import type { TabItem } from 'core/types/menu'
import type { LoginParams } from 'src/api/models/account'

export default function () {
  const accountStore = useAccountStore()
  const workspaceStore = useWorkspaceStore()
  const tabStore = useTabStore()

  const account = computed(() => {
    return accountStore.account
  })

  const isLogin = computed(() => {
    return accountStore.accountId !== undefined
  })

  // workspace
  const workspace = computed(() => {
    return workspaceStore.workspace
  })
  const workspaces = computed(() => {
    return workspaceStore.workspaces
  })
  const activeWorkspaces = computed(() => {
    return workspaceStore.activeWorkspaces
  })

  const initWorkspace = async () => {
    try {
      if (isLogin.value) {
        await accountStore.initWorkspaces()
        const defaultWorkspace = workspaceStore.loadWorkspace() as Indexable
        if (defaultWorkspace.id) {
          tabStore.updateWorkspace(defaultWorkspace.id)
        }
      }
    } catch (err) {
      //
    }
  }

  const setWorkspaces = (value: Indexable[]) => {
    accountStore.setWorkspaces(value)
  }

  const loadWorkspace = () => {
    workspaceStore.loadWorkspace()
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

  function setAccount(value: Indexable) {
    accountStore.setAccount(value)
  }

  async function signup(data: Indexable) {
    await accountStore.reset()
    await workspaceStore.reset()
    return await accountStore.signup(data)
  }

  async function login(params: LoginParams) {
    await accountStore.reset()
    await workspaceStore.reset()
    return await accountStore.login(params)
  }

  function logout() {
    accountStore.logout()
  }


  return {
    accountStore,
    account,
    isLogin,
    workspace,
    workspaces,
    activeWorkspaces,

    signup,
    login,
    logout,
    setAccount,
    initWorkspace,
    loadWorkspace,
    setWorkspaces,
    setWorkspace,
    switchWorkspace,
    switchWorkspaceByTab,
  }
}
