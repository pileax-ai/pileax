import { useAccountStore } from 'src/stores/account'

/**
 * Common logic to check if user has required permissions
 * @param requiredPermissions - Array of roles or permissions
 * @returns boolean
 */
export function checkPermission(requiredPermissions: string[]): boolean {
  const accountStore = useAccountStore()
  const userPermissions = accountStore.workspace.memberRole?.split(',')

  if (!userPermissions || !Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
    return true
  }

  return userPermissions.some((perm: string) => requiredPermissions.includes(perm))
}
