import type { Request, RequestHandler, Response } from 'express';

import { sendOk } from '@/core/api/httpHandlers';
import { providers } from '@/ai/providers';
import { providerService as service } from '@/api/ai/service/provider.service';
import { configService } from '@/api/system/service/config.service';

class ProviderController {

  public getAll: RequestHandler = async (req: Request, res: Response) => {
    const configList = await configService.getAll('system');
    const list = providers.map((item: Indexable) => {
      const hasConfig = configList.filter(e => e.owner === item.name).length > 0
      return {
        ...item,
        enabled: hasConfig
      };
    })
    const result = {
      list: list,
      total: list.length
    };
    sendOk(res, result);
  }

  public getModels: RequestHandler = async (req: Request, res: Response) => {
    const provider = req.query.provider as string;
    const result = await service.getModels(provider);
    sendOk(res, result);
  }

  public disable: RequestHandler = async (req: Request, res: Response) => {
    const provider = req.query.provider as string;
    const result = await configService.deleteByOwner(provider);
    sendOk(res, result);
  }

}

export const providerController = new ProviderController();
