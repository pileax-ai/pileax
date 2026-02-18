import { boot } from 'quasar/wrappers'
import { useAppStore } from 'stores/app'
import { useNaviStore } from 'stores/navi'
import { usePageStore } from 'stores/page'
import { startPageLoading, stopPageLoading } from 'src/utils/page'
let routerInstance = null

export default boot(({ router, store }) => {
  routerInstance = router
  const naviStore = useNaviStore(store)
  const appStore = useAppStore(store)
  const pageStore = usePageStore(store)

  router.beforeEach((to, from, next) => {
    // startPageLoading(appStore)
    pageStore.setPageStatus(200)
    console.log('pageStatus: before', pageStore.status)
    next()
  })

  router.afterEach((to, from) => {
    // stopPageLoading(appStore)
    console.log('pageStatus: after', pageStore.status)

    const timeout = appStore.setting.pageTransition.enable ? 200 : 0
    setTimeout(() => {
      naviStore.updateMenu(to)
    }, timeout)
  })
})

export { routerInstance }
