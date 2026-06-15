import { defineStore } from 'pinia'
import { CODE } from 'core/app'
import { store } from 'stores/index'
import { useAccountStore } from 'stores/account'
import { workspaceManager } from 'core/workspace/workspace-manager'
import { getItemObject } from 'core/utils/storage'

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    workspace: {} as Indexable,
  }),
  getters: {
    workspaceId(state) {
      return state.workspace.id
    },
    workspaces() {
      const accountStore = useAccountStore()
      return accountStore.workspaces
    },
    activeWorkspaces() {
      const accountStore = useAccountStore()
      return accountStore.activeWorkspaces
    },
  },
  actions: {
    loadWorkspace() {
      if (this.workspace?.id) {
        // 1. Use active workspace, restore from storage
        // e.g. Refresh a page
        workspaceManager.setCurrentWorkspace(this.workspace.id)
        // console.log('load: restore', this.workspace.id)
      } else {
        // 2. Use parent workspace
        // e.g. Open a new window
        const account = getItemObject('account') as Indexable
        const parentWorkspace = account?.parentWorkspace
        if (parentWorkspace && this.workspaces.find(i => i.id === parentWorkspace)) {
          const ws = this.workspaces.find(i => i.id === parentWorkspace)
          // console.log('load: parentWorkspace', ws)
          this.switchWorkspace(ws!, '')
          return ws
        } else {
          // 3. Use default workspace
          // e.g. New login
          if (this.activeWorkspaces.length) {
            // Default workspace
            const defaultWorkspace = this.activeWorkspaces[0]
            // console.log('load: defaultWorkspace', defaultWorkspace)
            this.switchWorkspace(defaultWorkspace!, '')
            return defaultWorkspace
          }
        }
      }
      return {}
    },
    getWorkspace(id: string) {
      return this.workspaces.find(item => item.id === id)
    },
    setWorkspace(value: Indexable) {
      this.workspace = value
    },
    switchWorkspace(value: Indexable, redirect = '/welcome') {
      this.workspace = value
      workspaceManager.switchWorkspace(value.id)

      if (redirect) {
        // switch after redirect completed
        setTimeout(() => {
          this.router.push(redirect)
        }, 100)
      }
    },
    async reset() {
      this.workspace = {}
    }
  },
  persist: {
    key: `${CODE}.workspace`,
    storage: sessionStorage,
  }
})

export const useWorkspaceStoreWithOut = () => {
  return useWorkspaceStore(store)
}
