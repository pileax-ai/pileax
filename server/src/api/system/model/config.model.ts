import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from '@/core/api/commonValidation'

extendZodWithOpenApi(z);

export type Config = z.infer<typeof ConfigSchema>;
export type ConfigUpdate = z.infer<typeof ConfigUpdateSchema>;
export type ConfigList = z.infer<typeof ConfigListSchema>;

export const ConfigSchema = z.object({
	id: z.string(),
  name: z.string(),
	type: z.string(),
	key: z.string(),
	value: z.string(),
	owner: z.string(),
	scope: z.string().default('system'),
});

export const ConfigBodySchema = {
  description: 'Save Config',
  content: {
    'application/json': {
      schema: ConfigSchema.openapi('ConfigBody')
    }
  }
}

export const ConfigUpdateSchema = ConfigSchema.partial();

export const ScopeSchema = z.object({
  query: z.object({ scope: commonValidations.stringId }),
});

export const ConfigListSchema = z.array(ConfigSchema)

export const ConfigListBodySchema = {
  description: 'Save Config All',
  content: {
    'application/json': {
      schema: ConfigListSchema.openapi('ConfigListBody')
    }
  }
}
