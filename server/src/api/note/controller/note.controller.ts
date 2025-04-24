import { noteService as service } from '@/api/note/service/note.service';
import { BaseController } from '@/core/api/base.controller'
import { Note } from '@/api/note/model/note.model'
import type { Request, RequestHandler, Response } from 'express'
import { sendOk } from '@/core/api/httpHandlers'

class NoteController extends BaseController<Note> {
  constructor() {
    super(service);
  }

  public getAll: RequestHandler = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const result = await this.service.getAll(userId);
    sendOk(res, result.map((item: Indexable) => {
      return {
        id: item.id,
        parent: item.parent,
        title: item.title,
        icon: item.icon,
        favorite: item.favorite,
        updateTime: item.updateTime,
      }
    }));
  };
}

export const noteController = new NoteController();
