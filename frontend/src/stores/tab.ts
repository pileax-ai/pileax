import { defineStore } from 'pinia';
import { CODE } from 'core/app';
import { MenuItem, TabItem } from 'core/types/menu'
import { UUID } from 'core/utils/crypto';
import { store } from 'stores/index';
import { workspaceManager } from 'core/workspace/workspace-manager'

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [] as TabItem[],
    tab: {} as TabItem,
  }),
  getters: {
    pinnedTabs: (state) => state.tabs.filter(t => t.pinned),
    unpinnedTabs: (state) => state.tabs.filter(t => !t.pinned),
  },
  actions: {
    findIndex(id: string) {
      return this.tabs.findIndex(t => t.id === id);
    },
    updateTabs(tabs: TabItem[]) {
      this.tabs = tabs;
    },
    updateTab(menu: TabItem) {
      console.log('updateTab', menu)
      const tab = { ...menu };
      if (this.tab.id) {
        this.updateCurrentTabMeta(tab);
        this.updateTabMetaWithCurrent();
      } else {
        tab.id = UUID();
        tab.workspaceId = workspaceManager.getCurrentWorkspaceId();
        this.tabs.push(tab);
        this.tab = tab;
      }
    },
    updateCurrentTabMeta(tab: TabItem) {
      const { icon, meta, name, path } = tab;
      this.tab = { ...this.tab, icon, meta, name, path };
      const index = this.findIndex(this.tab.id);
      if (index >= 0) {
        this.tabs.splice(index, 1, this.tab);
      }
    },
    updateTabMetaWithCurrent() {
      const { id, icon, meta, name, path } = this.tab;
      this.tabs = this.tabs.map(t =>
        t.id !== id && t.path === path
          ? { ...t, icon, meta, name }
          : t
      );
    },
    updateWorkspace(workspaceId: string) {
      this.tab.workspaceId = workspaceId;
      const index = this.findIndex(this.tab.id);
      if (index >= 0) {
        this.tabs.splice(index, 1, this.tab);
      }
    },
    addNewTab(path = '/welcome') {
      const tab = {
        id: UUID(),
        workspaceId: workspaceManager.getCurrentWorkspaceId(),
        name: 'quickstart',
        path: path
      }
      this.newTab(tab);
    },
    newTab(tab: TabItem) {
      this.tabs.push(tab);
      this.tab = tab;
      this.router.push(tab.path);
    },
    openTab(id: string, path = '') {
      const index = this.findIndex(id);
      if (index >= 0) {
        const tab = this.tabs.at(index);
        if (tab) {
          this.tab = tab;
          if (tab.path !== path) {
            this.router.push(tab.path);
          }

          return tab;
        }
      }
      return null;
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
        if (this.tabs.length === 0) {
          this.tab = { id: '', workspaceId: workspaceManager.getCurrentWorkspaceId(), name: '', path: '' };
          this.router.push('/welcome');
        } else {
          // Open sibling tab if current tab closed.
          if (id === this.tab.id) {
            this.openTab(newId, this.tab.path);
          }
        }
      }
    },
    canCloseOther(id: string) {
      const keepTabs = this.tabs.filter(t => t.id === id || t.pinned);
      return keepTabs.length < this.tabs.length;
    },
    closeOtherTabs(id: string) {
      this.tabs = this.tabs.filter(t => t.id === id || t.pinned);
      if (id !== this.tab.id) {
        this.openTab(id, this.tab.path);
      }
    },
    canCloseRight(id: string) {
      const index = this.findIndex(id);
      const keepTabs = this.tabs.filter((t, i) => i <= index || t.pinned);
      return keepTabs.length < this.tabs.length;
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
    canCloseLeft(id: string) {
      const index = this.findIndex(id);
      const keepTabs = this.tabs.filter((t, i) => i >= index || t.pinned);
      return keepTabs.length < this.tabs.length;
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
