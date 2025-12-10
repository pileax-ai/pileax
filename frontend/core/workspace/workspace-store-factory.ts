import { defineStore, DefineStoreOptions, Store } from 'pinia'
import { workspaceManager } from './workspace-manager';

// Simple store cache
const storeCache = new Map<string, any>();

interface PersistConfig {
  key: string;
  storage?: Storage;
  paths?: string[];
  serializer?: (value: any) => string;
  deserializer?: (value: string) => any;
}

export const createStore = (
  storeId: string,
  factory: (workspaceId: string) => any
) => {
  return (workspaceId?: string) => {
    const targetWorkspaceId = workspaceId || workspaceManager.getCurrentWorkspaceId();
    const storeKey = `${storeId}_${targetWorkspaceId}`;

    // Get from cache
    if (storeCache.has(storeKey)) {
      return storeCache.get(storeKey);
    }

    // Define store
    const useStore = defineStore(storeKey, () => {
      const state = factory(targetWorkspaceId);

      return {
        ...state,
        $workspaceId: targetWorkspaceId,
        $storeId: storeId,
        $storeKey: storeKey
      };
    });

    const storeInstance = useStore();
    storeCache.set(storeKey, storeInstance);

    return storeInstance;
  };
}

export const defineWorkspaceStore = <
  Id extends string,
  S extends object,
  G extends object = {},
  A extends object = {}
>(
  storeId: Id,
  options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>
) => {
  return (workspaceId?: string): Store<Id, S, G, A> & {
    $workspaceId: string;
    $storeId: string;
  } => {
    const targetWorkspaceId = workspaceId || workspaceManager.getCurrentWorkspaceId();
    const workspaceStoreId = `${storeId}_${targetWorkspaceId}` as Id;
    const storeKey = `${storeId}_${targetWorkspaceId}`;

    if (storeCache.has(storeKey)) {
      return storeCache.get(storeKey) as any;
    }

    // 处理persist配置
    const workspaceOptions: DefineStoreOptions<Id, S, G, A> = {
      ...options,
      id: workspaceStoreId,  // 在这里添加id
    } as DefineStoreOptions<Id, S, G, A>;

    // 处理persist
    if (options.persist) {
      const newPersist: any = {};
      const originalPersist = options.persist as any;

      if (originalPersist && typeof originalPersist === 'object') {
        Object.keys(originalPersist).forEach(key => {
          if (key === 'key') {
            newPersist[key] = `${originalPersist[key] || storeId}.ws_${targetWorkspaceId}`;
          } else {
            newPersist[key] = originalPersist[key];
          }
        });
      }

      // 确保key被正确设置
      if (originalPersist && originalPersist.key && !newPersist.key) {
        newPersist.key = `${originalPersist.key}.ws_${targetWorkspaceId}`;
      } else if (!newPersist.key) {
        newPersist.key = `${storeId}.ws_${targetWorkspaceId}`;
      }

      workspaceOptions.persist = newPersist;
    }

    // 创建store实例
    const useStore = defineStore(workspaceStoreId, workspaceOptions);
    const storeInstance = useStore();

    // 添加租户信息
    const storeWithWorkspace = storeInstance as any;
    storeWithWorkspace.$workspaceId = targetWorkspaceId;
    storeWithWorkspace.$storeId = storeId;

    storeCache.set(storeKey, storeWithWorkspace);

    return storeWithWorkspace;
  };
}

export const createWorkspaceStoreWithOut = <T extends (...args: any[]) => any>(
  storeFn: T
) => {
  return () => storeFn() as ReturnType<T>;
};

// 清理租户缓存
export const clearWorkspaceCache = (workspaceId: string): void => {
  const keys = Array.from(storeCache.keys()).filter(key =>
    key.endsWith(`_${workspaceId}`)
  );

  keys.forEach(key => {
    storeCache.delete(key);
  });
}
