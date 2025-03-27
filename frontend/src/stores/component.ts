import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';

export const useComponentStore = defineStore('component', {
  state: () => ({
    dialog: {
      type: '',
      icon: '',
      title: '',
      message: '',
      showOk: true,
      showCancel: false,
      onOk: () => {
        return;
      },
    } as Indexable,
  }),
  getters: {
    getDialog: (state) => state.dialog,
  },
  actions: {
    setDialog(dialog :Indexable) {
      this.dialog = dialog;
    },
  },
  persist: {
    key: `${CODE}.component`
  }
});

export const useComponentStoreWithOut = () => {
  return useComponentStore(store);
}
