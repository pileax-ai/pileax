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

  function logout(api :string) {
    accountStore.logout();
  }

  return {
    account,
    isLogin,

    logout,
    setAccount,
  };
}
