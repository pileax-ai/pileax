import type { Request, RequestHandler, Response } from 'express';

import { MulterUtil } from '@/common/storage'
import { sendOk, sendFailed } from '@/core/api/httpHandlers';
import { ServerException } from '@/core/api/exceptions';
import { env } from '@/common/utils/envConfig';
import { fileMetaService as service } from '@/api/file/service/file.service';
import { BaseController } from '@/core/api/base.controller';
import { FileMeta } from '@/api/file/model/file.model';

class FileController extends BaseController<FileMeta>{
  constructor() {
    super(service);
  }

  public upload: RequestHandler = async (req: Request, res: Response, next) => {
    try {
      const type = req.query.type as string;
      const uploader = MulterUtil.singleUploader({
        type: type,
        fileName: req.query.fileName as string,
        subDir: type === 'file' ? '' : type
      });
      uploader.single('file')(req, res, async (err: any) => {
        if (err) {
          return sendFailed(res, err.message);
        }

        if (req.file) {
          const result = await service.save({
            id: '',
            userId: req.headers['x-user-id'] as string,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            path: req.file.path.replace(env.PUBLIC_ROOT, ''),
            size: req.file.size,
            mimetype: req.file.mimetype
          });
          return sendOk(res, result);
        } else {
          return sendFailed(res, 'No file');
        }
      })
    } catch (err) {
      console.error(err);
      throw new ServerException('File Upload', 'File upload failed');
    }
  };

  public uploadMultiple: RequestHandler = async (req: Request, res: Response, next) => {
    try {
      const type = req.query.type as string;
      const uploader = MulterUtil.multiUploader({
        type: type,
        fileName: req.query.fileName as string,
        subDir: type === 'file' ? '' : type
      });
      uploader.array('files')(req, res, async (err: any) => {
        if (err) {
          return sendFailed(res, err.message);
        }

        if (req.files && req.files.length) {
          const result = await Promise.all(
            (req.files as Express.Multer.File[]).map(async (file) => {
              return await service.save({
                id: '',
                userId: req.headers['x-user-id'] as string,
                originalName: file.originalname,
                fileName: file.filename,
                path: file.path.replace(env.PUBLIC_ROOT, ''),
                size: file.size,
                mimetype: file.mimetype
              });
            })
          );
          return sendOk(res, result);
        } else {
          return sendFailed(res, 'No file');
        }
      })
    } catch (err) {
      console.error(err);
      throw new ServerException('File Upload', 'File upload failed');
    }
  };
}

export const fileController = new FileController();
