import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  ChatCompletionSchema,
  ChatCompletionBodySchema,
  ChatCompletionResponseSchema, ChatSchema, ChatBodySchema,
} from '@/api/ai/model/chat.model'
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { chatController as controller } from '../controller/chat.controller';

export const api = () => {}
export const registry = new OpenAPIRegistry();
const pathBase = `/chat`
const apiPathBase = `${apiBase}${pathBase}`

registry.register('Chat', ChatSchema);

/**
 * save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: ['Chat'],
  request: { body: ChatBodySchema },
  responses: createApiResponse(ChatSchema, 'Success'),
});
apiRouter.post(`${pathBase}`, validateBody(ChatSchema.partial()), controller.save);

/**
 * get
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}`,
  tags: ['Chat'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(ChatSchema, 'Success'),
});
apiRouter.get(`${pathBase}`,
  validateRequest(StringIdSchema), controller.get);

registry.registerPath({
  description: 'Get all',
  method: 'get',
  path: `${apiPathBase}/all`,
  tags: ['Chat'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(z.array(ChatSchema), 'Success'),
});
apiRouter.get(`${pathBase}/all`,
  validateRequest(StringIdSchema), controller.findAll);

/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: ['Chat'],
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
  tags: ['Chat'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(ChatSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`,
  validateRequest(QuerySchema), controller.query);

registry.registerPath({
  description: 'Create chat completions',
  method: 'post',
  path: `${apiPathBase}/completions`,
  tags: ['Chat'],
  request: { body: ChatCompletionBodySchema },
  responses: createApiResponse(ChatCompletionResponseSchema, 'Success'),
});
apiRouter.post(`${pathBase}/completions`,
  validateBody(ChatCompletionSchema), controller.chatCompletion);

export {
  api as chatApi,
  registry as chatRegistry
}
