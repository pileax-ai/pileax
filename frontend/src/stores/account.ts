import { defineStore } from 'pinia';
import {CODE} from 'core/app';
import { saveAccount } from 'src/utils/auth'
import { LoginParams } from 'src/api/models/account';
import {
  clearUserCache,
  getItemObject,
} from 'core/utils/storage'
import { authService } from 'src/api/service/remote/auth'
import { workspaceService } from 'src/api/service/remote/workspace'

export const useAccountStore = defineStore('account', {
  state: () => ({
    account: {} as Indexable,
    workspaces: [] as Indexable[],
    workspace: {} as Indexable,
  }),
  getters: {
    isLogin: (state) => state.account?.id
  },
  actions: {
    loadAccount() {
      const accountInfo = getItemObject('user') as Indexable;
      this.account = accountInfo.user || {};
    },
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
      // console.log('login', result)
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
    getWorkspaces() {
      return new Promise((resolve, reject) => {
        workspaceService.getWorkspaces().then(res => {
          this.workspaces = res
          if (!this.workspace?.id && this.workspaces.length) {
            this.setWorkspace(this.workspaces[0]!)
          }
          resolve(res)
        }).catch((err: any) => {
          reject(err);
        })
      });

    },
    setWorkspace(value: Indexable) {
      this.workspace = value
    }
  },
  persist: {
    key: `${CODE}.account`
  }
});
