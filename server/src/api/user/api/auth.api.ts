import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { SigninResponseSchema, SigninSchema } from '@/api/user/model/auth.model'
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { authController as controller } from '../controller/auth.controller';

const api = () => {};
const registry = new OpenAPIRegistry();
const pathBase = `/auth`
const apiPathBase = `${apiBase}${pathBase}`

registry.register('Auth', SigninSchema);

/**
 * signin
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/signin`,
  tags: ['Auth'],
  request: { query: SigninSchema },
  responses: createApiResponse(SigninResponseSchema, 'Success'),
});
apiRouter.post(`${pathBase}/signin`,
  validateRequest(z.object({query: SigninSchema})), controller.signin);


export {
  api as authApi,
  registry as authRegistry
}
