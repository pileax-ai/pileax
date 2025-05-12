import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { BookSchema, BookBodySchema, UuidSchema } from '@/api/reading/model/book.model';
import {
  EmptySchema,
  QuerySchema,
  QueryBodySchema,
  StringIdSchema,
} from '@/core/api/commonModel'
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { bookController } from '../controller/book.controller';
import { FileMetaSchema, FileUploadSchema } from '@/api/file/model/file.model'

export const api = () => {};
export const registry = new OpenAPIRegistry();
const pathBase = `/book`;
const apiPathBase = `${apiBase}${pathBase}`;

registry.register('Book', BookSchema);

/**
 * Save
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}`,
  tags: ['Book'],
  request: { body: BookBodySchema },
  responses: createApiResponse(BookSchema, 'Success'),
});
apiRouter.post(`${pathBase}`, validateBody(BookSchema.partial()), bookController.save);

registry.registerPath({
  method: 'put',
  path: `${apiPathBase}`,
  tags: ['Book'],
  request: { body: BookBodySchema },
  responses: createApiResponse(BookSchema, 'Success'),
});
apiRouter.put(`${pathBase}`, validateBody(BookSchema.partial()), bookController.save);

/**
 * getAll
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}/all`,
  tags: ['Book'],
  responses: createApiResponse(z.array(BookSchema), 'Success'),
});
apiRouter.get(`${pathBase}/all`, bookController.getAll);

/**
 * get
 */
registry.registerPath({
	method: 'get',
  path: `${apiPathBase}`,
	tags: ['Book'],
	request: { query: StringIdSchema.shape.query },
	responses: createApiResponse(BookSchema, 'Success'),
});
apiRouter.get(`${pathBase}`, validateRequest(StringIdSchema), bookController.get);

/**
 * get by uuid
 */
registry.registerPath({
  method: 'get',
  path: `${apiPathBase}/uuid`,
  tags: ['Book'],
  description: 'Get book by UUID',
  request: { query: UuidSchema.shape.query },
  responses: createApiResponse(BookSchema, 'Success'),
});
apiRouter.get(`${pathBase}/uuid`, validateRequest(UuidSchema), bookController.getByUuid);

/**
 * delete
 */
registry.registerPath({
  method: 'delete',
  path: `${apiPathBase}`,
  tags: ['Book'],
  request: { query: StringIdSchema.shape.query },
  responses: createApiResponse(EmptySchema, 'Success'),
});
apiRouter.delete(`${pathBase}`, validateRequest(StringIdSchema), bookController.delete);

/**
 * query
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/query`,
  tags: ['Book'],
  request: { body: QueryBodySchema },
  responses: createApiResponse(z.array(BookSchema), 'Success'),
});
apiRouter.post(`${pathBase}/query`, validateRequest(QuerySchema), bookController.query);

/**
 * upload book
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/upload`,
  tags: ['Book'],
  summary: 'Upload book and cover',
  request: {
    query: UuidSchema.shape.query,
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              files: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
                description: 'Files to be uploaded',
              },
              book: {
                type: 'string',
                description: 'JSON string of book metadata (BookSchema)',
                example: JSON.stringify({
                  uuid: 'uuid',
                  title: 'Example Book',
                  path: ''
                }),
              }
            },
            required: ['files', 'book']
          }
        }
      }
    }
  },
  responses: createApiResponse(FileMetaSchema, 'Success'),
});
apiRouter.post(`${pathBase}/upload`, validateRequest(UuidSchema), bookController.upload);

export {
  api as bookApi,
  registry as bookRegistry
}
