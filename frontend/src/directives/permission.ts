/**
 * Permission
 *
 * @version 1.0
 */

import { Directive, DirectiveBinding, watch, WatchStopHandle } from 'vue'
import { checkPermission } from 'src/utils/permission'
import { useAccountStore } from 'src/stores/account'
import { useWorkspaceStore } from 'src/stores/workspace'

interface PermissionElement extends HTMLElement {
  _unwatch?: WatchStopHandle;
}

export const hasPermission: Directive = {
  mounted(el: PermissionElement, binding: DirectiveBinding) {
    const accountStore = useAccountStore()
    const workspaceStore = useWorkspaceStore()

    el._unwatch = watch(
      () => workspaceStore.workspace?.memberRole,
      () => {
        const hasAuth = checkPermission(binding.value)
        // Use visibility or display to handle reactivity safely
        el.style.display = hasAuth ? '' : 'none'
      },
      { immediate: true, deep: true }
    )
  },

  unmounted(el: HTMLElement) {
    // Clean up to prevent memory leaks
    if ((el as any)._unwatch) {
      (el as any)._unwatch()
    }
  }
}
