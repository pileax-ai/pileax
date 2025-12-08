/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from './base';
import { authService } from './auth';
import { bookService } from './book';
import { bookAnnotationService } from './book-annotation';
import { bookCollectionService } from './book-collection';
import { chatService } from './chat';
import { chatConversationService } from './chat-conversation';
import { edgeService } from './edge';
import { noteService } from './note';
import { providerService } from './provider';
import { providerCredentialService } from './provider-credential';
import { providerModelService } from './provider-model';
import { pdmService } from './provider-default-model';
import { userService } from './user';
import { userBookService } from './user-book';
import { workspaceService } from './workspace';
import { workspaceBookService } from './workspace-book';
import { workspaceBookCollectionService } from './workspace-book-collection';
import { workspaceMemberService } from './workspace-member';

export {
  BaseService,
  authService,
  bookService,
  bookAnnotationService,
  bookCollectionService,
  chatService,
  chatConversationService,
  edgeService,
  noteService,
  pdmService,
  providerService,
  providerCredentialService,
  providerModelService,
  userService,
  userBookService,
  workspaceService,
  workspaceBookService,
  workspaceBookCollectionService,
  workspaceMemberService,
}
