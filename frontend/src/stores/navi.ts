import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { MenuItem } from 'core/types/menu';
import { GET } from 'src/hooks/useRequest';
import { flattenMenu, nestMenu } from 'core/hooks/useMenu';
import { defaultConsoleMenus } from 'src/app/default-menu';
import { RouteLocationNormalized } from 'vue-router';
import { UUID } from 'core/utils/crypto'

export const useNaviStore = defineStore('navi', {
  state: () => ({
    leftDrawer: {
      show: true,
      hoverShow: false,
      width: 300,
      miniState: false,
      activity: '',
    } as Indexable,
    rightDrawer: {
      show: true,
      hoverShow: false,
      width: 300,
      miniState: false,
    } as Indexable,
    menus: [] as MenuItem[],
    consoleMenus: [] as MenuItem[],
    openedMenus: [] as MenuItem[],
    starMenus: [] as MenuItem[],
    currentMenu: {} as MenuItem,
    tabs: [] as MenuItem[],
    currentTab: {} as MenuItem,
  }),
  getters: {
    getActivity: (state) => state.leftDrawer.activity,
    getMenus: (state) => state.menus,
    getFavoriteMenus: (state) => state.menus.filter(e => e.favorite === 1),
    getConsoleMenus: (state) => {
      const menus = state.menus.filter(e => e.type && e.type < 10 && e.isShow === 1);
      if (menus.length === 0) {
        return defaultConsoleMenus;
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
    async initMenu() {
      try {
        const menus: MenuItem[] = [];
        this.menus = flattenMenu(defaultConsoleMenus, '', menus);
      } catch (err) {
        this.menus = [];
      }
    },
    async initMenu0() {
      try {
        this.menus = await this.fetchMenu();
      } catch (err) {
        this.menus = [];
      }
    },
    fetchMenu(): Promise<MenuItem[]> {
      return new Promise((resolve, reject) => {
        GET({name: 'systemMenuQueryApp'}).then(res => {
          resolve(res as MenuItem[]);
        }).catch(error => {
          reject(error);
        });
      });
    },
    updateMenu(route: RouteLocationNormalized) {
      // console.log('updateMenu', route);
      const path = route.path;
      const menu = this.menus.find(e => e.path === path);
      if (menu) {
        this.setCurrentMenu(menu);
      }
    },
    setCurrentMenu(menu: MenuItem) {
      // console.log('currentMenu', menu);
      this.currentMenu = menu;
      if (menu.path) {
        this.addOpenedMenu(menu);
      }
    },
    addOpenedMenu(menu: MenuItem) {
      const index = this.openedMenus.findIndex((e: MenuItem) => e.path === menu.path);
      // console.log('add', menu);
      if (index < 0) {
        this.openedMenus.push(menu);
      } else {
        this.openedMenus.splice(index, 1, menu);
      }
    },
    closeOpenedMenu(menu: MenuItem) {
      const index = this.openedMenus.findIndex((e: MenuItem) => e.path === menu.path);
      if (index >= 0) {
        this.openedMenus.splice(index, 1);

        if (menu.path === this.currentMenu.path) {
          let latestPath = '/welcome';
          if (this.openedMenus.length) {
            latestPath = this.openedMenus?.slice(-1).length
              ? this.openedMenus?.slice(-1)[0]?.path ?? ''
             :  '';
          }
          this.router.push(latestPath);
        }
      }
    },
    closeOtherOpenedMenu(menu: MenuItem) {
      const index = this.openedMenus.findIndex((e: MenuItem) => e.path === menu.path);
      if (index >= 0) {
        this.openedMenus = [menu];
        this.router.push(menu.path);
      }
    },
    closeRightOpenedMenu(menu: MenuItem) {
      const index = this.openedMenus.findIndex((e: MenuItem) => e.path === menu.path);
      const length = this.openedMenus.length;
      if (index >= 0 && length > (index + 1)) {
        const menus = this.openedMenus;
        menus.splice(index + 1, length - index - 1)
        this.openedMenus = menus;
        this.router.push(menu.path);
      }
    },
    starMenu(menu: MenuItem) {
      const index = this.starMenus.findIndex((e: MenuItem) => e.path === menu.path);
      if (index < 0) {
        this.starMenus.push(menu);
      }
    },
    unstarMenu(menu: MenuItem) {
      const index = this.starMenus.findIndex((e: MenuItem) => e.path === menu.path);
      if (index >= 0) {
        this.starMenus.splice(index, 1);
      }
    },
    clearStarMenus() {
      this.starMenus = [];
    },
    getTabIndex(tab: MenuItem) {
      return this.tabs.findIndex((e: MenuItem) => e.id === tab.id);
    },
    updateTab(route: RouteLocationNormalized) {
      const path = route.path;
      const menu = this.menus.find(e => e.path === path);
      if (menu) {
        this.openTab(menu, false);
      }
    },
    openTab(tab: MenuItem, push = true) {
      if (!this.currentTab.id) {
        this.currentTab = this.addTab(tab);
      } else {
        if (!tab.id) {
          tab.id = UUID();
        }
        const index = this.getTabIndex(this.currentTab);
        if (index >= 0) {
          this.tabs.splice(index, 1, tab);
          this.currentTab = tab;
        } else {
          this.currentTab = this.addTab(tab);
        }
      }
      if (push) {
        this.router.push(tab.path);
      }
    },
    addTab(tab: MenuItem) {
      if (!tab.id) {
        tab.id = UUID();
        this.tabs.push(tab);
      } else {
        const index = this.getTabIndex(tab);
        if (index < 0) {
          this.tabs.push(tab);
        }
      }
      return tab;
    },
    togglePinTab(tab: MenuItem) {
      tab.pin = !tab.pin;
    },
    closeTab(tab: MenuItem) {
      const index = this.tabs.findIndex((e: MenuItem) => e.id === tab.id);
      if (index >= 0) {
        this.tabs.splice(index, 1);
      }
    },
    closeOtherTabs(tab: MenuItem) {
      const index = this.tabs.findIndex((e: MenuItem) => e.id === tab.id);
      if (index >= 0) {
        this.tabs = [tab];
        this.openTab(tab);
      }
    },
    closeRightTabs(tab: MenuItem) {
      const index = this.getTabIndex(tab);
      const length = this.openedMenus.length;
      if (index >= 0 && length > (index + 1)) {
        const menus = this.tabs;
        menus.splice(index + 1, length - index - 1)
        this.tabs = menus;
        this.openTab(tab);
      }
    },
    closeLeftTabs(tab: MenuItem) {
      const index = this.getTabIndex(tab);
      const length = this.openedMenus.length;
      if (index > 0) {
        const menus = this.tabs;
        menus.splice(0, index - 1)
        this.tabs = menus;
        this.openTab(tab);
      }
    },
  },
  persist: {
    key: `${CODE}.navi`
  }
});

// export const useNaviStoreWithOut = () => {
//   return useNaviStore(store);
// }
