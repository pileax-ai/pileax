/**
 * App Init
 */

import { useNaviStore } from 'stores/navi';
import { useApiStore } from 'stores/api';
import useSetting from 'core/hooks/useSetting';
import { electronIpc } from 'src/api/ipc/electron'

export const initApp = () => {
  initApi();
  // initMenu();
  initSetting();
};

const initMenu = () => {
  const naviStore = useNaviStore();
  naviStore.initMenu();
}

const initSetting = () => {
  const { setSetting } = useSetting();
  setSetting();
}

const initApi = async () => {
  const apiStore = useApiStore();

  try {
    const serverInfo = await electronIpc.getServerInfo();
    const baseURL = serverInfo.baseURL || process.env.API_BASE_URL;

    apiStore.setBaseURL(baseURL || process.env.API_BASE_URL || '');
  } catch (err) {
    console.error('initApi', err);
  }
}
