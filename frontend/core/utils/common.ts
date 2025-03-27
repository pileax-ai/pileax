/**
 * Common
 *
 * @author Xman
 * @version 1.0
 */
import { Platform, Cookies } from 'quasar'
import packageInfo from '../../package.json'
import { getCookieItemObject, getItem } from 'core/utils/storage'

export const getCommonHeaders = () => {
  const platform = Platform.is;
  const accountInfo = getCookieItemObject('account') as Indexable;
  return {
    'Authorization': accountInfo.token,
    'x-api-version': 'v1',
    'x-project': packageInfo.code,
    'x-locale': getItem('locale') || 'en',
    'x-api-key': 'apiKey', // ToDo
    'x-signed-query': 'signedQuery', // ToDo
    'x-os': platform.platform,
    'x-os-version': platform.versionNumber,
  }
}

export const getCommonReport = () => {
  return {
    platform: Platform.is.platform,
    name: name,
    version: packageInfo.version,
  }
}
