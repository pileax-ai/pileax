import { Dark, Platform, setCssVar } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ipcService } from 'src/api/ipc'

import { THEMES, THEME_COLORS } from 'core/constants/setting'
import { useAppStoreWithOut } from 'stores/app'
import { setDayjsLocale } from 'core/utils/dayjs'
import { setQuasarLang } from 'src/i18n/quasar'
import { getSystemLanguage, getSystemTheme } from 'core/utils/common'

export default function () {
  const appStore = useAppStoreWithOut()
  const i18n = useI18n()

  const setLocale = (locale: string, updateI18n = false) => {
    if (updateI18n) {
      i18n.locale.value = locale
    }
    appStore.setLocale(locale)
    setDayjsLocale(locale)
    setTray()

    // Quasar
    setQuasarLang(locale as 'en')
  }

  const setTimeZone = (timezone: string) => {
    appStore.setTimezone(timezone)
  }

  const setSetting = () => {
    const systemLanguage = getSystemLanguage()
    const systemTheme = getSystemTheme()

    const setting = appStore.getSetting
    const locale = setting.locale || systemLanguage
    setLocale(locale, true)
    setTheme(setting.theme.name || systemTheme)
    setThemeColor(setting.theme.color)
    setThemeGray(setting.theme.gray)
    setThemeWeak(setting.theme.weak)
    setPlatform()
  }

  const setTheme = (name: AppTheme) => {
    let actualName = name
    if (name === 'system') {
      actualName = getSystemTheme()
    }
    const darkMode = (actualName.startsWith('dark'))
    Dark.set(darkMode)

    const theme = THEMES[actualName]
    if (theme) {
      for (const key in theme) {
        const value = theme[key]
        if (value) {
          setCssVar(key, value)
        }
      }
    }

    const themeSetting = appStore.setting.theme
    themeSetting.name = name
    appStore.setTheme(themeSetting)
    ipcService.setTheme(name)
  }

  const toggleTheme = () => {
    const name = Dark.isActive ? 'light':  'dark'
    setTheme(name)
  }

  const setThemeColor = (colorName: string) => {
    const color = THEME_COLORS.find(m => m.name === colorName)
    if (!color) return
    setCssVar('primary', color.value as string)

    const themeSetting = appStore.setting.theme
    themeSetting.color = colorName
    appStore.setTheme(themeSetting)
  }

  const setThemeGray = (gray: boolean) => {
    if (gray) {
      document.body.classList.add('body--gray')
    } else {
      document.body.classList.remove('body--gray')
    }

    const themeSetting = appStore.setting.theme
    themeSetting.gray = gray
    appStore.setTheme(themeSetting)
  }

  const setThemeWeak = (weak: boolean) => {
    if (weak) {
      document.body.classList.add('body--weak')
    } else {
      document.body.classList.remove('body--weak')
    }

    const themeSetting = appStore.setting.theme
    themeSetting.weak = weak
    appStore.setTheme(themeSetting)
  }

  const setPlatform = () => {
    const platform = Platform.is.platform
    document.body.classList.add(`platform-${platform}`)
  }

  const setTray = () => {
    if (process.env.MODE === 'electron') {
      ipcService.updateTrayMenu({
        openApp: i18n.t('tray.openApp'),
        quit: i18n.t('tray.quit')
      })
    }
  }

  const setNavi = (key: string, value: never) => {
    const s = appStore.setting.navi
    s[key as keyof typeof s] = value
    appStore.setNavi(s)

    ipcService.setWindowButton(value)
  }

  const setTabBar = (key: string, value: never) => {
    const s = appStore.setting.tabBar
    s[key as keyof typeof s] = value
    appStore.setTabBar(s)
  }

  const setBreadcrumb = (key: string, value: never) => {
    const s = appStore.setting.breadcrumb
    s[key as keyof typeof s] = value
    appStore.setBreadcrumb(s)
  }

  const setUi = (key: string, value: any) => {
    const s = appStore.setting.ui
    s[key as keyof typeof s] = value
    appStore.setUi(s)
  }

  const setPageTransition = (key: string, value: never) => {
    const s = appStore.setting.pageTransition
    s[key as keyof typeof s] = value
    appStore.setPageTransition(s)
  }

  const setPageLoading = (key: string, value: never) => {
    const s = appStore.setting.pageLoading
    s[key as keyof typeof s] = value
    appStore.setPageLoading(s)
  }

  const toggleNaviFlatten = () => {
    const flatten = !appStore.setting.navi.flatten
    setNavi('flatten', flatten as never)
  }

  const locale = computed(() => {
    return appStore.setting.locale
  })

  const timezone = computed(() => {
    return appStore.setting.timezone
  })

  const setting = computed(() => {
    return appStore.setting
  })

  const theme = computed(() => {
    return appStore.setting.theme
  })

  const ui = computed(() => {
    return appStore.setting.ui
  })

  const darkMode = computed(() => {
    return Dark.isActive
  })

  const navi = computed(() => {
    return appStore.setting.navi
  })

  const tabBar = computed(() => {
    return appStore.setting.tabBar
  })

  const breadcrumb = computed(() => {
    return appStore.setting.breadcrumb
  })

  const pageLoading = computed(() => {
    return appStore.setting.pageLoading
  })

  const pageTransition = computed(() => {
    return appStore.setting.pageTransition
  })

  const themeList = Object.keys(THEMES).map(key => {
    return {
      label: `theme.${key}`,
      value: key,
      color: THEMES[key]['primary']
    }
  })

  const naviFlatten = computed(() => {
    return appStore.setting.navi.flatten
  })

  return {
    locale,
    timezone,
    setting,
    naviFlatten,
    theme,
    themeList,
    darkMode,
    navi,
    tabBar,
    breadcrumb,
    pageTransition,
    pageLoading,
    ui,

    setSetting,
    setLocale,
    setTimeZone,
    setTray,
    toggleNaviFlatten,
    toggleTheme,
    setTheme,
    setThemeColor,
    setThemeGray,
    setThemeWeak,
    setNavi,
    setTabBar,
    setBreadcrumb,
    setPageTransition,
    setPageLoading,
    setUi,
  }
}
