import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from "@/core/api/exceptions"

const unexpectedRequest: RequestHandler = (_req, res) => {
	res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof HttpException) {
    res.status(err.statusCode).json({
      success: false,
      code: err.statusCode,
      message: err.message,
      data: {}
    })
  } else {
    res.locals.err = err;
    next(err);
  }
};

export default () => [
  unexpectedRequest,
  addErrorToRequestLog
];
