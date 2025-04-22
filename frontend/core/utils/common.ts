/**
 * Common
 *
 * @author Xman
 * @version 1.0
 */
import { Platform, Cookies } from 'quasar'
import packageInfo from '../../package.json'
import { getItem, getItemObject } from 'core/utils/storage'

export const getCommonHeaders = () => {
  const platform = Platform.is;
  const accountInfo = getItemObject('user') as Indexable;
  return {
    'Authorization': accountInfo.token,
    'x-api-version': 'v1',
    'x-project': packageInfo.productName,
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
