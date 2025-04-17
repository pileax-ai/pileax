import { configService } from '@/api/system/service/config.service';
import { logger } from '@/common';
import { setEnvVariable } from '@/common/utils/envConfig';

export const configLoader = () => {
    configService.getAll('system').then(res => {
    for (const item of res) {
      setEnvVariable(item.key, item.value);
    }
    logger.info(`✅ Load system config from database. [${res.length}]`);
  })
}
