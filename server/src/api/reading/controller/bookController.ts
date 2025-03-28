import type { Request, RequestHandler, Response } from 'express';

import { bookService } from '@/api/reading/service/bookService';
import { sendOk } from '@/core/api/httpHandlers';

class BookController {
  public save: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const id = data.id;
    let doc: unknown;
    try {
      await bookService.get(id);
      doc = await bookService.update(data);
    } catch (err) {
      doc = await bookService.create(data);
    }
    sendOk(res, doc);
  };

	public get: RequestHandler = async (req: Request, res: Response) => {
		const id = parseInt(req.query.id as string);
		const doc = await bookService.get(id);
    sendOk(res, doc);
	};

  public getByUuid: RequestHandler = async (req: Request, res: Response) => {
    const uuid = req.query.uuid as string;
    const doc = await bookService.getByUuid(uuid);
    sendOk(res, doc);
  };

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.query.id as string);
    await bookService.delete(id);
    sendOk(res, { });
  };

  public getAll: RequestHandler = async (req: Request, res: Response) => {
    const result = await bookService.getAll();
    sendOk(res, result);
  };

  public query: RequestHandler = async (req: Request, res: Response) => {
    const result = await bookService.query(req.body);
    sendOk(res, result);
  };
}

export const bookController = new BookController();
