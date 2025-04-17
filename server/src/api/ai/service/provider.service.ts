import { ServerException } from '@/core/api/exceptions';
import { getLLM } from '@/ai/helpers/llmHelper';
import { logger } from '@/common';

export class ProviderService {

  async getModels(provider: string) {
    try {
      const llm = await getLLM(provider, '');
      const result = await llm.getModels();
      switch (provider) {
        case 'deepseek':
        case 'openai':
          return result.data;
        case 'ollama':
          return result.models;
        default:
          throw new ServerException('ListModel', 'Provider not supported');
      }
    } catch (err: any) {
      logger.error(err);
      throw new ServerException('ListModel', err.message);
    }
  }

}

export const providerService = new ProviderService();
