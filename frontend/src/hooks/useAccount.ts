import { computed, ref } from 'vue';
import { useAccountStore } from 'stores/account';

export default function () {
  const accountStore = useAccountStore();

  const account = computed(() => {
    return accountStore.account;
  });

  const isLogin = computed(() => {
    return accountStore.account.id !== undefined;
  });

  function setAccount(value: Indexable) {
    accountStore.setAccount(value);
  }

  async function autoLogin() {
    await accountStore.autoLogin();
  }

  function logout() {
    accountStore.logout();
  }

  return {
    accountStore,
    account,
    isLogin,

    autoLogin,
    logout,
    setAccount,
  };
}
