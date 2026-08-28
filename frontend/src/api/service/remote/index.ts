/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from './base'
import { authService } from './auth'
import { bookService } from './book'
import { bookAnnotationService } from './book-annotation'
import { bookCollectionService } from './book-collection'
import { chatService } from './chat'
import { chatConversationService } from './chat-conversation'
import { edgeService } from './edge'
import { fileService } from './file'
import { fileMetaService } from './file-meta'
import { llmService } from './llm'
import { llmProviderService } from './llm-provider'
import { noteService } from './note'
import { noteShareService } from './note-share'
import { noteVersionService } from './note-version'
import { providerService } from './provider'
import { providerCredentialService } from './provider-credential'
import { providerModelService } from './provider-model'
import { pdmService } from './provider-default-model'
import { systemService } from './system'
import { systemSettingService } from './system-setting'
import { ttsService } from './tts'
import { userService } from './user'
import { userBookService } from './user-book'
import { workspaceService } from './workspace'
import { workspaceBookService } from './workspace-book'
import { workspaceBookCollectionService } from './workspace-book-collection'
import { workspaceMemberService } from './workspace-member'

export {
  BaseService,
  authService,
  bookService,
  bookAnnotationService,
  bookCollectionService,
  chatService,
  chatConversationService,
  edgeService,
  fileService,
  fileMetaService,
  llmService,
  llmProviderService,
  noteService,
  noteShareService,
  noteVersionService,
  pdmService,
  providerService,
  providerCredentialService,
  providerModelService,
  systemService,
  systemSettingService,
  ttsService,
  userService,
  userBookService,
  workspaceService,
  workspaceBookService,
  workspaceBookCollectionService,
  workspaceMemberService,
}
