import { defineStore } from 'pinia'
import { store } from 'stores/index'
import type {
  BreadcrumbSetting,
  NaviSetting,
  PageLoadingSetting,
  PageTransitionSetting,
  TabBarSetting,
  ThemeSetting
} from 'core/types/setting'
import { CODE } from 'core/app'

import type { AppState } from 'core/types/app'
import { defaultAppState } from 'src/app/app'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    setting: defaultAppState.setting,
    navi: defaultAppState.navi,
    updater: {} as Indexable
  }),
  getters: {
    getSetting: (state) => state.setting,
    getNavi: (state) => state.navi,
  },
  actions: {
    setLocale(value :string) {
      this.setting.locale = value
    },
    setTimezone(value :string) {
      this.setting.timezone = value
    },
    setTheme(theme :ThemeSetting) {
      this.setting.theme = theme
    },
    setNavi(navi :NaviSetting) {
      this.setting.navi = navi
    },
    setTabBar(tabBar :TabBarSetting) {
      this.setting.tabBar = tabBar
    },
    setBreadcrumb(breadcrumb :BreadcrumbSetting) {
      this.setting.breadcrumb = breadcrumb
    },
    setPageLoading(pageLoading :PageLoadingSetting) {
      this.setting.pageLoading = pageLoading
    },
    setPageTransition(pageTransition :PageTransitionSetting) {
      this.setting.pageTransition = pageTransition
    },
    setUpdater(value: Indexable) {
      this.updater = {
        ...this.updater,
        ...value
      }
    }
  },
  persist: {
    key: `${CODE}.app`
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
