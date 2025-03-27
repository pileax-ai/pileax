import { Repository } from 'typeorm';
import { Note } from '../entity';
import { AppDataSource } from '../index';

export class NoteRepo extends Repository<Note> {
  static getInstance() {
    return AppDataSource?.getRepository(Note).extend({
      async findById(id: string) {
        return this.findOne({ where: { id } });
      },
      async deleteById(id: string) {
        return this.delete({ id: id });
      },
    });
  }
}
