import { expressjwt as jwtMiddleware } from 'express-jwt';
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express'

const whiteList = [
  /^\/api\/docs(\/.*)?$/,
  /^\/files(\/.*)?$/,
  '/swagger.json',
  '/auth/signup',
  '/api/v1/auth/signin',
  '/system/health-check',
];

export const jwtVerifier = jwtMiddleware({
	secret: process.env.API_JWT_SECRET || 'fallback_secret',
  algorithms: ['HS256'],
  credentialsRequired: true,
}).unless({
  path: whiteList
});

export const attachUserId: RequestHandler = (req: any, res: Response,
                             next: NextFunction) => {
  try {
    // console.log('auth', req.auth);
    if (req.auth && req.auth.userId) {
      // Add custom header X-User-ID
      req.headers['x-user-id'] = req.auth.userId.toString();
      // req.userId = req.auth.userId.toString();
    }
    next();
  } catch (err) {
    next(err);
  }
}
