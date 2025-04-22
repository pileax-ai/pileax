import type { Request, RequestHandler, Response } from 'express';

import { bookAnnotationService as service } from '@/api/reading/service/book-annotation.service';
import { sendOk } from '@/core/api/httpHandlers';
import { BaseController } from '@/core/api/base.controller'
import { BookAnnotation } from '@/api/reading/model/book-annotation.model'

class BookAnnotationController extends BaseController<BookAnnotation> {
  constructor() {
    super(service);
  }

  public queryAll: RequestHandler = async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const result = await service.queryAll(query);
    sendOk(res, result);
  };

  public queryBook: RequestHandler = async (req: Request, res: Response) => {
    const result = await service.queryBook(req.body);
    sendOk(res, result);
  };
}

export const bookAnnotationController = new BookAnnotationController();
