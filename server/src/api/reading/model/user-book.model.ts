import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type UserBook = z.infer<typeof UserBookSchema>;
export type UserBookUpdate = z.infer<typeof UserBookUpdateSchema>;

export const UserBookSchema = z.object({
	id: z.string().default(''),
  userId: z.string().optional(),
  bookId: z.string(),
  rating: z.number().optional(),
  readingPosition: z.string().optional(),
  readingPercentage: z.number().optional(),
});

export const UserBookBodySchema = {
  description: 'Save UserBook',
  content: {
    'application/json': {
      schema: UserBookSchema.openapi('UserBookBody')
    }
  }
}

export const UserBookUpdateSchema = UserBookSchema.partial();
