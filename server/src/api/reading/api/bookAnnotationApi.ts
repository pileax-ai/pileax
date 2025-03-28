import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { BookAnnotationSchema, BookAnnotationBodySchema, } from '@/api/reading/model/bookAnnotationModel';
import {
  EmptySchema,
  IdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { bookAnnotationController } from '../controller/bookAnnotationController';

export const bookAnnotationRegistry = new OpenAPIRegistry();
export const bookAnnotationApi = () => {}

bookAnnotationRegistry.register('BookAnnotation', BookAnnotationSchema);

/**
 * Save
 */
bookAnnotationRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/book/annotation`,
  tags: ['BookAnnotation'],
  request: { body: BookAnnotationBodySchema },
  responses: createApiResponse(BookAnnotationSchema, 'Success'),
});
apiRouter.post('/book/annotation', validateBody(BookAnnotationSchema.partial()), bookAnnotationController.save);

/**
 * getAll
 */
bookAnnotationRegistry.registerPath({
  method: 'get',
  path: `${apiBase}/book/annotation/all`,
  tags: ['BookAnnotation'],
  request: { query: BookAnnotationSchema.partial() },
  responses: createApiResponse(z.array(BookAnnotationSchema), 'Success'),
});
apiRouter.get('/book/annotation/all', validateRequest(BookAnnotationSchema.partial()), bookAnnotationController.getAll);

/**
 * get
 */
bookAnnotationRegistry.registerPath({
	method: 'get',
	path: `${apiBase}/book/annotation`,
	tags: ['BookAnnotation'],
	request: { query: IdSchema.shape.query },
	responses: createApiResponse(BookAnnotationSchema, 'Success'),
});
apiRouter.get('/book/annotation', validateRequest(IdSchema), bookAnnotationController.get);

/**
 * delete
 */
bookAnnotationRegistry.registerPath({
  method: 'delete',
  path: `${apiBase}/book/annotation`,
  tags: ['BookAnnotation'],
  request: { query: IdSchema.shape.query },
  responses: createApiResponse(EmptySchema, 'Success'),
});
apiRouter.delete('/book/annotation', validateRequest(IdSchema), bookAnnotationController.delete);

/**
 * query
 */
bookAnnotationRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/book/annotation/query`,
  tags: ['BookAnnotation'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(BookAnnotationSchema), 'Success'),
});
apiRouter.post('/book/annotation/query',
  validateRequest(QuerySchema),
  bookAnnotationController.query);

/**
 * query
 */
bookAnnotationRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/book/annotation/query/book`,
  tags: ['BookAnnotation'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(BookAnnotationSchema), 'Success'),
});
apiRouter.post('/book/annotation/query/book',
  validateRequest(QuerySchema),
  bookAnnotationController.queryBook);
