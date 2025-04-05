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
import { upload } from '@/common/storage'

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


export {
  api as fileApi,
  registry as fileRegistry
}
