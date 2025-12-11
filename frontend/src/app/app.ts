/**
 * App default state
 */
import type { AppState } from 'core/types/app'
import defaultSetting from './default-setting'

export const APP_HOME_URL = 'https://pileax.dev'
export const APP_DOC_URL = 'https://doc.pileax.dev'
export const APP_GITHUB_URL = 'https://github.com/pileax/pileax-quasar-admin'
export const TGB_URL = 'https://www.taoguba.com.cn'

export const defaultAppState: AppState = {
  setting: defaultSetting,
  navi: {
    show: true,
    width: 300,
    miniState: false,
  }
}
