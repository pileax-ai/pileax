import { computed, ref } from 'vue';
import { useAccountStore } from 'stores/account';
import { useTabStore } from 'stores/tab';
import { TabItem } from 'core/types/menu'

export default function () {
  const accountStore = useAccountStore();
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
      accountStore.initWorkspaces().then(res => {
        const defaultWorkspaceId = (res as Indexable).id;
        if (defaultWorkspaceId) {
          tabStore.updateWorkspace(defaultWorkspaceId);
        }
      })
    }
  }

  const setWorkspace = (value: Indexable) => {
    accountStore.setWorkspace(value)
  }

  const switchWorkspace = (workspace: Indexable) => {
    accountStore.switchWorkspace(workspace);
    tabStore.updateWorkspace(workspace.id);
  }

  const switchWorkspaceByTab = (tab: TabItem) => {
    const workspace = accountStore.getWorkspace(tab.workspaceId);
    if (workspace) {
      accountStore.switchWorkspace(workspace, '');
    }
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
