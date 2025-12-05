import { computed, ref } from 'vue';
import { useAccountStore } from 'stores/account';
import { useAiStore } from 'stores/ai';
import { useTabStore } from 'stores/tab';
import { tenantManager } from 'core/tab/tenant-manager'
import { TabItem } from 'core/types/menu'

export default function () {
  const accountStore = useAccountStore();
  const aiStore = useAiStore();
  const tabStore = useTabStore();

  const account = computed(() => {
    return accountStore.account;
  });

  const isLogin = computed(() => {
    return accountStore.accountId !== undefined;
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
      await accountStore.initWorkspaces()
    }
  }

  const setWorkspace = (value: Indexable) => {
    accountStore.setWorkspace(value)
  }

  const switchWorkspace = (workspace: Indexable) => {
    accountStore.switchWorkspace(workspace);
    tabStore.updateTenant(workspace.id);
  }

  const switchWorkspaceByTab = (tab: TabItem) => {
    const workspace = accountStore.getWorkspace(tab.tenantId);
    if (workspace) {
      accountStore.switchWorkspace(workspace, '');
    }
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
    switchWorkspace,
    switchWorkspaceByTab,
  };
}
