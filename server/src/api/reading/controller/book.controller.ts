import type { Request, RequestHandler, Response } from 'express';

import { bookService } from '@/api/reading/service/book.service';
import { sendFailed, sendOk } from '@/core/api/httpHandlers'
import { MulterUtil } from '@/common/storage'
import { env } from '@/common/utils/envConfig'
import { ServerException } from '@/core/api/exceptions'
import { BookSchema } from '@/api/reading/model/book.model'

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
		const id = req.query.id as string;
		const doc = await bookService.get(id);
    sendOk(res, doc);
	};

  public getByUuid: RequestHandler = async (req: Request, res: Response) => {
    const uuid = req.query.uuid as string;
    const doc = await bookService.getByUuid(uuid);
    sendOk(res, doc);
  };

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string;
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

  public upload: RequestHandler = async (req: Request, res: Response, next) => {
    try {
      const uuid = req.query.uuid as string;
      const uploader = MulterUtil.getBookUploader({
        type: 'book',
        fileName: uuid,
        isArray: true,
        maxCount: 2
      });
      uploader.array('files')(req, res, async (err: any) => {
        if (err) {
          return sendFailed(res, err.message);
        }
        if (req.files && req.files.length) {
          console.log('book', req.body.book);
          const book = BookSchema.parse(
            JSON.parse(req.body.book)
          );
          book.path = uuid;
          const files = (req.files as Express.Multer.File[]).map(file => {
            if (file.filename.indexOf('book') === 0) {
              book.fileName = file.filename;
            } else {
              book.coverName = file.filename;
            }

            return {
              originalName: file.originalname,
              fileName: file.filename,
              path: file.path.replace(env.PUBLIC_ROOT, ''),
              size: file.size,
              mimetype: file.mimetype
            };
          });
          console.log('book', book);
          console.log('files', req.files);
          // save file meta
          // save book
          const result = await bookService.create(book);
          return sendOk(res, result);
        } else {
          return sendFailed(res, 'No file');
        }
      })
    } catch (err) {
      console.error(err);
      throw new ServerException('Book Upload', 'File upload failed');
    }
  };
}

export const bookController = new BookController();
