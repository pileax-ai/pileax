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
    mode: defaultAppState.mode,
    setting: defaultAppState.setting,
    navi: defaultAppState.navi,
    updater: {} as Indexable,
    tour: {} as Indexable,
  }),
  getters: {
    getSetting: (state) => state.setting,
    getNavi: (state) => state.navi,
  },
  actions: {
    setMode(value :string) {
      this.mode = value
    },
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
    setUpdater(key: string, value?: any) {
      switch (key) {
        case 'init':
          this.updater = {
            ignore: this.updater.ignore
          }
          break
        case 'checking':
          this.updater.checking = true
          break
        case 'notAvailable':
          this.updater = {
            checking: false,
            notAvailable: true
          }
          break
        case 'ignore':
          this.updater.ignore = this.updater.info?.version
          break
        case 'info':
          this.updater = {
            checking: false,
            info: value
          }
          break
        case 'provider':
          this.updater.provider = value
          break
        case 'progress':
          this.updater.progress = value
          break
        case 'downloaded':
          this.updater.downloaded = true
          break
      }
    },
    closeTour(name: string) {
      this.tour[name] = true
    }
  },
  persist: {
    key: `${CODE}.app`
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
