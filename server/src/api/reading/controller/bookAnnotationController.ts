import type { Request, RequestHandler, Response } from 'express';

import { bookAnnotationService } from '@/api/reading/service/bookAnnotationService';
import { sendOk } from '@/core/api/httpHandlers';

class BookAnnotationController {
  public save: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const id = data.id;
    let doc: unknown;
    try {
      await bookAnnotationService.get(id);
      doc = await bookAnnotationService.update(data);
    } catch (err) {
      doc = await bookAnnotationService.create(data);
    }
    sendOk(res, doc);
  };

	public get: RequestHandler = async (req: Request, res: Response) => {
		const id = parseInt(req.query.id as string);
		const doc = await bookAnnotationService.get(id);
    sendOk(res, doc);
	};

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.query.id as string);
    await bookAnnotationService.delete(id);
    sendOk(res, { });
  };

  public getAll: RequestHandler = async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const result = await bookAnnotationService.getAll(query);
    sendOk(res, result);
  };

  public query: RequestHandler = async (req: Request, res: Response) => {
    const result = await bookAnnotationService.query(req.body);
    sendOk(res, result);
  };

  public queryBook: RequestHandler = async (req: Request, res: Response) => {
    const result = await bookAnnotationService.queryBook(req.body);
    sendOk(res, result);
  };
}

export const bookAnnotationController = new BookAnnotationController();
