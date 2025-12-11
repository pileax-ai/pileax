/**
 * Page
 *
 * @version 1.0
 */
import { LoadingBar } from 'quasar';

// ================================================================================
// Page Loading
// ================================================================================
export const startPageLoading = async (store: any) => {
  LoadingBar.setDefaults({
    color: 'blue-5',
    size: '2px',
    hijackFilter (url) {
      return /^https:\/\/my-service\.com/.test(url);
    }
  });

  await setPageLoading(store, true);
  setTimeout(() => {
    const pageLoading = store.setting.pageLoading;
    // console.log('page loading', pageLoading);

    // Don't show if page loaded in 100ms.
    if (pageLoading.enable && pageLoading.loading) {
      // console.log('start page loading');
      LoadingBar.start();
    }
  }, 100);
}

export const stopPageLoading = async (store: any) => {
  await setPageLoading(store, false);
  LoadingBar.stop();
}

export const setPageLoading = async (store: any, value :boolean) => {
  const pageLoading = store.setting.pageLoading;
  pageLoading.loading = value;
  await store.setPageLoading(pageLoading);
}
