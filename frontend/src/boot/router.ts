import { boot } from 'quasar/wrappers';
import { useNaviStore } from 'stores/navi';
import { useAppStore } from 'stores/app';
import { startPageLoading, stopPageLoading } from 'src/utils/page';
let routerInstance = null;

export default boot(({ router, store }) => {
  routerInstance = router;
  const naviStore = useNaviStore(store);
  const appStore = useAppStore(store);

  router.beforeEach((to, from, next) => {
    startPageLoading(appStore);
    next();
  });

  router.afterEach((to, from) => {
    stopPageLoading(appStore);

    const timeout = appStore.setting.pageTransition.enable ? 200 : 0;
    setTimeout(() => {
      naviStore.updateMenu(to);
    }, timeout);
  });
})

export { routerInstance }
