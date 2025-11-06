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

  const initWorkspace = () => {
    if (isLogin.value) {
      accountStore.getWorkspaces()
    }
  }

  const setWorkspace = (value: Indexable) => {
    accountStore.setWorkspace(value)
  }

  function setAccount(value: Indexable) {
    accountStore.setAccount(value);
  }

  function logout() {
    accountStore.logout();
  }

  return {
    accountStore,
    account,
    isLogin,

    logout,
    setAccount,
    initWorkspace,
    setWorkspace,
  };
}
