/**
 * App Init
 */

import { useAccountStore } from 'stores/account';
import { useApiStore } from 'stores/api';
import { useNaviStore } from 'stores/navi';
import useSetting from 'core/hooks/useSetting';

export const initApp = () => {
  initApi();
  // initMenu();
  initSetting();
};

export const reloadApp = async () => {
  await initApi()
  if (process.env.MODE === 'electron') {
    await window.electronAPI.reload(true);
  }
}

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
    await apiStore.resetServer()
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
