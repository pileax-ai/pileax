import { defineStore } from 'pinia'
import { store } from 'stores/index'
import { CODE } from 'core/app'
import { saveToken } from 'src/utils/auth'
import { clearUserCache, } from 'core/utils/storage'
import { authService } from 'src/api/service/remote/auth'
import { workspaceService } from 'src/api/service/remote/workspace'
import { workspaceManager } from 'core/workspace/workspace-manager'
import type { LoginParams } from 'src/api/models/account'

export const useAccountStore = defineStore('account', {
  state: () => ({
    account: {} as Indexable,
    workspaces: [] as Indexable[],
    parentWorkspace: '',
  }),
  getters: {
    accountId: (state) => state.account.id,
    activeWorkspaces: (state) => state.workspaces.filter(w => w.memberStatus === 1),
  },
  actions: {
    setAccount(value: Indexable) {
      this.account = value
    },
    setParentWorkspace(value: string) {
      this.parentWorkspace = value
    },
    initWorkspaces() {
      return new Promise((resolve, reject) => {
        workspaceService.getWorkspacesDetails().then(res => {
          this.workspaces = res
          workspaceManager.setWorkspaces(res)

          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      })
    },
    setWorkspaces(value: Indexable[]) {
      this.workspaces = value
      workspaceManager.setWorkspaces(value as any)
    },
    async signup(data: Indexable) {
      try {
        const res = await authService.signup(data) as Indexable
        return this.afterLogin(res)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async login(params: LoginParams) {
      try {
        const res = await authService.signin(params) as Indexable
        return this.afterLogin(res)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async afterLogin(result: Indexable, redirect = '/welcome') {
      saveToken(result.token)
      this.account = result.user
      if (redirect) {
        this.router.push(redirect)
      }
      return result.user
    },
    async logout({redirect = '/auth/signin', signout = true} = {}) {
      try {
        if (signout) {
          await authService.signout()
        }
      } finally {
        clearUserCache()

        if (redirect) {
          this.router.push(redirect)
        }
      }
    },
    async reset() {
      this.$reset()
    }
  },
  persist: {
    key: `${CODE}.account`
  }
})

export const useAccountStoreWithOut = () => {
  return useAccountStore(store)
}
