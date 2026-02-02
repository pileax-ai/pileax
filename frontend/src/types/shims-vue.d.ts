import '@vue/runtime-core'
import { Composer } from 'vue-i18n'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $t: Composer['t']
    $i18n: Composer
  }
}

export {}
