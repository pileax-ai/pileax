import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { UserBookSchema, UserBookBodySchema, } from '@/api/reading/model/user-book.model';
import {
  EmptySchema,
  QuerySchema,
  QueryBodySchema,
  StringIdSchema,
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { userBookController as controller } from '../controller/user-book.controller';

export const api = () => {};
export const registry = new OpenAPIRegistry();
const pathBase = `/user/book`;
const apiPathBase = `${apiBase}${pathBase}`;

registry.register('UserBook', UserBookSchema);

/**
 * Save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: ['UserBook'],
  request: { body: UserBookBodySchema },
  responses: createApiResponse(UserBookSchema, 'Success'),
});
apiRouter.post(`${pathBase}`,
  validateBody(UserBookSchema.partial()), controller.save);

/**
 * get
 */
registry.registerPath({
	method: 'get',
  path: `${apiPathBase}`,
	tags: ['UserBook'],
	request: { query: StringIdSchema.shape.query },
	responses: createApiResponse(UserBookSchema, 'Success'),
});
apiRouter.get(`${pathBase}`,
  validateRequest(StringIdSchema), controller.get);

/**
 * get details
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}/details`,
  tags: ['UserBook'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(UserBookSchema, 'Success'),
});
apiRouter.get(`${pathBase}/details`,
  validateRequest(StringIdSchema), controller.getDetails);

/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: ['UserBook'],
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
  tags: ['UserBook'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(UserBookSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`,
  validateRequest(QuerySchema),
  controller.query);

/**
 * query details
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/query/details`,
  tags: ['UserBook'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(UserBookSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query/details`,
  validateRequest(QuerySchema),
  controller.queryDetails);

export {
  api as userBookApi,
  registry as userBookRegistry
}
