import { getItemObject, getSessionItem, saveSessionItem } from 'core/utils/storage'

export interface WorkspaceInfo {
  id: string;
  name: string;
  icon?: string;
}

const cacheKey = `workspace`

export class WorkspaceManager {
  private static instance: WorkspaceManager
  private currentWorkspaceId: string = 'default'

  private workspaces: Map<string, WorkspaceInfo> = new Map()

  private constructor() {
    this.init()
  }

  static getInstance(): WorkspaceManager {
    if (!WorkspaceManager.instance) {
      WorkspaceManager.instance = new WorkspaceManager()
    }
    return WorkspaceManager.instance
  }

  private init(): void {
    const savedWorkspace = getSessionItem(cacheKey)
    if (savedWorkspace) {
      this.currentWorkspaceId = savedWorkspace as string
    }

    console.log(`Init workspace manager，current workspace: ${this.currentWorkspaceId}`)
  }

  getCurrentWorkspaceId(): string {
    return this.currentWorkspaceId
  }

  getCurrentWorkspace(): WorkspaceInfo {
    return this.workspaces.get(this.currentWorkspaceId) || this.workspaces.get('default')!
  }

  getWorkspaces(): WorkspaceInfo[] {
    return Array.from(this.workspaces.values())
  }

  setWorkspaces(list: WorkspaceInfo[]) {
    this.workspaces = new Map(list.map(item => [item.id, item]))
    // console.log('setWorkspaces', this.workspaces)
  }

  switchWorkspace(workspaceId: string): void {
    if (workspaceId === this.currentWorkspaceId) {
      return
    }
    if (!this.workspaces.has(workspaceId)) {
      console.warn(`Workspace ${workspaceId} does not exist.`)
      return
    }

    const oldWorkspaceId = this.currentWorkspaceId
    this.currentWorkspaceId = workspaceId

    // Persist to sessionStorage
    saveSessionItem(cacheKey, workspaceId)

    console.log(`Workspace switched: ${oldWorkspaceId} → ${workspaceId}`)
  }

  loadWorkspace(): void {
    const account = getItemObject('account') as Indexable
    const workspace = account.workspace
    const workspaceId = workspace?.id || ''
    saveSessionItem(cacheKey, workspaceId)
  }

  // Remove workspace
  removeWorkspace(workspaceId: string): void {
    if (workspaceId !== 'default') {
      this.workspaces.delete(workspaceId)
    }
  }
}

export const workspaceManager = WorkspaceManager.getInstance()
