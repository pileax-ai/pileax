/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, PUT } from 'src/hooks/useRequest'

export class SystemSettingService {
  private apiName = 'systemSetting'


  async getSettings(): Promise<any> {
    return GET({ name: this.apiName, path: '/settings' })
  }

  async setSettingItem(key: string, value: any) {
    return PUT({ name: this.apiName, path: '/item', body: { key, value } })
  }

}

export const systemSettingService = new SystemSettingService()
