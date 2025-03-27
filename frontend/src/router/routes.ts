import { RouteRecordRaw } from 'vue-router';
import {
  FullPageLayout,
  PageLayout,
  ConsoleLayout,
  ReaderLayout,
  IframePage
} from './utils';

const routes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   component: FullPageLayout,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('pages/page/home/index.vue'),
  //       name: 'home'
  //     },
  //     {
  //       path: 'about',
  //       component: () => import('pages/page/about/index.vue'),
  //       name: 'about'
  //     },
  //     {
  //       path: 'signin',
  //       component: () => import('pages/page/auth/signin/index.vue'),
  //       name: 'signin'
  //     },
  //   ]
  // },
  {
    path: '/start',
    component: ConsoleLayout,
    children: [
      {
        path: '/',
        component: () => import('pages/console/start/welcome/index.vue'),
        name: 'home'
      },
      {
        path: '/welcome',
        component: () => import('pages/console/start/welcome/index.vue'),
        name: 'welcome'
      },
      {
        path: '/dashboard',
        component: () => import('pages/console/start/dashboard/index.vue'),
        name: 'dashboard'
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
  {
    path: '/system',
    component: ConsoleLayout,
    children: [
      {
        path: 'about',
        component: () => import('pages/console/system/about/About.vue'),
        name: 'system-about'
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
    ]
  },
  {
    path: '/reader',
    component: ReaderLayout,
    children: [
      {
        path: 'view',
        component: () => import('pages/console/book/reader/index.vue'),
        name: 'reader-view',
      },
    ]
  },
];

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

const allRoutes = routes.concat(commonRoutes);
export default allRoutes;
