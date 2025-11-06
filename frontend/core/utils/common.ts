/**
 * Common
 *
 * @author Xman
 * @version 1.0
 */
import { Platform, Cookies } from 'quasar'
import packageInfo from '../../package.json'
import { getItem, getItemObject } from 'core/utils/storage'
import { getAuthorization, getTenantId } from 'src/utils/auth'

export const getCommonHeaders = () => {
  const platform = Platform.is;
  return {
    'Authorization': getAuthorization(),
    'x-api-version': 'v1',
    'x-project': packageInfo.productName,
    'x-locale': getItem('locale') || 'en',
    'x-os': platform.platform,
    'x-os-version': platform.versionNumber,
    'x-tenant-id': getTenantId(),
  }
}

export const getCommonReport = () => {
  return {
    platform: Platform.is.platform,
    name: name,
    version: packageInfo.version,
  }
}
