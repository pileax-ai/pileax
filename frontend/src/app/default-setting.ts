/**
 * App default settings
 */
export default {
  locale: 'en',
  timezone: 'Asia/Shanghai',
  theme: {
    name: 'light',
    color: 'blue',
    weak: false,
    gray: false
  },
  navi: {
    layout: 'tab',
    expandMode: 'default',
    flatten: false
  },
  tabBar: {
    enable: true,
    position: 'top',
    style: 'square',
  },
  breadcrumb: {
    enable: true,
    icon: false,
    style: 'default',
  },
  pageLoading: {
    enable: true,
    loading: false
  },
  pageTransition: {
    enable: false,
    name: 'fade'
  }
}
