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
import { noteController as controller } from '../controller/note.controller';

export const api = () => {}
export const registry = new OpenAPIRegistry();
const pathBase = `/note`;
const apiPathBase = `${apiBase}${pathBase}`;

registry.register('Note', NoteSchema);

/**
 * Save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: ['Note'],
  request: { body: NoteBodySchema },
  responses: createApiResponse(NoteSchema, 'Success'),
});
apiRouter.post(`${pathBase}`,
  validateBody(NoteSchema.partial()), controller.save);

/**
 * getAll
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}/all`,
  tags: ['Note'],
  responses: createApiResponse(z.array(NoteSchema), 'Success'),
});
apiRouter.get(`${pathBase}/all`, controller.getAll);

/**
 * get
 */
registry.registerPath({
	method: 'get',
  path: `${apiPathBase}`,
	tags: ['Note'],
	request: { query: StringIdSchema.shape.query },
	responses: createApiResponse(NoteSchema, 'Success'),
});
apiRouter.get(`${pathBase}`,
  validateRequest(StringIdSchema), controller.get);

/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: ['Note'],
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
  tags: ['Note'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(NoteSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`,
  validateRequest(QuerySchema), controller.query);

export {
  api as noteApi,
  registry as noteRegistry
}
