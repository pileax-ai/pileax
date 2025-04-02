import type { Request, RequestHandler, Response } from 'express';

import { chatSessionService as service } from '@/api/ai/service/chat-session.service';
import { sendOk } from '@/core/api/httpHandlers';

class ChatSessionController {
  public save: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const id = data.id;
    let doc: unknown;
    try {
      await service.get(id);
      doc = await service.update(data);
    } catch (err) {
      doc = await service.create(data);
    }
    sendOk(res, doc);
  };

	public get: RequestHandler = async (req: Request, res: Response) => {
		const id = req.query.id as string;
		const doc = await service.get(id);
    sendOk(res, doc);
	};

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    await service.delete(id);
    sendOk(res, { });
  };

  public query: RequestHandler = async (req: Request, res: Response) => {
    const result = await service.query(req.body);
    sendOk(res, result);
  };
}

export const chatSessionController = new ChatSessionController();
