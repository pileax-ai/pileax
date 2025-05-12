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
  aiProvider: '/ai/provider',
  auth: '/auth',
  book: '/book',
  bookAnnotation: '/book/annotation',
  chat: '/chat',
  chatSession: '/chat/session',
  file: '/file',
  note: '/note',
  knowledge: '/knowledge',
  user: '/user',
  userBook: '/user/book',
  systemConfig: '/system/config',
  systemHealthCheck: '/system/health-check',
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

export const postRequest = (data: RequestOptions) => {
  const url = getUrl(data)
  const body = data.body

  return request({
    url: url,
    method: 'post',
    params: data.query || {},
    data: body,
    headers: data.headers
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
