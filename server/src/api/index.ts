
import { authApi } from '@/api/user/api/auth.api';
import { bookApi } from '@/api/reading/api/book.api';
import { bookAnnotationApi } from '@/api/reading/api/book-annotation.api';
import { chatApi } from '@/api/ai/api/chat.api';
import { chatSessionApi } from '@/api/ai/api/chat-session.api';
import { fileApi } from '@/api/file/api/file.api';
import { noteApi } from '@/api/note/api/note.api';
import { providerApi } from '@/api/ai/api/provider.api';
import { systemApi } from '@/api/system/api/system.api';
import { systemConfigApi } from '@/api/system/api/config.api';
import { userApi } from '@/api/user/api/user.api';

export const registerApi = () => {
  authApi();
  bookApi();
  bookAnnotationApi();
  chatApi();
  chatSessionApi();
  fileApi();
  noteApi();
  providerApi();
  systemApi();
  systemConfigApi();
  userApi();
}
