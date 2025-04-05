import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from '@/core/api/commonValidation'
import { ChatSessionSchema } from '@/api/ai/model/chat-session.model'

extendZodWithOpenApi(z);

export type FileMeta = z.infer<typeof FileMetaSchema>;

export const FileUploadSchema = z.object({
  fileName: z.string().optional(),
  type: z.enum(['file', 'book']).default('file').describe('File Type')
});

export const FileMetaSchema = z.object({
  filename: z.string(),
  url: z.string(),
});
