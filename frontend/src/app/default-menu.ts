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
        name: 'chat',
        path: '/chat',
        action: 1,
        meta: {icon: 'add_comment'}
      },
      // {
      //   id: 'chat-chat',
      //   name: 'Chat Session',
      //   path: '/a/chat/uuid',
      //   action: 1,
      //   meta: {icon: 'forum'}
      // },
      // {
      //   id: 'welcome',
      //   name: 'welcome',
      //   path: '/welcome',
      //   action: 1,
      //   meta: {icon: 'accessibility'}
      // },
      // {
      //   id: 'dashboard',
      //   name: 'dashboard',
      //   path: '/dashboard',
      //   action: 1,
      //   meta: {icon: 'mdi-gauge'}
      // },
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
    id: 'group-system',
    name: 'AI',
    path: '',
    action: 1,
    meta: {icon: 'mdi-creation'},
    children: [
      {
        id: 'stock-account-list',
        name: 'AI智能体',
        action: 1,
        path: '/stock/account/list',
        meta: {icon: 'mdi-creation'}
      },
      {
        id: 'stock-trade-strategy-list',
        name: '自定义',
        action: 1,
        path: '/stock/trade/strategy/list',
        meta: {icon: 'assignment'}
      },
      {
        id: 'stock-transaction-record-list',
        name: '交易记录',
        action: 1,
        path: '/stock/transaction/record/list',
        meta: {icon: 'view_headline'}
      },
    ]
  },
];
