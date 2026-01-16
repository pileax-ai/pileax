import type { RouteRecordRaw } from 'vue-router'
import {
  FullPageLayout,
  PageLayout,
  ConsoleLayout,
  ReaderLayout,
  IframePage
} from './utils'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: FullPageLayout,
    children: [
      {
        path: '',
        component: () => import('pages/page/home/index.vue'),
        name: 'home'
      },
      {
        path: 'about',
        component: () => import('pages/page/about/index.vue'),
        name: 'about'
      },
      {
        path: 'auth/signin',
        component: () => import('pages/page/auth/signin/index.vue'),
        name: 'signin'
      },
      {
        path: 'auth/signup',
        component: () => import('pages/page/auth/signup/index.vue'),
        name: 'signup'
      },
    ]
  },
  {
    path: '/start',
    component: ConsoleLayout,
    children: [
      {
        path: '/welcome',
        component: () => import('pages/console/start/welcome/index.vue'),
        name: 'welcome'
      },
      {
        path: '/test',
        component: () => import('pages/console/start/test/index.vue'),
        name: 'test'
      },
    ]
  },
  {
    path: '/chat',
    component: ConsoleLayout,
    children: [
      {
        path: '',
        component: () => import('pages/console/chat/assistant/index.vue'),
        name: 'chat-assistant',
        meta: { keep: true },
        children: [
          {
            path: '',
            component: () => import('pages/console/chat/assistant/conversation/index.vue'),
            name: 'chat-start'
          },
          {
            path: '/a/chat/:appId/:id',
            component: () => import('pages/console/chat/assistant/conversation/index.vue'),
            name: 'chat-conversation'
          },
        ]
      },
    ]
  },
  {
    path: '/note',
    component: ConsoleLayout,
    children: [
      {
        path: ':id',
        component: () => import('pages/console/note/note/index.vue'),
        name: 'note',
      },
    ]
  },
  {
    path: '/book',
    component: ConsoleLayout,
    children: [
      {
        path: 'library',
        component: () => import('pages/console/book/book/List.vue'),
        name: 'book-library',
      },
      {
        path: 'annotation',
        component: () => import('pages/console/book/annotation/List.vue'),
        name: 'book-annotation',
      },
      {
        path: 'collection',
        component: () => import('pages/console/book/collection/List.vue'),
        name: 'book-collection',
      },
    ]
  },
  {
    path: '/reader',
    component: ReaderLayout,
    children: [
      {
        path: 'book',
        component: () => import('pages/console/book/reader/index.vue'),
        name: 'reader-book',
      },
      {
        path: 'annotation',
        component: () => import('pages/console/book/reader/index.vue'),
        name: 'reader-annotation',
      },
    ]
  },
  {
    path: '/knowledge',
    component: ConsoleLayout,
    children: [
      {
        path: '',
        component: () => import('pages/console/knowledge/start/List.vue'),
        name: 'knowledge-start'
      },
      {
        path: ':id',
        component: () => import('pages/console/knowledge/knowledge/index.vue'),
        name: 'knowledge'
      },
    ]
  },
  {
    path: '/ai',
    component: ConsoleLayout,
    children: [
      {
        path: 'app/agents',
        component: () => import('pages/console/ai/agent/List.vue'),
        name: 'ai-app-agents'
      },
      {
        path: 'app/assistants',
        component: () => import('pages/console/ai/assistant/List.vue'),
        name: 'ai-app-assistants'
      },
    ]
  },
  {
    path: '/system',
    component: ConsoleLayout,
    children: [
      {
        path: 'files',
        component: () => import('pages/console/system/content/file/List.vue'),
        name: 'system-files'
      },
      {
        path: 'files/:mimetype',
        component: () => import('pages/console/system/content/file/List.vue'),
        name: 'system-files-mimetype'
      },
      {
        path: 'about',
        component: () => import('pages/console/system/about/About.vue'),
        name: 'system-about'
      },
    ]
  },
  {
    path: '/page',
    component: ConsoleLayout,
    children: [
      {
        path: '/exception/404',
        component: () => import('pages/error/404.vue'),
        name: 'exception-404'
      },
      {
        path: '/iframe/docs',
        component: IframePage,
        name: 'iframe-docs',
        meta: {isIframe: true}
      },
    ]
  },
]

export const commonRoutes: RouteRecordRaw[] = [
  { // Always leave this as last one
    path: '/:catchAll(.*)*',
    component: PageLayout,
    children: [
      {
        path: '',
        component: () => import('pages/error/404.vue'),
        name: 'page-error'
      },
    ]
  }
]

const allRoutes = routes.concat(commonRoutes)
export default allRoutes
