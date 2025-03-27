export interface ThemeSetting {
  name: string,
  color: string,
  weak: boolean,
  gray: boolean
}

export interface NaviSetting {
  layout: string,
  expandMode: string,
  flatten: boolean,
}

export interface TabBarSetting {
  enable: boolean,
  position: string,
  style: string,
}

export interface BreadcrumbSetting {
  enable: boolean,
  icon: boolean,
  style: string,
}

export interface PageLoadingSetting {
  enable: boolean,
  loading: boolean,
}

export interface PageTransitionSetting {
  enable: boolean,
  name: string,
}

export interface Setting {
  locale: string;
  theme: ThemeSetting,
  navi: NaviSetting,
  tabBar: TabBarSetting,
  breadcrumb: BreadcrumbSetting,
  pageLoading: PageLoadingSetting,
  pageTransition: PageTransitionSetting
}
