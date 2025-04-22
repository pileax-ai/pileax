import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from '@/core/api/commonValidation'

extendZodWithOpenApi(z);

export type ChatSession = z.infer<typeof ChatSessionSchema>;
export type ChatSessionUpdate = z.infer<typeof ChatSessionUpdateSchema>;

export const ChatSessionSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
	title: z.string().optional(),
	name: z.string(),
  refId: z.string().optional(),
  refType: z.string().optional().default('general'),
  status: z.number().optional(),
});

export const ChatSessionBodySchema = {
  description: 'Save ChatSession',
  content: {
    'application/json': {
      schema: ChatSessionSchema.openapi('ChatSessionBody')
    }
  }
}

export const ChatSessionUpdateSchema = ChatSessionSchema.partial();

export const UuidSchema = z.object({
  query: z.object({ uuid: commonValidations.stringId }),
});
