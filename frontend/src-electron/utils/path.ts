import { app } from 'electron'
import path from 'path'

/**
 * App data path
 *
 * APP_ROOT
 */
export const appDataPath = () => {
  return app.getPath('userData') // todo: default
}

export const appLogPath = () => {
  return path.join(appDataPath(), 'logs', 'electron.log')
}

/**
 * App storage path
 *
 * APP_ROOT/storage
 */
export const appStoragePath = () => {
  return path.join(appDataPath(), 'storage')
}

/**
 * App database path
 *
 * APP_ROOT/storage/metadata.db
 */
export const appDbPath = () => {
  return path.join(appStoragePath(), 'metadata.db')
}

/**
 * App book root path
 *
 * APP_ROOT/storage/book
 */
export const appBookRootPath = () => {
  return path.join(appStoragePath(), 'book')
}

/**
 * App public root path
 *
 * APP_ROOT/storage/public
 */
export const appPublicRootPath = () => {
  return path.join(appStoragePath(), 'public')
}
