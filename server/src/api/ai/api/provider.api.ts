import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ProviderSchema } from '@/api/ai/model/provider.model';
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { providerController, providerController as controller } from '../controller/provider.controller'

const api = () => {};
const registry = new OpenAPIRegistry();
const pathBase = `/ai/provider`;
const apiPathBase = `${apiBase}${pathBase}`;

registry.register('Provider', ProviderSchema);

/**
 * get all
 */
registry.registerPath({
	method: 'get',
  path: `${apiPathBase}/all`,
	tags: ['Provider'],
	responses: createApiResponse(ProviderSchema, 'Success'),
});
apiRouter.get(`${pathBase}/all`, controller.getAll);

registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/all`,
  tags: ['Provider'],
  responses: createApiResponse(ProviderSchema, 'Success'),
});
apiRouter.post(`${pathBase}/all`, controller.getAll);

/**
 * get models
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}/models`,
  tags: ['Provider'],
  request: {
    query: z.object({
      provider: z.string().default('openai')
    })
  },
  responses: createApiResponse(ProviderSchema, 'Success'),
});
apiRouter.get(`${pathBase}/models`, controller.getModels);

/**
 * get models
 */
registry.registerPath({
  description: 'Disable provider and remove its configs.',
  method: 'delete',
  path: `${apiPathBase}/disable`,
  tags: ['Provider'],
  request: {
    query: z.object({
      provider: z.string().default('openai')
    })
  },
  responses: createApiResponse(ProviderSchema, 'Success'),
});
apiRouter.delete(`${pathBase}/disable`, controller.disable);

export {
  api as providerApi,
  registry as providerRegistry
}
