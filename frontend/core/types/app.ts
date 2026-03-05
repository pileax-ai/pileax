import type { Setting } from 'core/types/setting'

export interface AppState {
  setting: Setting,
  navi: {
    show: boolean,
    width: number,
    miniState: boolean,
  },
  updater: {
    checking?: boolean,
    downloaded?: boolean,
    ignore?: string,
    info?: Indexable,
    provider?: string,
    notAvailable?: boolean,
    progress?: Indexable,
  },
  tour: Indexable,
}
