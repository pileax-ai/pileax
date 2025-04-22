import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Knowledge = z.infer<typeof KnowledgeSchema>;
export type KnowledgeUpdate = z.infer<typeof KnowledgeUpdateSchema>;

export const KnowledgeSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string(),
  description: z.string(),
  logo: z.string().optional(),
  status: z.number().optional(),
});

export const KnowledgeBodySchema = {
  description: 'Save Knowledge',
  content: {
    'application/json': {
      schema: KnowledgeSchema.openapi('KnowledgeBody')
    }
  }
}

export const KnowledgeUpdateSchema = KnowledgeSchema.partial();
