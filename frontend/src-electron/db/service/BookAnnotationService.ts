import { BookAnnotationRepo } from '../repo/BookAnnotationRepo';
import { Like, Repository } from 'typeorm';
import {Book, BookAnnotation} from '../entity';

export class BookAnnotationService {
  repo: Repository<BookAnnotation>;

  constructor() {
    this.repo = BookAnnotationRepo.getInstance();
  }

  async dbExecute(method: string, params: any) {
    switch (method) {
      case 'deleteById':
        return BookAnnotationRepo.getInstance().deleteById(params as number);
      case 'find':
        return await this.find(params);
      case 'findById':
        return await this.findById(params);
      case 'query':
        return await this.query(params);
      case 'joinQuery':
        return await this.joinQuery(params);
      case 'save':
        return await this.save(params);
      default:
        return;
    }
  }

  /**
   * save: insert or update
   * @param params
   */
  async save(params: any) {
    return await this.repo.save(params);
  }

  async findById(params: any) {
    return await BookAnnotationRepo.getInstance().findById(params as number);
  }

  /**
   * Finds entities that match given find options.
   *
   * @params eg. { bookId: 1 }
   */
  async find(params: any) {
    return await this.repo.find({
      where: params
    });
  }

  /**
   * Pagination query
   * @param params
   */
  async query(params: any) {
    const pageIndex = params.pageIndex;
    const pageSize = params.pageSize;
    const bookId = params.condition.bookId;

    const [list, total] = await this.repo.findAndCount({
      where: {
        bookId,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize
    });
    const totalPages = Math.ceil(total / pageSize);

    return {
      pageIndex: pageIndex,
      pageSize: pageSize,
      list: list,
      total: total,
      totalPages: totalPages
    }
  }

  async joinQuery(params: any) {
    const pageIndex = params.pageIndex;
    const pageSize = params.pageSize;
    const offset = (pageIndex - 1) * pageSize;
    const note = params.condition.note;

    const rawResult = await this.repo
      .createQueryBuilder('bookAnnotation')
      .leftJoinAndSelect(Book, 'book', 'bookAnnotation.bookId = book.id')
      .select([
        'bookAnnotation.id AS id',
        'bookAnnotation.note AS note',
        'bookAnnotation.value AS value',
        'bookAnnotation.color AS color',
        'bookAnnotation.page AS page',
        'bookAnnotation.chapter AS chapter',
        'bookAnnotation.createTime AS createTime',
        'book.id AS bookId',
        'book.title AS bookTitle',
        'book.path AS path',
        'book.fileName AS fileName',
        'book.coverName AS coverName',
      ])
      .where('bookAnnotation.note LIKE :note', {note: `%${note}%`})
      .orderBy('bookAnnotation.updateTime', 'DESC')
      .skip(offset)
      .take(pageSize)
      .getRawMany();
    // const result = rawResult.map((item) => {
    //   return {
    //     id: item.bookAnnotation_id,
    //     bookTitle: item.book_title
    //   }
    // });
    return rawResult;
  }

}
