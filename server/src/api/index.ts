import { chatApi } from '@/api/ai/api/chat.api';
import { chatSessionApi } from '@/api/ai/api/chat-session.api';
import { bookApi } from '@/api/reading/api/bookApi';
import { bookAnnotationApi } from '@/api/reading/api/bookAnnotationApi';
import { noteApi } from '@/api/note/api/noteApi';
import { systemApi } from '@/api/system/api/systemApi';
import { userApi } from '@/api/user/api/userApi';

export const registerApi = () => {
  chatApi();
  chatSessionApi();
  bookApi();
  bookAnnotationApi();
  noteApi();
  systemApi();
  userApi();
}
