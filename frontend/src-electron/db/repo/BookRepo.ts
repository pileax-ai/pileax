import { Repository } from 'typeorm';
import { Book } from '../entity';
import { AppDataSource } from '../index';

export class BookRepo extends Repository<Book> {
  static getInstance() {
    return AppDataSource?.getRepository(Book).extend({
      async deleteById(id: number) {
        return this.delete({ id: id });
      },
      async findById(id: number) {
        return this.findOne({ where: { id } });
      },
      async findByUuid(uuid: string) {
        return this.findOne({ where: { uuid } });
      },
    });
  }
}
