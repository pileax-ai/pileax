import { defineStore } from 'pinia';
import {CODE} from 'core/app';
import { saveAccount } from 'src/utils/auth'
import type { LoginParams } from 'src/api/models/account';
import { clearUserCache, } from 'core/utils/storage'
import { authService } from 'src/api/service/remote/auth'
import { workspaceService } from 'src/api/service/remote/workspace'
import { WorkspaceInfo, workspaceManager } from 'core/workspace/workspace-manager'

export const useAccountStore = defineStore('account', {
  state: () => ({
    account: {} as Indexable,
    workspaces: [] as Indexable[],
    workspace: {} as Indexable,
  }),
  getters: {
    accountId: (state) => state.account.id,
    workspaceId: (state) => state.workspace.id,
  },
  actions: {
    setAccount(value: Indexable) {
      this.account = value;
    },
    async signup(data: Indexable) {
      try {
        const res = await authService.signup(data) as Indexable;
        return this.afterLogin(res);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    async login(params: LoginParams) {
      try {
        const res = await authService.signin(params) as Indexable;
        return this.afterLogin(res);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    afterLogin(result: Indexable, redirect = '/welcome') {
      saveAccount(result)
      this.account = result.user;
      if (redirect) {
        this.router.push(redirect);
      }
      return result.user;
    },
    logout() {
      clearUserCache();
      this.router.push('/auth/signin');
    },
    initWorkspaces() {
      return new Promise((resolve, reject) => {
        workspaceService.getWorkspaces().then(res => {
          this.workspaces = res;
          workspaceManager.setWorkspaces(res);

          // Default workspace
          if (!this.workspace?.id && this.workspaces.length) {
            const defaultWorkspace = this.workspaces[0];
            this.switchWorkspace(defaultWorkspace!)
            resolve(defaultWorkspace)
          }
          resolve({})
        }).catch((err: any) => {
          reject(err);
        })
      });
    },
    getWorkspace(id: string) {
      return this.workspaces.find(item => item.id === id);
    },
    setWorkspace(value: Indexable) {
      this.workspace = value;
    },
    switchWorkspace(value: Indexable, redirect = '/welcome') {
      if (redirect) {
        this.router.push(redirect);

        // switch after redirect completed
        setTimeout(() => {
          this.workspace = value;
          workspaceManager.switchWorkspace(value.id);
        }, 100)
      } else {
        this.workspace = value;
        workspaceManager.switchWorkspace(value.id);
      }
    }
  },
  persist: {
    key: `${CODE}.account`
  }
});
