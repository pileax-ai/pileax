import type { Request, RequestHandler, Response } from 'express';

import { userBookService as service } from '@/api/reading/service/user-book.service';
import { sendOk } from '@/core/api/httpHandlers';
import { BaseController } from '@/core/api/base.controller'
import { UserBook } from '@/api/reading/model/user-book.model'
import { Query } from '@/core/api/commonModel'

class UserBookController extends BaseController<UserBook> {
  constructor() {
    super(service);
  }

  public getDetails: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const doc = await service.getDetails(id);
    sendOk(res, doc);
  };

  public queryDetails: RequestHandler = async (req: Request, res: Response) => {
    const query = req.body as Query;
    if (query.condition) {
      query.condition.userId = req.headers['x-user-id'] as string;
    } else {
      query.condition = {
        userId: req.headers['x-user-id'] as string
      };
    }
    const result = await service.queryDetails(query);
    sendOk(res, result);
  };
}

export const userBookController = new UserBookController();
