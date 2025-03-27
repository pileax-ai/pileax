import { BookRepo } from '../repo/BookRepo';
import { Like, Repository } from 'typeorm';
import { Book } from '../entity/Book';
import { removeBookFiles } from '../../utils/file';

export class BookService {
  repo: Repository<Book>;

  constructor() {
    this.repo = BookRepo.getInstance();
  }

  async dbExecute(method: string, params: any) {
    switch (method) {
      case 'deleteById':
        return BookRepo.getInstance().deleteById(params as number);
      case 'find':
        return await this.find(params);
      case 'findAll':
        return await this.findAll();
      case 'findById':
        return await this.findById(params);
      case 'findByUuid':
        return await this.findByUuid(params);
      case 'query':
        return await this.query(params);
      case 'removeBookAndFiles':
        return await this.removeBookAndFiles(params);
      case 'save':
        return await this.save(params);
      case 'hi':
        return params;
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
    return await BookRepo.getInstance().findById(params as number);
  }

  /**
   * Finds all entities.
   */
  async findAll() {
    return await this.repo.find();
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

  async findByUuid(params: any) {
    return await BookRepo.getInstance().findByUuid(params as string);
  }

  /**
   * Pagination query
   * @param params
   */
  async query(params: any) {
    const pageIndex = params.pageIndex;
    const pageSize = params.pageSize;
    const title = params.condition.title;

    const [list, total] = await this.repo.findAndCount({
      where: {
        title: title ? Like(`%${title}%`) : undefined,
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

  /**
   * Remove book record and files
   *
   * @param id Book id
   */
  async removeBookAndFiles(id: number) {
    const book = await this.findById(id);
    if (!book) return;

    // Remove record in database
    await BookRepo.getInstance().deleteById(id);

    // Remove book files
    removeBookFiles(book.path);
  }

}
