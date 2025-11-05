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

export const getUrl = (options: RequestOptions) => {
  const name = options.name;
  const path = options.path;
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

export const getRequest = (options: RequestOptions) => {
  const url = getUrl(options)

  return request({
    url: url,
    method: 'get',
    withCredentials: options.withCredentials,
    params: options.query
  })
}

export const postRequest = (options: RequestOptions) => {
  const url = getUrl(options)
  const body = options.body

  return request({
    url: url,
    method: 'post',
    withCredentials: options.withCredentials,
    params: options.query || {},
    data: body,
    headers: options.headers
  })
}

export const putRequest = (options: RequestOptions) => {
  const url = getUrl(options)
  const body = options.body

  return request({
    url: url,
    method: 'put',
    withCredentials: options.withCredentials,
    params: options.query || {},
    data: body
  })
}

export const deleteRequest = (options: RequestOptions) => {
  const url = getUrl(options)

  return request({
    url: url,
    method: 'delete',
    withCredentials: options.withCredentials,
    params: options.query
  })
}
