/**
 * App Init
 */

import { useAccountStore } from 'stores/account';
import { useApiStore } from 'stores/api';
import { useNaviStore } from 'stores/navi';
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
    if (process.env.MODE === 'electron') {
      const serverInfo = await electronIpc.getServerInfo();
      const apiBase = serverInfo.apiBase || process.env.API_BASE_URL;
      const appBase = serverInfo.appBase || process.env.APP_BASE_URL;
      apiStore.setApiBase(apiBase);
      apiStore.setAppBase(appBase);
    }
    await initAccount();
  } catch (err) {
    console.error('initApi', err);
  }
}

const initAccount = async () => {
  if (process.env.APP_MODE === 'SINGLE') {
    const accountStore = useAccountStore();
    if (!accountStore.isLogin) {
      await accountStore.autoLogin();
    }
  }
}
