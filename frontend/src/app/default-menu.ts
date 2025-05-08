import { MenuItem } from 'core/types/menu';

/**
 * App default menus
 */
export const defaultConsoleMenus: MenuItem[] = [
  {
    id: 'group-chat',
    name: 'chat',
    path: '',
    action: 1,
    meta: {icon: 'forum'},
    children: [
      {
        id: 'start',
        name: 'quickstart',
        path: '/',
        action: 1,
        meta: {icon: 'rocket'}
      },
      {
        id: 'chat',
        name: '随便聊聊',
        path: '/chat',
        action: 1,
        meta: {icon: 'add_comment', iconClass: 'flip-horizontal', class: 'highlight'}
      },
    ]
  },
  {
    id: 'group-note',
    name: 'note',
    path: '',
    action: 1,
    meta: {icon: 'notes'},
    children: [
    ]
  },
  {
    id: 'group-reading',
    name: 'reading',
    path: '',
    action: 1,
    meta: {icon: 'chrome_reader_mode'},
    children: [
      {
        id: 'book-library',
        name: '书架',
        action: 1,
        path: '/book/library',
        meta: {icon: 'icon-book-library'}
      },
      {
        id: 'book-list',
        name: '书单',
        action: 1,
        path: '/book/reading-list',
        meta: {icon: 'icon-reading-list'}
      },
      {
        id: 'book-annotation',
        name: '书摘',
        action: 1,
        path: '/book/annotation',
        meta: {icon: 'article'}
      },
    ]
  },
  {
    id: 'group-knowledge',
    name: 'knowledge',
    path: '',
    action: 1,
    meta: {icon: 'icon-knowledge-base'},
    children: [
      {
        id: 'knowledge-start',
        name: '知识库',
        action: 1,
        path: '/knowledge',
        meta: {icon: 'icon-knowledge-base', class: 'highlight'}
      },
      {
        id: 'system-files',
        name: '文件',
        path: '',
        action: 1,
        meta: {icon: 'folder_open'},
        children: [
          {
            id: 'file-all',
            name: '全部',
            action: 1,
            path: '/system/files',
            meta: {icon: 'mdi-creation', class: 'dense'}
          },
          {
            id: 'file-documents',
            name: '文档',
            action: 1,
            path: '/system/files?category=documents',
            meta: {icon: 'mdi-creation', class: 'dense'}
          },
          {
            id: 'file-images',
            name: '图片',
            action: 1,
            path: '/system/files?category=images',
            meta: {icon: 'mdi-creation', class: 'dense'}
          },
        ]
      },
    ]
  },
  {
    id: 'group-system',
    name: 'AI应用',
    path: '',
    action: 1,
    meta: {icon: 'mdi-creation'},
    children: [
      {
        id: 'ai-assistants',
        name: '聊天助手',
        action: 1,
        path: '/system/config/assistants',
        meta: {icon: 'assistant_navigation'}
      },
      {
        id: 'ai-agents',
        name: 'AI智能体',
        action: 1,
        path: '/system/config/agents',
        meta: {icon: 'assignment'}
      },
      {
        id: 'config',
        name: '配置',
        action: 1,
        path: '',
        meta: {icon: 'tune'},
        children: [
          {
            id: 'ai-providers',
            name: 'AI提供商',
            action: 1,
            path: '/system/config/providers',
            meta: {icon: 'mdi-creation'}
          },
          {
            id: 'vector-database',
            name: '向量数据库',
            action: 1,
            path: '/system/config/vector-databases',
            meta: {icon: 'assignment'}
          },
        ]
      },
      {
        id: 'content',
        name: 'AIGC',
        action: 1,
        path: '',
        meta: {icon: 'web_stories'},
        children: [
          {
            id: 'system-files',
            name: '文件',
            action: 1,
            path: '/system/files',
            meta: {icon: 'article'}
          },
        ]
      },
    ]
  },
];
