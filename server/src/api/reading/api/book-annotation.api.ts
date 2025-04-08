import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { BookAnnotationSchema, BookAnnotationBodySchema, } from '@/api/reading/model/book-annotation.model';
import {
  EmptySchema,
  QuerySchema,
  QueryBodySchema,
  StringIdSchema,
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { bookAnnotationController as controller } from '../controller/book-annotation.controller';

export const api = () => {};
export const registry = new OpenAPIRegistry();
const pathBase = `/book/annotation`;
const apiPathBase = `${apiBase}${pathBase}`;

registry.register('BookAnnotation', BookAnnotationSchema);

/**
 * Save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: ['BookAnnotation'],
  request: { body: BookAnnotationBodySchema },
  responses: createApiResponse(BookAnnotationSchema, 'Success'),
});
apiRouter.post(`${pathBase}`,
  validateBody(BookAnnotationSchema.partial()), controller.save);

/**
 * getAll
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}/all`,
  tags: ['BookAnnotation'],
  request: { query: BookAnnotationSchema.partial() },
  responses: createApiResponse(z.array(BookAnnotationSchema), 'Success'),
});
apiRouter.get(`${pathBase}/all`,
  validateRequest(BookAnnotationSchema.partial()), controller.queryAll);

/**
 * get
 */
registry.registerPath({
	method: 'get',
  path: `${apiPathBase}`,
	tags: ['BookAnnotation'],
	request: { query: StringIdSchema.shape.query },
	responses: createApiResponse(BookAnnotationSchema, 'Success'),
});
apiRouter.get(`${pathBase}`,
  validateRequest(StringIdSchema), controller.get);

/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: ['BookAnnotation'],
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
  tags: ['BookAnnotation'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(BookAnnotationSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`,
  validateRequest(QuerySchema),
  controller.query);

/**
 * query
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/query/book`,
  tags: ['BookAnnotation'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(BookAnnotationSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query/book`,
  validateRequest(QuerySchema),
  controller.queryBook);

export {
  api as bookAnnotationApi,
  registry as bookAnnotationRegistry
}
