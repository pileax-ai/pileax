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
        meta: {icon: 'home'}
      },
      {
        id: 'chat',
        name: 'newChat',
        path: '/chat',
        action: 1,
        meta: {icon: 'add_comment'}
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
        name: '书库',
        action: 1,
        path: '/book/library',
        meta: {icon: 'library_books'}
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
    meta: {icon: 'mdi-creation'},
    children: [
      {
        id: 'knowledge-start',
        name: '知识库',
        action: 1,
        path: '/knowledge',
        meta: {icon: 'mdi-creation'}
      },
    ]
  },
  {
    id: 'group-system',
    name: 'system',
    path: '',
    action: 1,
    meta: {icon: 'tune'},
    children: [
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
            id: 'ai-agents',
            name: 'AI智能体',
            action: 1,
            path: '/system/config/agents',
            meta: {icon: 'assignment'}
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
        name: '内容',
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
      {
        id: 'system-about',
        name: 'about',
        action: 1,
        path: '/system/about',
        meta: {icon: 'info'}
      },
    ]
  },
];
