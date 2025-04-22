import type { Request, RequestHandler, Response } from 'express';
import type { BaseService } from './base.service'; // 你刚写的服务基类
import { sendOk } from '@/core/api/httpHandlers';
import { Query } from '@/core/api/commonModel'

export class BaseController<T extends { id?: string }> {
  protected service: BaseService<T, any>;

  constructor(service: BaseService<T, any>) {
    this.service = service;
  }

  public save: RequestHandler = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const data = { ...req.body, userId };
    const result = await this.service.save(data);
    sendOk(res, result);
  };

  public get: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const doc = await this.service.get(id);
    sendOk(res, doc);
  };

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    await this.service.delete(id);
    sendOk(res, {});
  };

  public getAll: RequestHandler = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const result = await this.service.getAll(userId);
    sendOk(res, result);
  };

  public query: RequestHandler = async (req: Request, res: Response) => {
    const query = req.body as Query;
    if (query.condition) {
      query.condition.userId = req.headers['x-user-id'] as string;
    } else {
      query.condition = {
        userId: req.headers['x-user-id'] as string
      };
    }
    const result = await this.service.query(req.body);
    sendOk(res, result);
  };

}
