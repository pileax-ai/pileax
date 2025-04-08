import type { Request, RequestHandler, Response } from 'express';

import { authService } from '@/api/user/service/auth.service';
import { sendOk } from '@/core/api/httpHandlers'
import { Signin } from '@/api/user/model/auth.model'

class AuthController {

  public signin: RequestHandler = async (req: Request, res: Response) => {
    const result = await authService.signin(req.query as Signin);
    sendOk(res, result);
  };

}

export const authController = new AuthController();
