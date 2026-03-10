import { safeStorage } from 'electron'
import Store from 'electron-store'

interface StorageSchema {
  refreshToken?: string
}

/**
 * Safe Storage
 */
export class StorageManager {
  private store: Store<StorageSchema>

  constructor() {
    this.store = new Store<StorageSchema>({ name: 'secure-storage' })
  }

  set(key: keyof StorageSchema, value: string): boolean {
    if (!safeStorage.isEncryptionAvailable()) {
      console.error('SafeStorage: Encryption is not available on this platform.')
      return false
    }

    try {
      const encrypted = safeStorage.encryptString(value)
      this.store.set(key, encrypted.toString('base64'))
      return true
    } catch (e) {
      console.error(`SafeStorage: Encryption failed for key "${key}":`, e)
      return false
    }
  }

  get(key: keyof StorageSchema): string | null {
    const encryptedStr = this.store.get(key)
    if (typeof encryptedStr !== 'string' || !encryptedStr) {
      return null
    }

    if (!safeStorage.isEncryptionAvailable()) {
      console.warn('SafeStorage: Decryption requested but service unavailable.')
      return null
    }

    try {
      const buffer = Buffer.from(encryptedStr, 'base64')
      return safeStorage.decryptString(buffer)
    } catch (e) {
      console.error(`SafeStorage: Decryption failed for key "${key}":`, e)
      return null
    }
  }

  delete(key: keyof StorageSchema): void {
    this.store.delete(key)
  }
}

export const storageManager = new StorageManager()
