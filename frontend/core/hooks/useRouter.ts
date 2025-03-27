import { openURL } from 'quasar';
import { Router, useRouter } from 'vue-router';
import { unref } from 'vue';
import { router } from 'src/router';
import { MenuActionEnum } from 'core/constants/menuEnum';

export const onAction = (action :Action) => {
  // console.log('onAction', action);
  switch (action.action) {
    case MenuActionEnum.SYSTEM_BROWSER:
    case 'link':
      openURL(action.link || '');
      break;
    case 'modal':
      break;
    case MenuActionEnum.ROUTE:
    case 'route':
    default:
      router.push(action.path);
      break;
  }
}

export const openPath = (path :string) => {
  if (path.indexOf('http') >= 0) {
    openURL(path);
  } else {
    router.push(path);
  }
}

export const openUrl = (url :string) => {
  if (url?.indexOf('http') >= 0) {
    openURL(url);
  }
}

/**
 * Refresh page
 * todo: refresh
 */
export const refresh = (_router?: Router) => {
  const { replace, currentRoute } = router;
  const { query, params = {}, name, fullPath } = unref(currentRoute.value);

  return new Promise((resolve) => {
    console.log('refresh', currentRoute);
    replace({ name: name, params, query }).then(() => resolve(true));
  });
}

export default function () {
  return {
    router,

    refresh,
    onAction,
    openPath,
    openUrl,
  }
}
