import { defineStore } from 'pinia';
import { CODE } from 'core/app';
import { MenuItem } from 'core/types/menu';
import { UUID } from 'core/utils/crypto';
import { store } from 'stores/index';

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [] as MenuItem[],
    tab: {} as MenuItem,
  }),
  getters: {
    pinnedTabs: (state) => state.tabs.filter(t => t.pinned),
    unpinnedTabs: (state) => state.tabs.filter(t => !t.pinned),
  },
  actions: {
    findIndex(id: string) {
      return this.tabs.findIndex(t => t.id === id);
    },
    updateTab(menu: MenuItem) {
      const tab = { ...menu };
      if (this.tab.id) {
        tab.id = this.tab.id;
        const index = this.findIndex(this.tab.id);
        if (index >= 0) {
          this.tabs.splice(index, 1, tab);
          this.tab = tab;
        }
      } else {
        tab.id = UUID();
        this.tabs.push(tab);
        this.tab = tab;
      }
      console.log('updateTab', tab);
    },
    addNewTab(path = '/') {
      const tab = {
        id: UUID(),
        name: '',
        path: path
      }
      this.tabs.push(tab);
      this.tab = tab;
      this.router.push(path);
    },
    openTab(id: string, path = '') {
      const index = this.findIndex(id);
      console.log('open', index, path);
      if (index >= 0) {
        const tab = this.tabs.at(index);
        if (tab) {
          this.tab = tab;
          if (tab.path !== path) {
            this.router.push(tab.path);
          }
        }
      }
    },
    togglePinTab(id: string) {
      const tab = this.tabs.find(t => t.id === id);
      if (tab) {
        tab.pinned = !tab.pinned;
      }
    },
    duplicateTab(id: string) {
      const index = this.findIndex(id);
      const tab = this.tabs.at(index);
      if (index >= 0 && tab) {
        const newTab = { ...tab, id: UUID() };
        this.tabs.splice(index + 1, 0, newTab);
        if (this.tab.path === newTab.path) {
          this.tab = newTab;
        } else {
          this.openTab(newTab.id);
        }
      }
    },
    closeTab(id: string) {
      const index = this.findIndex(id);
      if (index >= 0) {
        // Get sibling tab id
        let newId = '';
        if (index === 0) { // Next
          if (this.tabs.length > 1) {
            newId = this.tabs.at(index + 1)!.id;
          }
        } else { // Previous
          newId = this.tabs.at(index - 1)!.id;
        }

        this.tabs.splice(index, 1);

        // Open sibling tab if current tab closed.
        if (id === this.tab.id) {
          this.openTab(newId, this.tab.path);
        }
      }
    },
    closeOtherTabs(id: string) {
      this.tabs = this.tabs.filter(t => t.id === id || t.pinned);
      if (id !== this.tab.id) {
        this.openTab(id, this.tab.path);
      }
    },
    closeRightTabs(id: string) {
      const index = this.findIndex(id);
      const tab = this.tabs.at(index);
      if (index >= 0 && tab) {
        this.tabs = this.tabs.filter((t, i) => i <= index || t.pinned);
        if (id !== this.tab.id) {
          this.openTab(id, this.tab.path);
        }
      }
    },
    closeLeftTabs(id: string) {
      const index = this.findIndex(id);
      const tab = this.tabs.at(index);
      if (index > 0 && tab) {
        this.tabs = this.tabs.filter((t, i) => i >= index || t.pinned);
        if (id !== this.tab.id) {
          this.openTab(id, this.tab.path);
        }
      }
    },
  },
  persist: {
    key: `${CODE}.tab`,
    storage: sessionStorage,
  }
});

export const useTabStoreWithOut = () => {
  return useTabStore(store);
}
