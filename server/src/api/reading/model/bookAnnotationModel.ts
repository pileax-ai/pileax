import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type BookAnnotation = z.infer<typeof BookAnnotationSchema>;
export type BookAnnotationUpdate = z.infer<typeof BookAnnotationUpdateSchema>;

// POST /book
export const BookAnnotationSchema = z.object({
	id: z.number().optional(),
	bookId: z.number(),
	type: z.string(),
	value: z.string(),
	note: z.string(),
	color: z.string().optional(),
  page: z.number(),
	chapter: z.string().optional(),
});

export const BookAnnotationBodySchema = {
  description: 'Save BookAnnotation',
  content: {
    'application/json': {
      schema: BookAnnotationSchema.openapi('bookAnnotation')
    }
  }
}

export const BookAnnotationUpdateSchema = BookAnnotationSchema.partial();
