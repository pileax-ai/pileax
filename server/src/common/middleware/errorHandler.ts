import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '@/core/api/exceptions';
import { UnauthorizedError }  from 'express-jwt';

const unexpectedRequest: RequestHandler = (_req, res) => {
	res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  console.error('Error Handler ===>', err);
  if (err instanceof HttpException || err instanceof UnauthorizedError) {
    res.status(err.status).json({
      success: false,
      code: err.status,
      message: err.message,
      data: {}
    });
  } else {
    res.status(500).json({
      success: false,
      code: err.status,
      message: err.message,
      data: {}
    });
    // res.locals.err = err;
    // next(err);
  }
};

export default () => [
  unexpectedRequest,
  addErrorToRequestLog
];
