import { defineStore, DefineStoreOptions, Store } from 'pinia'
import { tenantManager } from './tenant-manager';

// 简单的缓存
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
  factory: (tenantId: string) => any
) => {
  return (tenantId?: string) => {
    const targetTenantId = tenantId || tenantManager.getCurrentTenantId();
    const storeKey = `${storeId}_${targetTenantId}`;

    // 使用缓存
    if (storeCache.has(storeKey)) {
      return storeCache.get(storeKey);
    }

    // 定义store
    const useStore = defineStore(storeKey, () => {
      const state = factory(targetTenantId);

      return {
        ...state,
        $tenantId: targetTenantId,
        $storeId: storeId,
        $storeKey: storeKey
      };
    });

    // 创建并缓存实例
    const storeInstance = useStore();
    storeCache.set(storeKey, storeInstance);

    return storeInstance;
  };
}

export const defineTenantStore = <
  Id extends string,
  S extends object,
  G extends object = {},
  A extends object = {}
>(
  storeId: Id,
  options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>  // 移除id属性，因为我们会自动生成
) => {
  return (tenantId?: string): Store<Id, S, G, A> & {
    $tenantId: string;
    $storeId: string;
  } => {
    const targetTenantId = tenantId || tenantManager.getCurrentTenantId();
    const tenantStoreId = `${storeId}_${targetTenantId}` as Id;
    const storeKey = `${storeId}_${targetTenantId}`;

    if (storeCache.has(storeKey)) {
      return storeCache.get(storeKey) as any;
    }

    // 处理persist配置
    const tenantOptions: DefineStoreOptions<Id, S, G, A> = {
      ...options,
      id: tenantStoreId,  // 在这里添加id
    } as DefineStoreOptions<Id, S, G, A>;

    // 处理persist
    if (options.persist) {
      const newPersist: any = {};
      const originalPersist = options.persist as any;

      if (originalPersist && typeof originalPersist === 'object') {
        Object.keys(originalPersist).forEach(key => {
          if (key === 'key') {
            newPersist[key] = `tenant_${targetTenantId}_${originalPersist[key] || storeId}`;
          } else {
            newPersist[key] = originalPersist[key];
          }
        });
      }

      // 确保key被正确设置
      if (originalPersist && originalPersist.key && !newPersist.key) {
        newPersist.key = `tenant_${targetTenantId}_${originalPersist.key}`;
      } else if (!newPersist.key) {
        newPersist.key = `tenant_${targetTenantId}_${storeId}`;
      }

      tenantOptions.persist = newPersist;
    }

    // 创建store实例
    const useStore = defineStore(tenantStoreId, tenantOptions);
    const storeInstance = useStore();

    // 添加租户信息
    const storeWithTenant = storeInstance as any;
    storeWithTenant.$tenantId = targetTenantId;
    storeWithTenant.$storeId = storeId;

    storeCache.set(storeKey, storeWithTenant);

    return storeWithTenant;
  };
}

// 清理租户缓存
export const clearTenantCache = (tenantId: string): void => {
  const keys = Array.from(storeCache.keys()).filter(key =>
    key.endsWith(`_${tenantId}`)
  );

  keys.forEach(key => {
    storeCache.delete(key);
  });
}
