import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  NoteSchema,
  NoteBodySchema,
} from '@/api/note/model/note.model';
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';

import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { noteController } from '../controller/note.controller';

export const noteRegistry = new OpenAPIRegistry();
export const noteApi = () => {}

noteRegistry.register('Note', NoteSchema);

/**
 * Save
 */
noteRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/note`,
  tags: ['Note'],
  request: { body: NoteBodySchema },
  responses: createApiResponse(NoteSchema, 'Success'),
});
apiRouter.post('/note', validateBody(NoteSchema.partial()), noteController.save);

/**
 * getAll
 */
noteRegistry.registerPath({
  method: 'get',
  path: `${apiBase}/note/all`,
  tags: ['Note'],
  responses: createApiResponse(z.array(NoteSchema), 'Success'),
});
apiRouter.get('/note/all', noteController.getAll);

/**
 * get
 */
noteRegistry.registerPath({
	method: 'get',
	path: `${apiBase}/note`,
	tags: ['Note'],
	request: { query: StringIdSchema.shape.query },
	responses: createApiResponse(NoteSchema, 'Success'),
});
apiRouter.get('/note', validateRequest(StringIdSchema), noteController.get);

/**
 * delete
 */
noteRegistry.registerPath({
  method: 'delete',
  path: `${apiBase}/note`,
  tags: ['Note'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(EmptySchema, 'Success'),
});
apiRouter.delete('/note', validateRequest(StringIdSchema), noteController.delete);

/**
 * query
 */
noteRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/note/query`,
  tags: ['Note'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(NoteSchema), 'Success'),
});
apiRouter.post('/note/query', validateRequest(QuerySchema), noteController.query);
