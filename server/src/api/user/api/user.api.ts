import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { UserSchema, UserBodySchema } from '@/api/user/model/user.model';
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { userController as controller } from '../controller/user.controller';

const api = () => {};
const registry = new OpenAPIRegistry();
const pathBase = `/user`
const apiPathBase = `${apiBase}${pathBase}`

registry.register('User', UserSchema);

/**
 * save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: ['User'],
  request: { body: UserBodySchema },
  responses: createApiResponse(UserSchema, 'Success'),
});
apiRouter.post(`${pathBase}`,
  validateBody(UserSchema.partial()), controller.save);

/**
 * get
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}`,
  tags: ['User'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(UserSchema, 'Success'),
});
apiRouter.get(`${pathBase}`,
  validateRequest(StringIdSchema), controller.get);

/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: ['User'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(EmptySchema, 'Success'),
});
apiRouter.delete(`${pathBase}`,
  validateRequest(StringIdSchema), controller.delete);

/**
 * query
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/query`,
  tags: ['User'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(UserSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`,
  validateRequest(QuerySchema), controller.query);

export {
  api as userApi,
  registry as userRegistry
}
