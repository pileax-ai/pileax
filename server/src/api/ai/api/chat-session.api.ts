import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ChatSessionSchema, ChatSessionBodySchema } from '@/api/ai/model/chat-session.model';
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { chatSessionController as controller } from '../controller/chat-session.controller';

const api = () => {};
const registry = new OpenAPIRegistry();
const pathBase = `/chat/session`
const apiPathBase = `${apiBase}${pathBase}`

registry.register('ChatSession', ChatSessionSchema);

/**
 * save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: ['ChatSession'],
  request: { body: ChatSessionBodySchema },
  responses: createApiResponse(ChatSessionSchema, 'Success'),
});
apiRouter.post(`${pathBase}`, validateBody(ChatSessionSchema.partial()), controller.save);

/**
 * get
 */
registry.registerPath({
	method: 'get',
  path: `${apiPathBase}`,
	tags: ['ChatSession'],
	request: { query: StringIdSchema.shape.query },
	responses: createApiResponse(ChatSessionSchema, 'Success'),
});
apiRouter.get(`${pathBase}`, validateRequest(StringIdSchema), controller.get);


/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: ['ChatSession'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(EmptySchema, 'Success'),
});
apiRouter.delete(`${pathBase}`, validateRequest(StringIdSchema), controller.delete);

/**
 * query
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/query`,
  tags: ['ChatSession'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(ChatSessionSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`, validateRequest(QuerySchema), controller.query);

export {
  api as chatSessionApi,
  registry as chatSessionRegistry
}
