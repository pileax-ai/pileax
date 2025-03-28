import { bookApi } from '@/api/reading/api/bookApi';
import { bookAnnotationApi } from '@/api/reading/api/bookAnnotationApi';
import { noteApi } from '@/api/note/api/noteApi';
import { systemApi } from '@/api/system/api/systemApi';
import { userApi } from '@/api/user/api/userApi';

export const registerApi = () => {
  bookApi();
  bookAnnotationApi();
  noteApi();
  systemApi();
  userApi();
}
