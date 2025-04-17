import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Provider = z.infer<typeof ProviderSchema>;
export type ProviderUpdate = z.infer<typeof ProviderUpdateSchema>;

export const ProviderSchema = z.object({
  provider: z.string(),
  name: z.string(),
  description: z.string(),
  home: z.string().url(),
  github: z.string().url(),
  env: z.array(z.string()),
  models: z.array(z.string()),
});

export const ProviderUpdateSchema = ProviderSchema.partial();
