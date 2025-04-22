import { defineStore } from 'pinia';
import { CODE } from 'core/app';
import { MenuItem } from 'core/types/menu';

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [] as MenuItem[],
    tabIndex: -1,
  }),
  getters: {
    tab: (state) => state.tabs.at(state.tabIndex),
  },
  actions: {
    updateTab(tab: MenuItem) {
      if (this.tabIndex < 0) {
        this.tabs.push(tab);
        this.tabIndex = 0;
      } else {
        this.tabs.splice(this.tabIndex, 1, tab);
      }
    },
    addNewTab() {
      this.tabs.push({
        name: 'welcome',
        path: '/'
      });
      this.tabIndex = this.tabs.length - 1;
      this.router.push('/');
    },
    openTab(index: number) {
      const tab = this.tabs.at(index);
      if (tab) {
        this.tabIndex = index;
        this.router.push(tab.path);
      }
    },
    togglePinTab(tab: MenuItem) {
      tab.pin = !tab.pin;
    },
    duplicateTab(index: number) {
      const tab = this.tabs.at(index);
      if (tab) {
        this.tabs.splice(index, 0, tab);
        this.openTab(index + 1);
      }
    },
    closeTab(index: number) {
      this.tabs.splice(index, 1);
      if (index === this.tabIndex) {
        this.openTab(this.tabs.length - 1);
      }
    },
    closeOtherTabs(index: number) {
      const tab = this.tabs.at(index);
      if (tab) {
        this.tabs = [tab];
        this.openTab(0);
      }
    },
    closeRightTabs(index: number) {
      const length = this.tabs.length;
      if (index >= 0 && length > (index + 1)) {
        const menus = this.tabs;
        menus.splice(index + 1, length - index - 1)
        this.tabs = menus;
        this.openTab(index);
      }
    },
    closeLeftTabs(index: number) {
      const length = this.tabs.length;
      if (index > 0) {
        const menus = this.tabs;
        menus.splice(0, index)
        this.tabs = menus;
        this.openTab(0);
      }
    },
  },
  persist: {
    key: `${CODE}.tab`,
    storage: sessionStorage,
  }
});
