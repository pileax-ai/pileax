import type { MenuItem } from 'core/types/menu'

/**
 * App default menus
 */
export const defaultConsoleMenus: MenuItem[] = [
  {
    id: 'chat-group',
    name: 'chat._',
    path: '',
    action: 1,
    meta: {icon: 'forum'},
    children: [
      {
        id: 'start',
        name: 'quickstart',
        path: '/welcome',
        action: 1,
        meta: {icon: 'rocket'}
      },
      {
        id: 'test',
        name: 'Test',
        path: '/test',
        action: 1,
        meta: {icon: 'network_check', hidden: !!process.env.PROD}
      },
      {
        id: 'chat',
        name: 'chat.new',
        path: '/chat',
        action: 1,
        meta: {icon: 'add_comment', iconClass: 'flip-horizontal', class: 'highlight'}
      },
    ]
  },
  {
    id: 'note-group',
    name: 'note._',
    path: '',
    action: 1,
    meta: {icon: 'notes'},
    children: [
    ]
  },
  {
    id: 'reading-group',
    name: 'reading._',
    path: '',
    action: 1,
    meta: {icon: 'chrome_reader_mode'},
    children: [
      {
        id: 'book-library',
        name: 'book.shelf',
        action: 1,
        path: '/book/library',
        meta: {icon: 'icon-book-library'}
      },
      {
        id: 'book-collection',
        name: 'book.collection',
        action: 1,
        path: '/book/collection',
        meta: {icon: 'icon-reading-list'}
      },
      {
        id: 'book-annotation',
        name: 'book.annotation',
        action: 1,
        path: '/book/annotation',
        meta: {icon: 'article'}
      },
    ]
  },
  {
    id: 'knowledge-group',
    name: 'knowledge.base',
    path: '',
    action: 1,
    meta: {icon: 'icon-knowledge-base'},
    children: [
      {
        id: 'knowledge-start',
        name: 'knowledge.base',
        action: 1,
        path: '/knowledge',
        meta: {icon: 'icon-knowledge-base', class: 'highlight'}
      },
      {
        id: 'system-files',
        name: 'file',
        path: '',
        action: 1,
        meta: {icon: 'folder_open'},
        children: [
          {
            id: 'file-all',
            name: 'all',
            action: 1,
            path: '/system/files',
            meta: {icon: 'mdi-creation', class: 'dense'}
          },
          {
            id: 'file-documents',
            name: 'document',
            action: 1,
            path: '/system/files/application',
            meta: {icon: 'mdi-creation', class: 'dense'}
          },
          {
            id: 'file-images',
            name: 'image',
            action: 1,
            path: '/system/files/image',
            meta: {icon: 'mdi-creation', class: 'dense'}
          },
        ]
      },
    ]
  },
  {
    id: 'system-group',
    name: 'ai.apps',
    path: '',
    action: 1,
    meta: {icon: 'mdi-creation'},
    children: [
      {
        id: 'chat-assistants',
        name: 'chat.assistants',
        action: 1,
        path: '/system/config/assistants',
        meta: {icon: 'assistant_navigation'}
      },
      {
        id: 'ai-agents',
        name: 'ai.agents',
        action: 1,
        path: '/system/config/agents',
        meta: {icon: 'assignment'}
      },
    ]
  },
]
