export interface WorkspaceInfo {
  id: string;
  name: string;
  icon?: string;
}

export class WorkspaceManager {
  private static instance: WorkspaceManager;
  private currentWorkspaceId: string = 'default';

  private workspaces: Map<string, WorkspaceInfo> = new Map();

  private constructor() {
    this.init();
  }

  static getInstance(): WorkspaceManager {
    if (!WorkspaceManager.instance) {
      WorkspaceManager.instance = new WorkspaceManager();
    }
    return WorkspaceManager.instance;
  }

  private init(): void {
    const savedWorkspace = sessionStorage.getItem('current_workspace');
    if (savedWorkspace) {
      this.currentWorkspaceId = savedWorkspace;
    }

    console.log(`Init workspace manager，current workspace: ${this.currentWorkspaceId}`);
  }

  getCurrentWorkspaceId(): string {
    return this.currentWorkspaceId;
  }

  getCurrentWorkspace(): WorkspaceInfo {
    return this.workspaces.get(this.currentWorkspaceId) || this.workspaces.get('default')!;
  }

  getWorkspaces(): WorkspaceInfo[] {
    return Array.from(this.workspaces.values());
  }

  setWorkspaces(list: WorkspaceInfo[]) {
    this.workspaces = new Map(list.map(item => [item.id, item]));
    console.log('setWorkspaces', this.workspaces)
  }

  setDefaultWorkspace(value: WorkspaceInfo) {
    if (!this.workspaces.has(value.id)) {
      console.warn(`租户 ${value.id} 不存在`);
      return;
    }
    this.workspaces.set('default', value);
    this.currentWorkspaceId = 'default';
    sessionStorage.setItem('current_workspace', 'default');
    console.log(`Default workspace: ${value.id}`);
  }

  switchWorkspace(workspaceId: string): void {
    if (workspaceId === this.currentWorkspaceId) {
      return;
    }
    if (!this.workspaces.has(workspaceId)) {
      console.warn(`Workspace ${workspaceId} does not exist.`);
      return;
    }

    const oldWorkspaceId = this.currentWorkspaceId;
    this.currentWorkspaceId = workspaceId;

    // Todo: Persist to sessionStorage
    sessionStorage.setItem('current_workspace', workspaceId);

    console.log(`租户已切换: ${oldWorkspaceId} → ${workspaceId}`);
  }

  // Remove workspace
  removeWorkspace(workspaceId: string): void {
    if (workspaceId !== 'default') {
      this.workspaces.delete(workspaceId);
    }
  }
}

export const workspaceManager = WorkspaceManager.getInstance();
