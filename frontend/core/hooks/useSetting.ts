import { Dark, Platform, setCssVar } from 'quasar';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ipcService } from 'src/api/ipc';

import { THEMES, THEME_COLORS } from 'core/constants/setting';
import { useAppStore } from 'stores/app';
import {
  BreadcrumbSetting,
  NaviSetting,
  PageLoadingSetting,
  PageTransitionSetting,
  TabBarSetting,
  ThemeSetting
} from 'core/types/setting';

export default function () {
  const appStore = useAppStore();
  const i18n = useI18n();

  const setLocale = (locale :string, updateI18n = false) => {
    if (updateI18n) {
      i18n.locale.value = locale;
    }
    appStore.setLocale(locale);
    setTray();
  }

  const setSetting = () => {
    const setting = appStore.getSetting;
    const locale = setting.locale || 'en';
    setLocale(locale, true);
    setTheme(setting.theme.name);
    setThemeColor(setting.theme.color);
    setThemeGray(setting.theme.gray);
    setThemeWeak(setting.theme.weak);
    setPlatform();
  }

  const setTheme = (name :string) => {
    const darkMode = (name === 'dark');
    Dark.set(darkMode);

    const theme = THEMES[name];
    if (theme) {
      for (const key in theme) {
        const value = theme[key];
        if (value) {
          setCssVar(key, value);
        }
      }
    }

    const themeSetting = appStore.setting.theme;
    themeSetting.name = name;
    appStore.setTheme(themeSetting);
    ipcService.setTheme(name as 'system' | 'light' | 'dark');
  }

  const toggleTheme = () => {
    const name = Dark.isActive ? 'light' : 'dark';
    setTheme(name);
  }

  const setThemeColor = (colorName :string) => {
    const color = THEME_COLORS.find(m => m.name === colorName);
    if (!color) return;
    setCssVar('primary', color.value as string);

    const themeSetting = appStore.setting.theme as ThemeSetting;
    themeSetting.color = colorName;
    appStore.setTheme(themeSetting);
  }

  const setThemeGray = (gray :boolean) => {
    if (gray) {
      document.body.classList.add('body--gray');
    } else {
      document.body.classList.remove('body--gray');
    }

    const themeSetting = appStore.setting.theme as ThemeSetting;
    themeSetting.gray = gray;
    appStore.setTheme(themeSetting);
  }

  const setThemeWeak = (weak :boolean) => {
    if (weak) {
      document.body.classList.add('body--weak');
    } else {
      document.body.classList.remove('body--weak');
    }

    const themeSetting = appStore.setting.theme as ThemeSetting;
    themeSetting.weak = weak;
    appStore.setTheme(themeSetting);
  }

  const setPlatform = () => {
    const platform = Platform.is.platform;
    document.body.classList.add(`platform-${platform}`);
  }

  const setTray = () => {
    if (process.env.MODE === 'electron') {
      ipcService.updateTrayMenu({
        openApp: i18n.t('tray.openApp'),
        quit: i18n.t('tray.quit')
      })
    }
  }

  const setNavi = (key :string, value :never) => {
    const s = appStore.setting.navi as NaviSetting;
    s[key as keyof typeof s] = value;
    appStore.setNavi(s);
  }

  const setTabBar = (key :string, value :never) => {
    const s = appStore.setting.tabBar as TabBarSetting;
    s[key as keyof typeof s] = value;
    appStore.setTabBar(s);
  }

  const setBreadcrumb = (key :string, value :never) => {
    const s = appStore.setting.breadcrumb as BreadcrumbSetting;
    s[key as keyof typeof s] = value;
    appStore.setBreadcrumb(s);
  }

  const setPageTransition = (key :string, value :never) => {
    const s = appStore.setting.pageTransition as PageTransitionSetting;
    s[key as keyof typeof s] = value;
    appStore.setPageTransition(s);
  }

  const setPageLoading = (key :string, value :never) => {
    const s = appStore.setting.pageLoading as PageLoadingSetting;
    s[key as keyof typeof s] = value;
    appStore.setPageLoading(s);
  }

  const toggleNaviFlatten = () => {
    const flatten = !appStore.setting.navi.flatten;
    setNavi('flatten', flatten as never);
  }

  const locale = computed(() => {
    return appStore.setting.locale;
  });

  const setting = computed(() => {
    return appStore.setting;
  });

  const theme = computed(() => {
    return appStore.setting.theme;
  });

  const darkMode = computed(() => {
    return Dark.isActive;
  });

  const navi = computed(() => {
    return appStore.setting.navi;
  });

  const tabBar = computed(() => {
    return appStore.setting.tabBar;
  });

  const breadcrumb = computed(() => {
    return appStore.setting.breadcrumb;
  });

  const pageLoading = computed(() => {
    return appStore.setting.pageLoading;
  });

  const pageTransition = computed(() => {
    return appStore.setting.pageTransition;
  });

  const themeList = Object.keys(THEMES).map(key => {
    return {
      label: `theme.${key}`,
      value: key,
      color: THEMES[key]['primary']
    };
  });

  const naviFlatten = computed(() => {
    return appStore.setting.navi.flatten;
  });

  return {
    locale,
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

    setSetting,
    setLocale,
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
  };
}
