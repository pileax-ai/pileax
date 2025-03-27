import axios from 'axios';
import { getCommonHeaders } from 'core/utils/common';
import { notifyWarning } from 'core/utils/control';
import { clearStorage, removeCookieItem } from 'core/utils/storage';
import { routerInstance } from 'src/boot/router';
import useRequest from 'src/hooks/useRequest';

const { baseUrl } = useRequest();

// Create axios instance
const service = axios.create({
  baseURL: baseUrl.value,
  timeout: 60000    // 请求超时时间
});

// Request interceptors
// ================================================================================
service.interceptors.request.use(config => {
  console.log('request', config)
  // Headers
  if (config.url && config.url.indexOf('http') < 0) {
    const headers = getCommonHeaders();
    config.headers = Object.assign(config.headers, headers);
  }

  return config;
}, error => {
  console.log('Request error', error);
  Promise.reject(error);
})

// Response interceptors
// ================================================================================
service.interceptors.response.use(
  response => response,
  error => {
    // console.log('request error', error.response);
    let message = error.message;
    if (error.response && error.response.data) {
      message = error.response.data.msg || error.response.data.Message;
      if (error.response.status == 401) {
        // console.log('401', routerInstance);
        removeCookieItem('account');
        routerInstance.push('/');
      } else {
        notifyWarning(message, {position: 'top'});
      }
    }

    return Promise.reject(new Error(message));
  })

export default service;
