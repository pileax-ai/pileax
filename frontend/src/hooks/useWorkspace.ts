import { computed, ref } from 'vue';
import { useAccountStore } from 'stores/account';
import { useTabStore } from 'stores/tab';
import type { TabItem } from 'core/types/menu'

export default function () {
  const accountStore = useAccountStore();
  const tabStore = useTabStore();


  const isLogin = computed(() => {
    return accountStore.accountId !== undefined;
  });

  const workspaces = computed(() => {
    return accountStore.workspaces;
  });

  const workspace = computed(() => {
    return accountStore.workspace;
  });

  const workspaceId = computed(() => {
    return accountStore.workspace.id;
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
    tabStore.updateWorkspace(workspace.id);
  }

  const switchWorkspaceByTab = (tab: TabItem) => {
    const workspace = accountStore.getWorkspace(tab.workspaceId);
    if (workspace) {
      accountStore.switchWorkspace(workspace, '');
    }
  }


  return {
    workspaceId,
    workspace,
    workspaces,

    initWorkspace,
    setWorkspace,
    switchWorkspace,
    switchWorkspaceByTab,
  };
}
