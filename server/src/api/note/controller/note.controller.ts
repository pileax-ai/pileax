import { noteService as service } from '@/api/note/service/note.service';
import { BaseController } from '@/core/api/base.controller'
import { Note } from '@/api/note/model/note.model'

class NoteController extends BaseController<Note> {
  constructor() {
    super(service);
  }
}

export const noteController = new NoteController();
