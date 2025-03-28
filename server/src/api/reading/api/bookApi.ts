import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { BookSchema, BookBodySchema, UuidSchema } from '@/api/reading/model/bookModel';
import {
  EmptySchema,
  IdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { bookController } from '../controller/bookController';

export const bookRegistry = new OpenAPIRegistry();
export const bookApi = () => {}

bookRegistry.register('Book', BookSchema);

/**
 * Save
 */
bookRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/book`,
  tags: ['Book'],
  request: { body: BookBodySchema },
  responses: createApiResponse(BookSchema, 'Success'),
});
apiRouter.post('/book', validateBody(BookSchema.partial()), bookController.save);

/**
 * getAll
 */
bookRegistry.registerPath({
  method: 'get',
  path: `${apiBase}/book/all`,
  tags: ['Book'],
  responses: createApiResponse(z.array(BookSchema), 'Success'),
});
apiRouter.get('/book/all', bookController.getAll);

/**
 * get
 */
bookRegistry.registerPath({
	method: 'get',
	path: `${apiBase}/book`,
	tags: ['Book'],
	request: { query: IdSchema.shape.query },
	responses: createApiResponse(BookSchema, 'Success'),
});
apiRouter.get('/book', validateRequest(IdSchema), bookController.get);

/**
 * get by uuid
 */
bookRegistry.registerPath({
  method: 'get',
  path: `${apiBase}/book/uuid`,
  tags: ['Book'],
  description: 'Get book by UUID',
  request: { query: UuidSchema.shape.query },
  responses: createApiResponse(BookSchema, 'Success'),
});
apiRouter.get('/book/uuid', validateRequest(UuidSchema), bookController.getByUuid);

/**
 * delete
 */
bookRegistry.registerPath({
  method: 'delete',
  path: `${apiBase}/book`,
  tags: ['Book'],
  request: { query: IdSchema.shape.query },
  responses: createApiResponse(EmptySchema, 'Success'),
});
apiRouter.delete('/book', validateRequest(IdSchema), bookController.delete);

/**
 * query
 */
bookRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/book/query`,
  tags: ['Book'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(BookSchema), 'Success'),
});
apiRouter.post('/book/query', validateRequest(QuerySchema), bookController.query);
