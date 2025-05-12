import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from '@/core/api/commonValidation'

extendZodWithOpenApi(z);

export type Book = z.infer<typeof BookSchema>;
export type BookUpdate = z.infer<typeof BookUpdateSchema>;

export const BookSchema = z.object({
	id: z.string().default(''),
  userId: z.string().optional(),
	uuid: z.string(),
	title: z.string(),
	path: z.string(),
	fileName: z.string().optional(),
	extension: z.string().optional(),
	coverName: z.string().optional(),
  rating: z.number().optional(),
  author: z.string().optional(),
  language: z.string().optional(),
  description: z.string().optional(),
  publisher: z.string().optional(),
  published: z.string().optional(),
  scope: z.number().optional().default(9),
  readingPosition: z.string().optional(),
  readingPercentage: z.number().optional(),
});

export const BookBodySchema = {
  description: 'Save Book',
  content: {
    'application/json': {
      schema: BookSchema.openapi('BookBody')
    }
  }
}

export const BookUpdateSchema = BookSchema.partial();

export const UuidSchema = z.object({
  query: z.object({ uuid: commonValidations.stringId }),
});
