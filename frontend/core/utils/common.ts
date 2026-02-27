/**
 * Common
 *
 * @author Xman
 * @version 1.0
 */
import { Platform } from 'quasar'
import packageInfo from '../../package.json'
import { getAuthorization, getDeviceId, getLocale, getWorkspaceId } from 'src/utils/auth'

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
