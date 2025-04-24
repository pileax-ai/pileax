import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/core/api/commonValidation';

extendZodWithOpenApi(z);

export type Query = z.infer<typeof QuerySchema>;

// GET /*/?id
export const IdSchema = z.object({
  query: z.object({ id: commonValidations.id }),
});

export const StringIdSchema = z.object({
  query: z.object({ id: commonValidations.stringId }),
});

export const EmptySchema = z.object({
});

// POST /*/query
export const QuerySchema = z.object({
  pageIndex: z.number().default(1),
  pageSize: z.number().default(20),
  condition: z.object({
    userId: z.string().optional()
  }).default({
    userId: ''
  }),
  sort: z.object({
  }).default({ updateTime: 'desc' })
});


export const QueryBodySchema = {
  description: 'Query',
  content: {
    'application/json': {
      schema: QuerySchema.openapi('Query')
    }
  }
}
