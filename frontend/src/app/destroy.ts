/**
 * App Destroy
 */

import { useApiStore } from 'stores/api'
import { useAccountStore } from 'stores/account'

export const destroyApp = () => {
  resetApi()
}

export const resetApi = async () => {
  const apiStore = useApiStore()
  apiStore.stopCheckConnectivity()

  console.error('resetApi')
}

export const resetAccount = async () => {
  try {
    const accountStore = useAccountStore()
    await accountStore.logout({ redirect: '' })
  } catch (err) {
    console.error(err)
  }
}

