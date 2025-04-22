import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const handleServiceResponse = (serviceResponse: ServiceResponse<unknown>, response: Response) => {
	return response.status(serviceResponse.code).send(serviceResponse);
};

export const sendOk = (response: Response, data: unknown) => {
  const serviceResponse = ServiceResponse.success('ok', data);
  return response.status(serviceResponse.code).send(serviceResponse);
};

export const sendFailed = (response: Response, message: string, code = 400) => {
  const serviceResponse = ServiceResponse.failure(message, {}, code);
  return response.status(serviceResponse.code).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
	try {
		schema.parse({ body: req.body, query: req.query, params: req.params });
		next();
	} catch (err) {
    console.log('err', err)
		const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => `${e.path.join('.')}-${e.message}`).join(", ")}`;
		const statusCode = StatusCodes.BAD_REQUEST;
		const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
		handleServiceResponse(serviceResponse, res);
	}
};

export const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    console.log('err', err)
    const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => `${e.path.join('.')}-${e.message}`).join(", ")}`;
    const statusCode = StatusCodes.BAD_REQUEST;
    const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
    handleServiceResponse(serviceResponse, res);
  }
};
