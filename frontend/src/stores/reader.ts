import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { MenuItem } from 'core/types/menu';
import { defaultReaderMenus } from 'src/app/default-reader-menu';
import { nestMenu } from 'core/hooks/useMenu';

export const useReaderStore = defineStore('reader', {
  state: () => ({
    leftDrawer: {
      show: true,
      hoverShow: false,
      width: 300,
      activity: '',
    } as Indexable,
    rightDrawer: {
      show: true,
      hoverShow: false,
      width: 300,
      split: false
    } as Indexable,
    menus: [] as MenuItem[],
    consoleMenus: [] as MenuItem[],
    queryTimer: 0
  }),
  getters: {
    getActivity: (state) => state.leftDrawer.activity,
    getConsoleMenus: (state) => {
      const menus = state.menus.filter(e => e.type && e.type < 10 && e.isShow === 1);
      if (menus.length === 0) {
        return defaultReaderMenus;
      }
      return nestMenu(menus);
    },
  },
  actions: {
    toggleLeftDrawer() {
      this.leftDrawer.show = !this.leftDrawer.show;
    },
    setLeftDrawerItem(kv: KeyValue) {
      this.leftDrawer[kv.key] = kv.value;
    },
    toggleRightDrawer() {
      this.rightDrawer.show = !this.rightDrawer.show;
    },
    setRightDrawerItem(kv: KeyValue) {
      this.rightDrawer[kv.key] = kv.value;
    },
    setQueryTimer(time: number) {
      this.queryTimer = time;
    },
  },
  persist: {
    key: `${CODE}.reader`
  }
});

export const useReaderStoreWithOut = () => {
  return useReaderStore(store);
}
