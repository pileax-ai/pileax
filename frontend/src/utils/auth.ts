/**
 * Auth
 *
 * @author Xman
 * @version 1.0
 */
import { jwtDecode } from 'jwt-decode'

import {
  getCookieItem,
  getItem,
  getItemObject,
  getSessionItem,
  getSessionItemObject,
  saveItem,
  saveItemObject,
} from 'core/utils/storage'
import { authService } from 'src/api/service/remote/auth'
import type { MenuItem } from 'core/types/menu'
import { UUID } from 'core/utils/crypto'
import { ipcService } from 'src/api/ipc'

// -----------------------------------------------------------------------------
// Authentication Util
// -----------------------------------------------------------------------------
export const saveToken = (token: Indexable) => {
  const { accessToken, collabToken, refreshToken, tokenType } = token

  // Save refreshToken in Cookie or Safe area
  ipcService.secureSet('refreshToken', refreshToken)

  return saveItemObject('token', {
    accessToken,
    collabToken,
    tokenType,
    exp: getJwtTokenExp(accessToken)
  })
}

export const getToken = () => {
  return getItemObject('token') as Indexable
}

export const getTokenExp = () => {
  const token = getToken()
  return token?.exp || Number.MAX_SAFE_INTEGER
}

export const getAuthorization = () => {
  const token = getToken()
  if (!token.accessToken) return ''

  return `${token.tokenType} ${token.accessToken}`
}

export const getCollabToken = () => {
  const token = getToken()

  return token?.collabToken ?? ''
}

export const getWorkspaceId = (): string => {
  // Use active workspace by default
  const workspace = getSessionItemObject('workspace') as Indexable
  // console.log('workspace', workspace?.workspace)
  if (workspace?.workspace) {
    return workspace.workspace?.id
  }

  // Fallback, use parent workspace
  const account = getItemObject('account') as Indexable
  // console.log('account', account)
  return account?.parentWorkspace || ''
}


export const getDeviceId = (): string => {
  let deviceId = getItem('did') as string

  if (!deviceId) {
    deviceId = UUID()
    saveItem('did', deviceId)
  }

  return deviceId
}


export const getLocale = (): string => {
  const app = getItemObject('app')

  return app?.setting?.locale || 'en'
}


// -----------------------------------------------------------------------------
// JwtToken
// -----------------------------------------------------------------------------
export const getJwtToken = () => {
  const token = getToken()
  return token.accessToken || ''
}

export const getJwtTokenExp = (token: string) => {
  try {
    const payload: { exp?: number } = jwtDecode(token)
    return payload.exp
  } catch (err) {
    return  null
  }
}

/**
 * Validate JWT Token
 * @returns {boolean}
 */
export const validateJwtToken = (token?: string, bufferSeconds: number = 0): boolean => {
  if (!token) return false

  try {
    const payload: { exp?: number } = jwtDecode(token)
    if (!payload.exp) return false

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp - currentTime > bufferSeconds
  } catch (err) {
    return  false
  }
}

export const isTokenNeedRefresh = (): boolean => {
  const exp = getTokenExp()
  const currentTime = Math.floor(Date.now() / 1000)
  const validTime = exp - currentTime
  return validTime > 0 && validTime < 5 * 60 // 5 minutes
}

export const refreshToken = (source = 'retry'): Promise<Indexable> => {
  return new Promise((resolve, reject) => {
    authService.refreshToken().then(res => {
      saveToken(res)
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// -----------------------------------------------------------------------------
// Permission
// -----------------------------------------------------------------------------
export function hasPathPermission (to: Indexable) {
  if (process.env.ENV_CONFIG === 'dev') {
    return true
  } else {
    const appMenuList: MenuItem[] = []
    return appMenuList.some(menu => menu.path.indexOf(to.path) >= 0)
  }
}

export const setPageStatus = (status: number) => {
  // return store.dispatch('A_SET_PAGE_STATUS', status);
}

export const checkPagePermission = (route: any) => {
  if (hasPathPermission(route)) {
    setPageStatus(200)
  } else {
    setPageStatus(403)
  }
}
