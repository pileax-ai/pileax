import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  NoteSchema,
  NoteBodySchema,
  NoteGetSchema,
  NoteEmptySchema,
  NoteQuerySchema,
  NoteQueryBodySchema
} from '@/api/note/model/noteModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { noteController } from '../controller/noteController';

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
apiRouter.post('/note', validateBody(NoteSchema), noteController.save);

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
	request: { query: NoteGetSchema.shape.query },
	responses: createApiResponse(NoteSchema, 'Success'),
});
apiRouter.get('/note', validateRequest(NoteGetSchema), noteController.get);

/**
 * delete
 */
noteRegistry.registerPath({
  method: 'delete',
  path: `${apiBase}/note`,
  tags: ['Note'],
  request: { query: NoteGetSchema.shape.query },
  responses: createApiResponse(NoteEmptySchema, 'Success'),
});
apiRouter.get('/note', validateRequest(NoteGetSchema), noteController.delete);

/**
 * query
 */
noteRegistry.registerPath({
  method: 'post',
  path: `${apiBase}/note/query`,
  tags: ['Note'],
  request: { body: NoteQueryBodySchema },
  responses: createApiResponse(z.array(NoteSchema), 'Success'),
});
apiRouter.post('/note/query', validateRequest(NoteQuerySchema), noteController.query);
