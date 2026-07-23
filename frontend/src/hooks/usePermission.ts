import { usePageStoreWithOut } from 'stores/page'
import { computed, ComputedRef } from 'vue'
import { checkPermission } from 'src/utils/permission'


export default function () {
  const pageStore = usePageStoreWithOut()

  const pageStatus = computed(() => {
    return pageStore.status
  })

  const pageData = computed(() => {
    return pageStore.data
  })

  const accessDenied = computed(() => {
    return pageStatus.value === 403
  })

  const globalAccessDenied = computed(() => {
    return pageStatus.value === 403 && pageData.value.scope === 'global'
  })

  const setPageStatus = (status: number, data?: Indexable) => {
    pageStore.setPageStatus(status, data)
  }

  const resetPageStatus = () => {
    pageStore.resetPageStatus()
  }

  /**
   * Check permission reactively or within logic
   *
   * @param permissions - Array of roles or permissions
   */
  const hasPermission = (permissions: string | string[]): ComputedRef<boolean> => {
    const searchList = Array.isArray(permissions)
      ? permissions
      : [permissions]
    return computed((): boolean => checkPermission(searchList))
  }

  const hasReadPermission = () => {
    return hasPermission(['owner', 'admin', 'editor', 'normal']).value
  }

  const hasEditPermission = () => {
    return hasPermission(['owner', 'admin', 'editor']).value
  }

  const hasAdminPermission = () => {
    return hasPermission(['owner', 'admin']).value
  }

  return {
    pageStatus,
    pageData,
    accessDenied,
    globalAccessDenied,

    setPageStatus,
    resetPageStatus,
    hasPermission,
    hasReadPermission,
    hasEditPermission,
    hasAdminPermission
  }
}

