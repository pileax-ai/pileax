import { computed, ref } from 'vue';
import { useAccountStore } from 'stores/account';
import { useAiStore } from 'stores/ai';

export default function () {
  const accountStore = useAccountStore();
  const aiStore = useAiStore();

  const account = computed(() => {
    return accountStore.account;
  });

  const isLogin = computed(() => {
    return accountStore.account.id !== undefined;
  });

  // workspace
  const workspace = computed(() => {
    return accountStore.workspace;
  });
  const workspaces = computed(() => {
    return accountStore.workspaces;
  });

  const initWorkspace = async () => {
    if (isLogin.value) {
      await accountStore.getWorkspaces()
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

    // Todo: reset stores
    accountStore.$reset();
    aiStore.$reset();
  }

  return {
    accountStore,
    account,
    isLogin,
    workspace,
    workspaces,

    logout,
    setAccount,
    initWorkspace,
    setWorkspace,
  };
}
