import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import { CODE } from 'core/app'
import type { MenuItem, TabItem } from 'core/types/menu'
import { GET } from 'src/hooks/useRequest'
import { flattenMenu, nestMenu } from 'core/hooks/useMenu'
import { defaultConsoleMenus } from 'src/app/default-menu'
import { useTabStore } from 'stores/tab'
import { computed, ref } from 'vue'

export const useNaviStore = defineStore('navi', () => {
  const leftDrawer = ref<Indexable>({
    show: true,
    hoverShow: false,
    width: 300,
    miniState: false,
    activity: '',
  })
  const rightDrawer = ref<Indexable>({
    show: true,
    hoverShow: false,
    width: 300,
    miniState: false,
  })
  const menus = ref<MenuItem[]>([])
  const consoleMenus = ref<MenuItem[]>([])
  const openedMenus = ref<MenuItem[]>([])
  const starMenus = ref<MenuItem[]>([])
  const currentMenu = ref<MenuItem>({
    id: '',
    name: '',
    path: ''
  })

  const getActivity = computed(() => leftDrawer.value.activity)
  const getMenus = computed(() => menus.value)
  const getFavoriteMenus = computed(() => menus.value.filter(e => e.favorite === 1))
  const getConsoleMenus = computed(() => {
    const list = menus.value.filter(e => e.type && e.type < 10 && e.isShow === 1)
    if (list.length === 0) {
      return defaultConsoleMenus
    }
    return nestMenu(list)
  })

  function toggleLeftDrawer() {
    leftDrawer.value.show = !leftDrawer.value.show
  }
  function setLeftDrawerItem(kv: KeyValue) {
    leftDrawer.value[kv.key] = kv.value
  }
  function toggleRightDrawer() {
    rightDrawer.value.show = !rightDrawer.value.show
  }
  function setRightDrawerItem(kv: KeyValue) {
    rightDrawer.value[kv.key] = kv.value
  }
  function initMenu() {
    try {
      const list: MenuItem[] = []
      menus.value = flattenMenu(defaultConsoleMenus, '', list)
    } catch (err) {
      menus.value = []
    }
  }
  function updateMenu(route: RouteLocationNormalized) {
    // console.log('updateMenu', route);
    const path = route.path
    const menu = menus.value.find(e => e.path === path)
    if (menu) {
      setCurrentMenu(menu)
    }
  }
  function setCurrentMenu(menu: MenuItem) {
    console.log('currentMenu', menu)
    const newMenu = {} as MenuItem
    currentMenu.value = newMenu
    if (menu.path) {
      addOpenedMenu(menu)
    }
    const tabStore = useTabStore()
    tabStore.updateTab(menu as TabItem)
  }
  function addOpenedMenu(menu: MenuItem) {
    const index = openedMenus.value.findIndex((e: MenuItem) => e.path === menu.path)
    // console.log('add', menu);
    if (index < 0) {
      openedMenus.value.unshift(menu)
    } else {
      openedMenus.value.splice(index, 1, menu)
    }
  }

  return {
    leftDrawer,
    rightDrawer,
    menus,
    consoleMenus,
    openedMenus,
    starMenus,
    currentMenu,
    getActivity,
    getMenus,
    getFavoriteMenus,
    getConsoleMenus,
    toggleLeftDrawer,
    toggleRightDrawer,
    setLeftDrawerItem,
    setRightDrawerItem,
    initMenu,
    updateMenu,
    setCurrentMenu,
    addOpenedMenu
  }
})
