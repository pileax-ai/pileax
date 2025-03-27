import { defineStore } from 'pinia';
import { store } from 'stores/index';
import {CODE} from 'core/app';
import {POST} from 'src/hooks/useRequest';
import { QueryResultModel } from 'src/api/models/common';

export const useDictStore = defineStore('dict', {
  state: () => ({
    roleOptions: [] as OptionValue[],
    tgbArticleOptions: [] as OptionValue[],
    tgbUserOptions: [] as OptionValue[],
  }),
  getters: {
    getRoleOptions: (state) => state.roleOptions,
  },
  actions: {
    initRoleOptions() {
      POST({name: 'roleQuery', body: {condition: {status: 1}}}).then(res => {
        const data = res as QueryResultModel;
        this.roleOptions = data.list.map(e => {
          return {label: e.name, value: e.id};
        });
      });
    },
    initTgbArticleOptions() {
      POST({name: 'tgbArticle', path: '/query', body: {condition: {status: 1}}}).then(res => {
        const data = res as QueryResultModel;
        this.tgbArticleOptions = data.list.map(e => {
          return {label: e.title, value: e.id};
        });
      });
    },
    initTgbUserOptions() {
      POST({name: 'tgbUser', path: '/query', body: {condition: {type: 'kol'}}}).then(res => {
        const data = res as QueryResultModel;
        this.tgbUserOptions = data.list.map(e => {
          return {label: e.name, value: e.id};
        });
      });
    }
  },
  persist: {
    key: `${CODE}.dict`
  }
});

export const useDictStoreWithOut = () => {
  return useDictStore(store);
}
