import { Config, ConfigList } from '@/api/system/model/config.model';
import { ConfigRepository } from '@/api/system/repo/config.repository';
import { BaseService } from '@/core/api/base.service';
import { setEnvVariable } from '@/common/utils/envConfig';

export class ConfigService extends BaseService<Config, ConfigRepository>{

	constructor() {
		super(new ConfigRepository());
	}

  async getAll(scope: string) {
    return this.repo.getAll(scope);
  }

  async save(data: Config) {
    const result = await super.save(data);
    const {scope, owner, key, value} = data;
    if (scope === 'system') {
      setEnvVariable(key, value);
    }

    return result;
  }

  async saveAll(list: ConfigList) {
    for (const item of list) {
      const {scope, owner, key, value} = item;
      const config = await this.repo.findByOwnerAndKey(owner, key);
      if (config) {
        item.id = config.id;
        await this.repo.update(item);
      } else {
        await this.repo.create(item);
      }

      if (scope === 'system') {
        setEnvVariable(key, value);
      }
    }
  }

  async deleteByOwner(owner: string) {
    return this.repo.deleteByOwner(owner);
  }

}

export const configService = new ConfigService();
