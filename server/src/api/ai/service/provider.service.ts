import { ServerException } from '@/core/api/exceptions';
import { getLLM } from '@/ai/helpers/llmHelper';
import { logger } from '@/common';

export class ProviderService {

  async getModels(provider: string) {
    try {
      const llm = await getLLM(provider, '');
      const result = await llm.getModels();
      return result.data;
    } catch (err: any) {
      logger.error(err);
      throw new ServerException('ListModel', err.message);
    }
  }

}

export const providerService = new ProviderService();
