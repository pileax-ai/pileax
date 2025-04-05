import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  FileMetaSchema,
  FileUploadSchema,
} from '@/api/file/model/file.model'
import {
  EmptySchema,
  StringIdSchema,
  QuerySchema,
  QueryBodySchema
} from '@/core/api/commonModel';
import { validateRequest, validateBody } from '@/core/api/httpHandlers';
import { fileController as controller } from '../controller/file.controller';

export const api = () => {}
export const registry = new OpenAPIRegistry();
const pathBase = `/file`
const apiPathBase = `${apiBase}${pathBase}`

registry.register('File', FileMetaSchema);

/**
 * upload
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/upload`,
  tags: ['File'],
  summary: 'Upload a file',
  request: {
    query: FileUploadSchema,
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
                description: 'The file to be uploaded',
              }
            },
            required: ['file']
          }
        }
      }
    }
  },
  responses: createApiResponse(FileMetaSchema, 'Success'),
});
apiRouter.post(`${pathBase}/upload`, controller.upload);

/**
 * upload multiple
 */
registry.registerPath({
  method: 'post',
  path: `${apiPathBase}/upload/multiple`,
  tags: ['File'],
  summary: 'Upload multiple files',
  request: {
    query: FileUploadSchema,
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
              }
            },
            required: ['files']
          }
        }
      }
    }
  },
  responses: createApiResponse(FileMetaSchema, 'Success'),
});
apiRouter.post(`${pathBase}/upload/multiple`, controller.uploadMultiple);

export {
  api as fileApi,
  registry as fileRegistry
}
