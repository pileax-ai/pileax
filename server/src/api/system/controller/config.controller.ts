import { configService as service } from '@/api/system/service/config.service';
import { BaseController } from '@/core/api/base.controller'
import { Config } from '@/api/system/model/config.model'
import type { Request, RequestHandler, Response } from 'express'
import { sendOk } from '@/core/api/httpHandlers'

class ConfigController extends BaseController<Config> {
  constructor() {
    super(service);
  }

  public getAll: RequestHandler = async (req: Request, res: Response) => {
    const scope = req.query.scope as string;
    const result = await service.getAll(scope);
    sendOk(res, result);
  };

  public saveAll: RequestHandler = async (req: Request, res: Response) => {
    await service.saveAll(req.body);
    sendOk(res, {});
  };
}

export const configController = new ConfigController();
