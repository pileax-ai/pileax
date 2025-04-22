import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  KnowledgeSchema,
  KnowledgeBodySchema,
} from '@/api/knowledge/model/knowledge.model';
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';

import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { knowledgeController as controller } from '../controller/knowledge.controller';

export const api = () => {}
export const registry = new OpenAPIRegistry();
const tag = 'Knowledge';
const pathBase = `/knowledge`;
const apiPathBase = `${apiBase}${pathBase}`;

registry.register('Knowledge', KnowledgeSchema);

/**
 * Save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: [tag],
  request: { body: KnowledgeBodySchema },
  responses: createApiResponse(KnowledgeSchema, 'Success'),
});
apiRouter.post(`${pathBase}`,
  validateBody(KnowledgeSchema.partial()), controller.save);

/**
 * Update
 */
registry.registerPath({
  method: 'put',
  path: `${apiPathBase}`,
  tags: [tag],
  request: { body: KnowledgeBodySchema },
  responses: createApiResponse(KnowledgeSchema, 'Success'),
});
apiRouter.put(`${pathBase}`,
  validateBody(KnowledgeSchema.partial()), controller.save);

/**
 * getAll
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}/all`,
  tags: [tag],
  responses: createApiResponse(z.array(KnowledgeSchema), 'Success'),
});
apiRouter.get(`${pathBase}/all`, controller.getAll);

/**
 * get
 */
registry.registerPath({
	method: 'get',
  path: `${apiPathBase}`,
	tags: [tag],
	request: { query: StringIdSchema.shape.query },
	responses: createApiResponse(KnowledgeSchema, 'Success'),
});
apiRouter.get(`${pathBase}`,
  validateRequest(StringIdSchema), controller.get);

/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: [tag],
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
  tags: [tag],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(KnowledgeSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`,
  validateRequest(QuerySchema), controller.query);

export {
  api as knowledgeApi,
  registry as knowledgeRegistry
}
