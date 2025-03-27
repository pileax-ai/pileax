import { BookService } from './BookService';
import { BookAnnotationService } from './BookAnnotationService';
import { NoteService } from './NoteService';

const dbExecute = async (entity: string, method: string, params: any) => {
  switch (entity) {
    case 'Book':
      return await new BookService().dbExecute(method, params);
    case 'BookAnnotation':
      return await new BookAnnotationService().dbExecute(method, params);
    case 'Note':
      return await new NoteService().dbExecute(method, params);
    default:
      return;
  }
}

export {
  dbExecute
}
