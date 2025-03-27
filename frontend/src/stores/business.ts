import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { POST } from 'src/hooks/useRequest';
import { QueryResultModel } from 'src/api/models/common';

export const useBusinessStore = defineStore('business', {
  state: () => ({
    roleOptions: [] as OptionValue[],
    stockAccountOptions: [] as OptionValue[],
    stockTradeStrategyOptions: [] as OptionValue[],
  }),
  actions: {
    initRoleOptions() {
      POST({name: 'role', path: '/query', body: {condition: {status: 1}}}).then(res => {
        const data = res as QueryResultModel;
        this.roleOptions = data.list.map(e => {
          return {label: e.name, value: e.id};
        });
      });
    },
  }
});

export const useBusinessStoreWithOut = () => {
  return useBusinessStore(store);
}
