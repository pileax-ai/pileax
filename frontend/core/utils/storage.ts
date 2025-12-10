/**
 * Storage: Cookies, LocalStorage
 *
 * @author Xman
 * @version 1.0
 */
import { Cookies, LocalStorage, SessionStorage } from 'quasar'
import { CODE } from 'core/app';

export const COOKIE_OPTIONS = {
  // secure: true,
  // expires: 30,
  path: '/',
  domain: process.env.DOMAIN,
  sameSite: 'Strict'
};

export const PREFIX = `${CODE}.`;

// ================================================================================
// LocalStorage
// ================================================================================

/**
 * 获取
 */
export function getItem (name: string) {
  let item = LocalStorage.getItem(PREFIX + name);
  item = (item === 'undefined') ? '' : item;
  return item;
}

export function getItemInt (name: string) {
  let item = getItem(name);
  item = (item === 'undefined' || !item) ? 0 : parseInt(item as string);
  return item;
}

/**
 * 获取 JSON 对象
 * @param name
 * @returns {string|*}
 */
export function getItemObject (name: string) {
  const item = getItem(name);
  return (item) ? JSON.parse(item as string) : {};
}
export function getItemArray (name: string) {
  const item = getItem(name)
  return (item) ? JSON.parse(item as string) : [];
}

/**
 * 保存
 */
export function saveItem (name: string, value: any) {
  return LocalStorage.set(PREFIX + name, value);
}

export function saveItemObject (name: string, value: any) {
  return LocalStorage.set(PREFIX + name, JSON.stringify(value));
}

/**
 * 删除
 */
export function removeItem (name: string) {
  return LocalStorage.remove(PREFIX + name);
}

/**
 * 删除所有
 */
export function removeAll(prefix = PREFIX) {
  const keys = [];
  const length = LocalStorage.getLength();
  for (let i = 0; i < length; i++) {
    const key = LocalStorage.getKey(i);
    keys.push(key);
  }

  console.log('removeAll', keys);
  for (const key of keys) {
    if (key && key.indexOf(prefix) >= 0) {
      LocalStorage.remove(key);
    }
  }
}

export function removeUserData(prefix = PREFIX) {
  const userKeys = ['account', 'ai', 'chat', 'note', 'tab', 'user', 'workspace'];

  // localStorage
  let keys = Object.keys(localStorage)
  for (const k of keys) {
    console.log('localStorage', k)
    if (userKeys.some(u => k.startsWith(`${prefix}${u}`))) {
      LocalStorage.remove(k);
    }
  }

  // sessionStorage
  keys = Object.keys(sessionStorage)
  for (const k of keys) {
    console.log('sessionStorage', k)
    if (userKeys.some(u => k.startsWith(`${prefix}${u}`))) {
      SessionStorage.remove(k);
    }
  }
}

// ================================================================================
// Cookie
// ================================================================================
/**
 * 获取
 */
export function getCookieItem (name: string, prefix = PREFIX) {
  let item = Cookies.get(prefix + name);
  item = (item === 'undefined') ? '' : item;
  return item;
}

/**
 * 获取 JSON 对象
 * @param name
 * @returns {string|*}
 */
export function getCookieItemObject (name: string, prefix = PREFIX) {
  const item = getCookieItem(name, prefix);
  return item || {};
}

/**
 * 保存
 */
export function saveCookieItem (name: string, value: any, prefix = PREFIX, options = COOKIE_OPTIONS) {
  return Cookies.set(prefix + name, value, options as any);
}
export function saveCookieItemObject (name: string, value: any, prefix = PREFIX, options = COOKIE_OPTIONS) {
  return Cookies.set(prefix + name, JSON.stringify(value), options as any);
}
/**
 * 删除
 */
export function removeCookieItem (name: string, prefix = PREFIX, options = COOKIE_OPTIONS) {
  return Cookies.remove(prefix + name, options);
}

/**
 * 删除所有
 */
export function removeAllCookies (prefix = PREFIX, options = COOKIE_OPTIONS) {
  const allCookies = Cookies.getAll();
  for (const key in allCookies) {
    if (key.indexOf(prefix) === 0) {
      Cookies.remove(key, options);
    }
  }
}

// ================================================================================
// Session
// ================================================================================
/**
 * 获取
 */
export function getSessionItem (name: string, prefix = PREFIX) {
  let item = SessionStorage.getItem(prefix + name);
  item = (item === 'undefined') ? '' : item;
  return item;
}

/**
 * 获取 JSON 对象
 * @param name
 * @returns {string|*}
 */
export function getSessionItemObject (name: string, prefix = PREFIX) {
  const item = getSessionItem(name, prefix);
  return item || {};
}

/**
 * 保存
 */
export function saveSessionItem (name: string, value: any, prefix = PREFIX) {
  return SessionStorage.set(prefix + name, value);
}
export function saveSessionItemObject (name: string, value: any, prefix = PREFIX) {
  return SessionStorage.set(prefix + name, JSON.stringify(value));
}


// ================================================================================
// Common
// ================================================================================

export function clearUserCache () {
  removeUserData();
  removeAllCookies();
}

export function clearStorage () {
  removeAll();
  removeAllCookies();
}
