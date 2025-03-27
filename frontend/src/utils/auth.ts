/**
 * Auth
 *
 * @author Xman
 * @version 1.0
 */
import { jwtDecode } from 'jwt-decode';
import sha1 from 'crypto-js/sha1';

import { getCookieItemObject } from 'core/utils/storage';
import { MenuItem } from 'core/types/menu'
// import store from 'src/store';

const FRONT_END_SALT = 'fNrV0BKheNDDEM5oqzuM';

// ================================================================================
// Common API
// ================================================================================
export const encryptPassword = (password: string) => {
  if (!password) return password;
  return sha1(`${FRONT_END_SALT}${password}`).toString();
}


// ================================================================================
// Authentication Util
// ================================================================================
export const getAccount = () => {
  return getCookieItemObject('account') as Indexable;
}

export const getRoles = () => {
  // return store.getters.accountInfo.account?.roles;
  // if (store.getters.isSignin) {
  //   const user = store.getters.accountInfo.user;
  //   const roles = user?.roles || 'user';
  //   return roles.split(',');
  // } else {
  //   return [];
  // }
  return [];
}


// --------------------------------------------------------------------------------
// JwtToken
// --------------------------------------------------------------------------------
export const checkJwtToken = () => {
  if (!validateJwtToken()) {
    // return store.dispatch('A_SET_COMPONENT', {
    //   type: 'signin',
    //   action: 'resign'
    // });
  }
}

/**
 * 检查 JWT Token
 * @returns {boolean}
 */
export function validateJwtToken () {
  const account = getAccount();
  const token = account.token;
  // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjoiMHgwZGI3MDczZDg3M0E0QzhkMDNjMzU2NWVlYzk1ODgzYzAyMGMyYzg3IiwiaXNzIjoiWWlpTm90ZSIsImV4cCI6MTY2MjIyOTcxOSwiaWF0IjoxNjYyMDU2OTE5LCJ1c2VySWQiOiI2Y2JkYjQwNTM5ZDc0MDEyYjdjNjIwODJjYzk5NTJmNiJ9.3r93PY3vTOJ_paWukO8GTyubldaqwrWrafVi7EXRfcQ';
  if (token) {
    // const data = jwtDecode(token);
    // const currentTime = parseInt((new Date()).getTime() / 1000);
    // return currentTime < data.exp;
    return true;
  } else {
    return false;
  }
}

export function hasPermission (permissionRoles: string[]) {
  const roles: string[] = getRoles();
  // console.log('roles', roles);

  if (!permissionRoles) return true;
  if (!roles) return false;
  if (roles.indexOf('admin') >= 0) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0);
}

export function hasPathPermission (to: Indexable) {
  if (process.env.ENV_CONFIG === 'dev') {
    return true;
  } else {
    // const appMenuList = store.getters.appMenuList;
    const appMenuList: MenuItem[] = [];
    return appMenuList.some(menu => menu.path.indexOf(to.path) >= 0);
  }
}

export const setPageStatus = (status: number) => {
  // return store.dispatch('A_SET_PAGE_STATUS', status);
}

export const checkPagePermission = async (route: any) => {
  if (hasPathPermission(route)) {
    await setPageStatus(200);
  } else {
    await setPageStatus(403);
  }
}
