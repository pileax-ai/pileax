import { useComponentStoreWithOut } from 'stores/component'
import OBadge from 'core/components/misc/OBadge.vue'
import { useAppStoreWithOut } from 'stores/app'
import { computed } from 'vue'
import { openURL } from 'quasar'

export default function () {
  const componentStore = useComponentStoreWithOut()
  const appStore = useAppStoreWithOut()

  const locale = computed(() => {
    return appStore.setting.locale
  })

  const tour = computed(() => {
    return appStore.tour
  })

  const showGuide = (
    key: string,
    {
      title = '',
      message = '',
      icon = 'info',
      label = '',
      color = 'blue',
      ok = '',
      alwaysShow = false,
      onCancel = (res: any) => {},
      onOk = (res: any) => {},
    } = {}
  ) => {
    const noShowAgain = tour.value[key]
    if (noShowAgain && !alwaysShow) return

    const messages: Indexable[] = [
      { type: 'html', content: message }
    ]
    if (label) {
      messages.push({
        type: 'component', component: OBadge, props: {
          label: label,
          color: color
        }
      })
    }

    componentStore.setDialog({
      type: 'guide',
      key: key,
      icon: icon,
      title: title,
      message: messages,
      ok: ok,
      onCancel: onCancel,
      onOk: onOk,
    })
  }

  const closeGuide = (name: string) => {
    appStore.closeTour(name)
  }

  const getDocUrl = (path: string) => {
    let url = `${process.env.APP_GUIDE_URL}/${path}`
    if (locale.value.includes('zh')) {
      url = `${process.env.APP_GUIDE_URL}/zh/${path}`
    }
    return url
  }

  const openDocUrl = (path: string) => {
    const url = getDocUrl(path)
    openURL(url)
  }

  const openGuide = (path: string) => {
    openDocUrl(`guide/${path}`)
  }

  return {
    tour,
    showGuide,
    closeGuide,
    openGuide,
    getDocUrl,
    openDocUrl
  }
}

