import { usePageStoreWithOut } from 'stores/page'
import { computed } from 'vue'


export default function () {
  const store = usePageStoreWithOut()

  const pageStatus = computed(() => {
    return store.status
  })

  const pageData = computed(() => {
    return store.data
  })

  const accessDenied = computed(() => {
    return pageStatus.value === 403
  })

  const globalAccessDenied = computed(() => {
    return pageStatus.value === 403 && pageData.value.scope === 'global'
  })

  const setPageStatus = (status: number, data?: Indexable) => {
    store.setPageStatus(status, data)
  }

  const resetPageStatus = () => {
    store.resetPageStatus()
  }

  return {
    pageStatus,
    pageData,
    accessDenied,
    globalAccessDenied,

    setPageStatus,
    resetPageStatus
  }
}

