import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  ConfigSchema,
  ConfigBodySchema,
  ScopeSchema, ConfigListBodySchema, ConfigListSchema,
} from '@/api/system/model/config.model'
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';

import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { configController as controller } from '../controller/config.controller';

export const api = () => {}
export const registry = new OpenAPIRegistry();
const pathBase = `/system/config`;
const apiPathBase = `${apiBase}${pathBase}`;

registry.register('Config', ConfigSchema);

/**
 * Save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: ['Config'],
  request: { body: ConfigBodySchema },
  responses: createApiResponse(ConfigSchema, 'Success'),
});
apiRouter.post(`${pathBase}`,
  validateBody(ConfigSchema.partial()), controller.save);

/**
 * Save All
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/all`,
  tags: ['Config'],
  request: { body: ConfigListBodySchema },
  responses: createApiResponse(EmptySchema, 'Success'),
});
apiRouter.post(`${pathBase}/all`,
  validateBody(z.array(ConfigSchema.partial())), controller.saveAll);

/**
 * get
 */
registry.registerPath({
	method: 'get',
  path: `${apiPathBase}`,
	tags: ['Config'],
	request: { query: StringIdSchema.shape.query },
	responses: createApiResponse(ConfigSchema, 'Success'),
});
apiRouter.get(`${pathBase}`,
  validateRequest(StringIdSchema), controller.get);

/**
 * getAll
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}/all`,
  tags: ['Config'],
  request: { query: ScopeSchema.shape.query },
  responses: createApiResponse(z.array(ConfigSchema), 'Success'),
});
apiRouter.get(`${pathBase}/all`, validateRequest(ScopeSchema), controller.getAll);

/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: ['Config'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(EmptySchema, 'Success'),
});
apiRouter.delete(`${pathBase}`,
  validateRequest(StringIdSchema), controller.delete);

/**
 * query
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/query`,
  tags: ['Config'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(ConfigSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`,
  validateRequest(QuerySchema), controller.query);

export {
  api as systemConfigApi,
  registry as systemConfigRegistry
}
