import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  ChatCompletionSchema,
  ChatCompletionBodySchema,
  ChatCompletionResponseSchema,
} from '@/api/ai/model/chat.model'
import {
  EmptySchema,
  IdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { chatController } from '../controller/chat.controller';

export const aiChatRegistry = new OpenAPIRegistry();
export const aiChatApi = () => {}

aiChatRegistry.register('AI Chat', ChatCompletionSchema);

/**
 * Create chat completions
 */
aiChatRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/ai/chat/completions`,
  tags: ['AI Chat'],
  request: { body: ChatCompletionBodySchema },
  responses: createApiResponse(ChatCompletionResponseSchema, 'Success'),
});
apiRouter.post('/ai/chat/completions',
  validateBody(ChatCompletionSchema), chatController.chatCompletion);

