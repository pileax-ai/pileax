import { Setting } from 'core/types/setting';

export interface AppState {
  setting: Setting,
  navi: {
    show: boolean,
    width: number,
    miniState: boolean,
  },
}
