import type { Request, RequestHandler, Response } from 'express';

import { bookService as service } from '@/api/reading/service/book.service';
import { fileMetaService } from '@/api/file/service/file.service';
import { userBookService } from '@/api/reading/service/user-book.service';
import { sendFailed, sendOk } from '@/core/api/httpHandlers'
import { MulterUtil } from '@/common/storage'
import { env } from '@/common/utils/envConfig'
import { ServerException } from '@/core/api/exceptions'
import { Book, BookSchema } from '@/api/reading/model/book.model'
import { BaseController } from '@/core/api/base.controller'
import { randomUUID } from 'node:crypto'

class BookController extends BaseController<Book>{
  constructor() {
    super(service);
  }

  public getByUuid: RequestHandler = async (req: Request, res: Response) => {
    const uuid = req.query.uuid as string;
    const doc = await service.getByUuid(uuid);
    sendOk(res, doc);
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
          // console.log('book', req.body.book);
          const bookId = randomUUID();
          try {
            const book = BookSchema.parse(
              JSON.parse(req.body.book)
            );
            book.id = bookId;
            book.userId = req.headers['x-user-id'] as string;
            book.path = uuid;
            const files = await Promise.all(
              (req.files as Express.Multer.File[]).map(async (file) => {
                if (file.filename.indexOf('book') === 0) {
                  book.fileName = file.filename;
                } else {
                  book.coverName = file.filename;
                }

                // save file meta
                return await fileMetaService.save({
                  id: '',
                  userId: req.headers['x-user-id'] as string,
                  originalName: file.originalname,
                  fileName: file.filename,
                  path: file.path.replace(env.PUBLIC_ROOT, ''),
                  size: file.size,
                  mimetype: file.mimetype,
                  refType: 'book',
                  refId: bookId
                });
              })
            );

            // save book
            const result = await service.create(book);

            // save user book
            await userBookService.create({
              id: '',
              bookId: result.id,
              userId: result.userId,
              rating: 0,
              readingPosition: '',
              readingPercentage: 0,
            });

            return sendOk(res, result);
          } catch (err) {
            return sendFailed(res, 'Parse book metadata failed.', JSON.parse(req.body.book));
          }
        } else {
          return sendFailed(res, 'No file');
        }
      })
    } catch (err) {
      console.error('HHH', err);
      throw new ServerException('Book Upload', 'File upload failed');
    }
  };

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const book = await this.service.get(id);
    console.log('book', book);

    // delete book from database
    await this.service.delete(id);

    // todo: delete book files from file system

    sendOk(res, {});
  };
}

export const bookController = new BookController();
