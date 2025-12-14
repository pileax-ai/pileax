/**
 * App default state
 */
import type { AppState } from 'core/types/app'
import defaultSetting from './default-setting'

export const APP_HOME_URL = 'https://pileax.ai'
export const APP_DOC_URL = 'https://pileax.ai/guide/getting-started'
export const APP_GITHUB_URL = 'https://github.com/pileax-ai/pileax'

export const defaultAppState: AppState = {
  setting: defaultSetting,
  navi: {
    show: true,
    width: 300,
    miniState: false,
  }
}
