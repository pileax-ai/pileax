import { openURL } from 'quasar'
import type { Router} from 'vue-router'
import { useRouter } from 'vue-router'
import { unref } from 'vue'
import { router } from 'src/router'
import { MenuActionEnum } from 'core/constants/menuEnum'

export const onAction = (action :Action) => {
  // console.log('onAction', action);
  switch (action.action) {
    case MenuActionEnum.SYSTEM_BROWSER:
    case 'link':
      openURL(action.link || '')
      break
    case 'modal':
      break
    case MenuActionEnum.ROUTE:
    case 'route':
    default:
      router.push(action.path)
      break
  }
}

export const openPath = (path :string) => {
  if (path.indexOf('http') >= 0) {
    openURL(path)
  } else {
    router.push(path)
  }
}

export const openUrl = (url :string) => {
  if (url?.indexOf('http') >= 0) {
    openURL(url)
  }
}

/**
 * Refresh page
 * todo: refresh
 */
export const refresh = (_router?: Router) => {
  const r = _router ?? router
  const route = unref(r.currentRoute.value)
  const { name, params = {}, query = {}, fullPath } = route
  console.log('refresh', name, params)

  return new Promise((resolve) => {
    if (name) {
      r.replace({ name, params, query }).then(() => resolve(true))
    } else {
      r.replace(fullPath).then(() => resolve(true))
    }
  })
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
