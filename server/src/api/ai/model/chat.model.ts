import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from '@/core/api/commonValidation'

extendZodWithOpenApi(z);

export type ChatCompletion = z.infer<typeof ChatCompletionSchema>;

export const ChatCompletionSchema = z.object({
	id: z.number().optional(),
	sessionId: z.string(),
	message: z.string(),
});

export const ChatCompletionBodySchema = {
  description: 'Save Book',
  content: {
    'application/json': {
      schema: ChatCompletionSchema.openapi('chat')
    }
  }
}

export const ChatCompletionResponseSchema = z.object({
  id: z.number().optional(),
  sessionId: z.string(),
  message: z.string(),
});

export const UuidSchema = z.object({
  query: z.object({ uuid: commonValidations.stringId }),
});
