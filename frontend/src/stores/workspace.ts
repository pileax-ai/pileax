import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { CODE } from 'core/app'
import { store } from 'stores/index'
import { useAccountStore } from 'stores/account'
import { workspaceManager } from 'core/workspace/workspace-manager'
import { getItemObject } from 'core/utils/storage'

export const useWorkspaceStore = defineStore('workspace', () =>
  {
    const router = useRouter()
    const accountStore = useAccountStore()

    // states
    const workspace = ref<Indexable>({})

    // getters
    const workspaceId = computed(() => {
      return workspace.value.id
    })
    const workspaces = computed(() => {
      return accountStore.workspaces
    })
    const activeWorkspaces = computed(() => {
      return accountStore.activeWorkspaces
    })

    // actions
    const loadWorkspace = () => {
      if (workspace.value?.id) {
        // 1. Use active workspace, restore from storage
        // e.g. Refresh a page
        workspaceManager.setCurrentWorkspace(workspace.value.id)
        // console.log('load: restore')
      } else {
        // 2. Use parent workspace
        // e.g. Open a new window
        const account = getItemObject('account') as Indexable
        const parentWorkspace = account?.parentWorkspace
        if (parentWorkspace && workspaces.value.find(i => i.id === parentWorkspace)) {
          const ws = workspaces.value.find(i => i.id === parentWorkspace)
          // console.log('load: parentWorkspace', ws)
          switchWorkspace(ws!, '')
          return ws
        } else {
          // 3. Use default workspace
          // e.g. New login
          if (activeWorkspaces.value.length) {
            // Default workspace
            const defaultWorkspace = activeWorkspaces.value[0]
            // console.log('load: defaultWorkspace', defaultWorkspace)
            switchWorkspace(defaultWorkspace!, '')
            return defaultWorkspace
          }
        }
      }
      return {}
    }

    const getWorkspace = (id: string) => {
      return workspaces.value.find(item => item.id === id)
    }

    const setWorkspace = (value: Indexable) => {
      workspace.value = value
    }

    const switchWorkspace = (value: Indexable, redirect = '/welcome') => {
      if (redirect) {
        workspace.value = value
        workspaceManager.switchWorkspace(value.id)

        // switch after redirect completed
        setTimeout(() => {
          if (router) {
            router.push(redirect)
          }
        }, 100)
      } else {
        workspace.value = value
        workspaceManager.switchWorkspace(value.id)
      }
    }

    const reset = async () => {
      workspace.value = {}
    }

    return {
      workspace,
      workspaceId,
      workspaces,
      activeWorkspaces,
      loadWorkspace,
      getWorkspace,
      setWorkspace,
      switchWorkspace,
      reset
    }
  },
  {
    persist: {
      key: `${CODE}.workspace`,
      storage: sessionStorage,
    },
  }
)

export const useWorkspaceStoreWithOut = () => {
  return useWorkspaceStore(store)
}
