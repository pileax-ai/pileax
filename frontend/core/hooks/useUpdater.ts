import { computed } from 'vue'
import { useAppStoreWithOut } from 'stores/app'


export default function () {
  const appStore = useAppStoreWithOut()

  const updater = computed(() => {
    return appStore.updater
  })

  const setUpdater = (value: Indexable) => {
    appStore.setUpdater(value)
  }

  return {
    updater,
    setUpdater,
  }
}
