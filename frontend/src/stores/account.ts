import { defineStore } from 'pinia';
import {CODE} from 'core/app';
import { POST } from 'src/hooks/useRequest';
import { encryptPassword } from 'src/utils/auth';
import { LoginParams, LoginResultModel } from 'src/api/models/account';
import {getCookieItemObject, removeAllCookies, saveCookieItemObject, saveItem} from 'core/utils/storage';
import { useNaviStore } from 'stores/navi';


export const useAccountStore = defineStore('account', {
  state: () => ({
    account: {} as Indexable,
  }),
  getters: {
    getAccount: (state) => state.account,
    isLogin: (state) => state.account?.id
  },
  actions: {
    loadAccount() {
      const accountInfo = getCookieItemObject('account') as Indexable;
      this.account = accountInfo?.account || {};
    },
    async login(params: LoginParams) {
      try {
        const query = {
          ...params,
          password: encryptPassword(params.password)
        };
        const res = await POST({name: 'authSignin', query: query}) as Indexable;
        return this.afterLogin(res.data);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    afterLogin(result: Indexable, redirect = '/welcome') {
      saveCookieItemObject('account', result);
      this.account = result.user;
      if (redirect) {
        this.router.push(redirect);
      }
      return result.user;
    },
    logout() {
      this.account = {};
      removeAllCookies();
      this.router.push('/');
    }
  },
  persist: {
    key: `${CODE}.account`
  }
});
