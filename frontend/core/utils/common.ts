/**
 * Common
 *
 * @author Xman
 * @version 1.0
 */
import { Platform } from 'quasar'
import packageInfo from '../../package.json'
import { getAuthorization, getDeviceId, getLocale, getWorkspaceId } from 'src/utils/auth'
import { Locales } from 'core/constants/metadata'

export const getCommonHeaders = () => {
  const platform = Platform.is
  return {
    'Authorization': getAuthorization(),
    'x-api-version': 'v1',
    'x-project': packageInfo.productName,
    'x-locale': getLocale(),
    'x-os': platform.platform,
    'x-os-version': platform.versionNumber,
    'x-workspace-id': getWorkspaceId(),
    'x-device-id': getDeviceId(),
  }
}

export const getSystemLanguage = () => {
  const lang = navigator.language?.toLowerCase()

  if (lang) {
    const locale = Locales.find(item =>
      item.value.toLowerCase() === lang || item.locale.toLowerCase() === lang)
    if (locale) {
      return locale.value
    }
  }

  return 'en-US'
}

export const getSystemTheme = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDarkMode ? 'dark' : 'light' as AppTheme
}
