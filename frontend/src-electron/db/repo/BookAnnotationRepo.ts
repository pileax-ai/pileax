import { Repository } from 'typeorm';
import { BookAnnotation } from '../entity';
import { AppDataSource } from '../index';

export class BookAnnotationRepo extends Repository<BookAnnotation> {
  static getInstance() {
    return AppDataSource?.getRepository(BookAnnotation).extend({
      async findById(id: number) {
        return this.findOne({ where: { id } });
      },
      async deleteById(id: number) {
        return this.delete({ id: id });
      },
    });
  }
}
