import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from '@/core/api/commonValidation'

extendZodWithOpenApi(z);

export type Chat = z.infer<typeof ChatSchema>;
export type ChatUpdate = z.infer<typeof ChatUpdateSchema>;
export type ChatCompletion = z.infer<typeof ChatCompletionSchema>;

export const ChatSchema = z.object({
  id: z.string(),
  userId: z.number().optional(),
  sessionId: z.string(),
  message: z.string(),
  content: z.string(),
  reasoning: z.number().default(0),
  reasoningContent: z.string().optional(),
  provider: z.string(),
  model: z.string(),
  result: z.number().optional().default(0),
  like: z.number().optional().default(0),
  status: z.number().optional().default(0),
});

export const ChatUpdateSchema = ChatSchema.partial();

export const ChatCompletionSchema = z.object({
	id: z.string(),
	sessionId: z.string(),
	model: z.string(),
	message: z.string(),
	stream: z.boolean().default(true),
  reasoning: z.boolean().default(false),
});

export const ChatCompletionBodySchema = {
  description: 'Chat Completion',
  content: {
    'application/json': {
      schema: ChatCompletionSchema.openapi('ChatCompletionBody')
    }
  }
}

export const ChatCompletionResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  message: z.string(),
});

export const UuidSchema = z.object({
  query: z.object({ uuid: commonValidations.stringId }),
});
