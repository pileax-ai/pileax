import type { Request, RequestHandler, Response } from 'express';

import { noteService } from '@/api/note/service/note.service';
import { sendOk } from '@/core/api/httpHandlers';

class NoteController {
  public save: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const id = data.id;
    let doc: unknown;
    try {
      await noteService.get(id);
      doc = await noteService.update(data);
    } catch (err) {
      doc = await noteService.create(data);
    }
    sendOk(res, doc);
  };

	public get: RequestHandler = async (req: Request, res: Response) => {
		const id = req.query.id as string;
		const doc = await noteService.get(id);
    sendOk(res, doc);
	};

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    await noteService.delete(id);
    sendOk(res, { });
  };

  public getAll: RequestHandler = async (req: Request, res: Response) => {
    const result = await noteService.getAll();
    sendOk(res, result);
  };

  public query: RequestHandler = async (req: Request, res: Response) => {
    const result = await noteService.query(req.body);
    sendOk(res, result);
  };
}

export const noteController = new NoteController();
