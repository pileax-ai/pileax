import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type FileMeta = z.infer<typeof FileMetaSchema>;
export type FileMetaUpdate = z.infer<typeof FileMetaUpdateSchema>;

export const FileUploadSchema = z.object({
  fileName: z.string().optional(),
  type: z.enum(['file', 'book']).default('file').describe('File Type')
});

export const FileMetaSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  mimetype: z.string(),
  size: z.number().optional(),
  originalName: z.string(),
  fileName: z.string().optional(),
  url: z.string().optional(),
  path: z.string(),
  refId: z.string().optional(),
  refType: z.string().optional(),
  status: z.number().optional(),
});

export const FileMetaUpdateSchema = FileMetaSchema.partial();
