
import { useNaviStore } from 'stores/navi';
import { computed } from 'vue';
import { findMenuByPath } from 'core/hooks/useMenu';
import { MenuItem } from 'core/types/menu';

export default function () {
  const naviStore = useNaviStore();

  const menus = computed(() => {
    return naviStore.menus;
  });

  const consoleMenus = computed(() => {
    return naviStore.getConsoleMenus;
  });

  const openedMenus = computed(() => {
    return naviStore.openedMenus;
  });

  const favoriteMenus = computed(() => {
    return naviStore.getFavoriteMenus;
  });

  const starMenus = computed(() => {
    return naviStore.starMenus;
  });

  const currentMenu = computed(() => {
    return naviStore.currentMenu;
  });

  const activity = computed(() => {
    return naviStore.getActivity;
  });

  const leftDrawer = computed(() => {
    return naviStore.leftDrawer;
  });

  const leftDrawerShow = computed(() => {
    return naviStore.leftDrawer.show;
  });

  const leftDrawerHoverShow = computed(() => {
    return naviStore.leftDrawer.hoverShow;
  });

  const leftDrawerMiniState = computed(() => {
    return naviStore.leftDrawer.miniState;
  });

  const rightDrawer = computed(() => {
    return naviStore.rightDrawer;
  });

  const rightDrawerShow = computed(() => {
    return naviStore.rightDrawer.show;
  });

  const rightDrawerHoverShow = computed(() => {
    return naviStore.rightDrawer.hoverShow;
  });

  function setActivity(value :string) {
    naviStore.setLeftDrawerItem({key: 'activity', value: value});
  }

  function reduceActivity(path :string) {
    let activity = 'start';
    const menus = naviStore.menus;
    let menu = findMenuByPath(path);
    if (menu) {
      activity = menu.name;
      while (menu?.parentId) {
        menu = menus.find(e => e.id === menu.parentId) as MenuItem;
        if (menu) {
          activity = menu.name;
        }
      }
    }
    // console.log('reduce', path, menus);
    // console.log('reduce', activity);
    return activity;
  }

  function findTopConsoleMenu(name :string) {
    const menu = consoleMenus.value.find(e => e.name === name);
    return menu || {};
  }

  function closeOpenedMenu(menu :MenuItem) {
    naviStore.closeOpenedMenu(menu);
  }

  function unstarMenu(menu :MenuItem) {
    naviStore.unstarMenu(menu);
  }

  function clearStarMenus() {
    naviStore.clearStarMenus();
  }

  function toggleLeftDrawer() {
    naviStore.toggleLeftDrawer();
  }

  function toggleLeftMiniState() {
    const value = !naviStore.leftDrawer.miniState;
    naviStore.setLeftDrawerItem({key: 'miniState', value: value});
  }

  function setLeftDrawerHoverShow(value: boolean) {
    naviStore.setLeftDrawerItem({key: 'hoverShow', value: value});
  }

  function onLeftDrawerEnter() {
    setLeftDrawerHoverShow(true);
  }

  function onLeftDrawerLeave() {
    if (leftDrawerHoverShow.value) {
      setLeftDrawerHoverShow(false);
    }
  }

  function toggleRightDrawer() {
    naviStore.toggleRightDrawer();
  }

  function setRightDrawerHoverShow(value: boolean) {
    naviStore.setRightDrawerItem({key: 'hoverShow', value: value});
  }

  return {
    menus,
    consoleMenus,
    openedMenus,
    favoriteMenus,
    starMenus,
    currentMenu,
    activity,
    leftDrawer,
    leftDrawerShow,
    leftDrawerHoverShow,
    leftDrawerMiniState,
    rightDrawer,
    rightDrawerShow,
    rightDrawerHoverShow,

    setActivity,
    reduceActivity,
    findTopConsoleMenu,
    closeOpenedMenu,
    clearStarMenus,
    unstarMenu,
    toggleLeftDrawer,
    setLeftDrawerHoverShow,
    toggleLeftMiniState,
    onLeftDrawerEnter,
    onLeftDrawerLeave,
    toggleRightDrawer,
    setRightDrawerHoverShow,
  };
}
