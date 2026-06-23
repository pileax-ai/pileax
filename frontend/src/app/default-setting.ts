/**
 * App default settings
 */
export default {
  locale: '',
  timezone: 'Asia/Shanghai',
  theme: {
    name: '' as AppTheme,
    color: 'blue',
    weak: false,
    gray: false
  },
  navi: {
    layout: 'group',
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
