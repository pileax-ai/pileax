/**
 * API
 *
 * @version 1.0
 */

import { api as request } from 'src/boot/axios';
import { RequestOptions } from 'core/types/request';

/**
 * API Url Registration
 */
const urls: Indexable = {
  authSignin: '/auth/signin',

  account: '/admin/user',
  authLogin: '/auth/login',
  book: '/book',
  bookAnnotation: '/book/annotation',
  chat: '/chat',
  chatSession: '/chat/session',
  clientVersion: '/client/version',
  note: '/note',
  platformConfig: '/platform/config',
  platformDict: '/platform/dict',
  platformDictItem: '/platform/dict/item',
  platformDictItemSelect: '/platform/dict/item/select',
  platformFileMeta: '/platform/file/meta',
  platformHelp: '/platform/help',
  prompt: '/prompt',
  promptCategory: '/prompt/category',
  role: '/role',
  roleMenu: '/role/menu',
  roleMenuQueryByRole: '/role/menu/query/byrole',
  slide: '/platform/slide',
  statistics: '/system/statistics',
  user: '/user',
  userQueryDetails: '/user/query/details',
  userSigninRecord: '/user/signin/record',
  userUsage: '/user/usage',
  systemMenu: '/system/menu',
  systemHealthCheck: '/system/health-check',
  systemMenuQueryApp: '/system/menu/query/app',
  systemOperationLog: '/system/operation/log',
};

// 排序
export const orderedUrls = () => {
  const ordered = Object.keys(urls).sort().reduce(
    (obj: Indexable, key: string) => {
      obj[key] = urls[key];
      return obj;
    },
    {}
  );
  console.log('ordered', ordered);
  return ordered;
}

export const getUrl = (data: RequestOptions) => {
  const name = data.name;
  const path = data.path;
  let url = '';
  if (name.indexOf('http') === 0 || name.indexOf('/') === 0) {
    url = name;
  } else {
    url = urls[name] ? urls[name] : '';
  }
  if (path) {
    url += path;
  }

  return url;
}

export const getRequest = (data: RequestOptions) => {
  const url = getUrl(data)

  return request({
    url: url,
    method: 'get',
    params: data.query
  })
}

export const postRequest = (data:RequestOptions) => {
  const url = getUrl(data)
  const body = data.body

  return request({
    url: url,
    method: 'post',
    params: data.query || {},
    data: body
  })
}

export const putRequest = (data: RequestOptions) => {
  const url = getUrl(data)
  const body = data.body

  return request({
    url: url,
    method: 'put',
    params: data.query || {},
    data: body
  })
}

export const deleteRequest = (data: RequestOptions) => {
  const url = getUrl(data)

  return request({
    url: url,
    method: 'delete',
    params: data.query
  })
}
