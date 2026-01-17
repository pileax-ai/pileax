import { useComponentStoreWithOut } from 'stores/component'
import OBadge from 'core/components/misc/OBadge.vue'
import { useAppStoreWithOut } from 'stores/app'
import { computed } from 'vue'

export default function () {
  const componentStore = useComponentStoreWithOut()
  const appStore = useAppStoreWithOut()

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
      onCancel = (res: any) => {},
      onOk = (res: any) => {},
    } = {}
  ) => {
    const noShowAgain = tour.value[key]
    if (noShowAgain) return

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

  return {
    showGuide,
    closeGuide
  }
}

