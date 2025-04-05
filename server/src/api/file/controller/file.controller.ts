import type { Request, RequestHandler, Response } from 'express';

import { MulterUtil } from '@/common/storage'
import { sendOk, sendFailed } from '@/core/api/httpHandlers';
import { ServerException } from '@/core/api/exceptions'

class FileController {
  public upload: RequestHandler = async (req: Request, res: Response, next) => {
    try {
      const type = req.query.type as string;
      const uploader = MulterUtil.getUploader({
        type: type,
        fileName: req.query.fileName as string,
        subDir: type === 'file' ? '' : type
      });
      uploader.single('file')(req, res, async (err: any) => {
        if (err) {
          return sendFailed(res, err.message);
        }

        if (req.file) {
          return sendOk(res, {
            originalName: req.file.originalname,
            fileName: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype
          });
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
