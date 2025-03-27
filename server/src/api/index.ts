import { noteApi } from '@/api/note/api/noteApi';
import { systemApi } from '@/api/system/api/systemApi';
import { userApi } from '@/api/user/api/userApi';

export const registerApi = () => {
  noteApi();
  systemApi();
  userApi();
}
