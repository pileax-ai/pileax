import { NoteRepo } from '../repo/NoteRepo';
import { Like, Repository } from 'typeorm';
import { Note } from '../entity';

export class NoteService {
  repo: Repository<Note>;

  constructor() {
    this.repo = NoteRepo.getInstance();
  }

  async dbExecute(method: string, params: any) {
    switch (method) {
      case 'deleteById':
        return NoteRepo.getInstance().deleteById(params as string);
      case 'find':
        return await this.find(params);
      case 'findById':
        return await this.findById(params);
      case 'query':
        return await this.query(params);
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
    const note = await this.repo.save(params as Note);
    return await NoteRepo.getInstance().findById(note.id);
  }

  async findById(params: any) {
    return await NoteRepo.getInstance().findById(params as string);
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
    const term = params.condition.term;

    const [list, total] = await this.repo.findAndCount({
      where: {
        title: term ? Like(`%${term}%`) : undefined,
      },
      order: {
        ['updateTime']: 'DESC'
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

}
