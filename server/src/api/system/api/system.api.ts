import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { apiBase, apiRouter } from '@/common/router';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/core/api/httpHandlers';

export const systemRegistry = new OpenAPIRegistry();
export const systemApi = () => {}

systemRegistry.registerPath({
	method: 'get',
	path: `${apiBase}/system/health-check`,
	tags: ['System'],
	responses: createApiResponse(z.null(), 'Success'),
});

apiRouter.get('/system/health-check', (_req: Request, res: Response) => {
	const serviceResponse = ServiceResponse.success('Service is healthy', null);
	handleServiceResponse(serviceResponse, res);
});
