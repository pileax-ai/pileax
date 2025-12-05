export interface TenantInfo {
  id: string;
  name: string;
  icon?: string;
}

export class TenantManager {
  private static instance: TenantManager;
  private currentTenantId: string = 'default';

  private tenants: Map<string, TenantInfo> = new Map();

  private constructor() {
    this.init();
  }

  static getInstance(): TenantManager {
    if (!TenantManager.instance) {
      TenantManager.instance = new TenantManager();
    }
    return TenantManager.instance;
  }

  private init(): void {
    const savedTenant = sessionStorage.getItem('current_tenant');
    if (savedTenant) {
      this.currentTenantId = savedTenant;
    }

    console.log(`Init tenant manager，current tenant: ${this.currentTenantId}`);
  }

  getCurrentTenantId(): string {
    return this.currentTenantId;
  }

  getCurrentTenant(): TenantInfo {
    return this.tenants.get(this.currentTenantId) || this.tenants.get('default')!;
  }

  getTenants(): TenantInfo[] {
    return Array.from(this.tenants.values());
  }

  setTenants(list: TenantInfo[]) {
    this.tenants = new Map(list.map(item => [item.id, item]));
    console.log('setTenants', this.tenants)
  }

  setDefaultTenant(value: TenantInfo) {
    if (!this.tenants.has(value.id)) {
      console.warn(`租户 ${value.id} 不存在`);
      return;
    }
    this.tenants.set('default', value);
    this.currentTenantId = 'default';
    sessionStorage.setItem('current_tenant', 'default');
    console.log(`Default tenant: ${value.id}`);
  }

  switchTenant(tenantId: string): void {
    if (tenantId === this.currentTenantId) {
      return;
    }
    if (!this.tenants.has(tenantId)) {
      console.warn(`Tenant ${tenantId} does not exist.`);
      return;
    }

    const oldTenantId = this.currentTenantId;
    this.currentTenantId = tenantId;

    // Todo: Persist to sessionStorage
    sessionStorage.setItem('current_tenant', tenantId);

    console.log(`租户已切换: ${oldTenantId} → ${tenantId}`);
  }

  // Remove tenant
  removeTenant(tenantId: string): void {
    if (tenantId !== 'default') {
      this.tenants.delete(tenantId);
    }
  }
}

export const tenantManager = TenantManager.getInstance();
