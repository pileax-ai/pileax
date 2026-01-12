import { createHash } from 'crypto'
import path from 'node:path'
import fs from 'node:fs'
import fsExtra from 'fs-extra'

/**
 * Read local file
 *
 * @param filePath absolute path
 * @deprecated
 */
export const readFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const sha1 = createHash('sha1').update(data).digest('hex')
      resolve({ buffer: data, sha1: sha1 })
    })
  })
}

/**
 * Get image base64 string
 *
 * @param filePath absolute path
 */
export const readImage = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const base64String = data.toString('base64')
      const extension = path.extname(filePath).substring(1)
      const base64DataUrl = `data:image/${extension};base64,${base64String}`
      resolve({ url: base64DataUrl })
    })
  })
}

/**
 * Save image file
 *
 * @param metadata { filePath, data }
 */
export const saveImageFile = (metadata: any) => {
  return new Promise((resolve, reject) => {
    const { filePath, data } = metadata
    const parts = data.split(',')

    const imageExt = parts[0].split('/')[1].split(';')[0]
    const timestamp = Math.floor(Date.now() / 1000)
    const imageName = `share.${timestamp}.${imageExt}`
    const imageFilePath = path.join(filePath, imageName)

    const base64Data = parts[1]
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFile(imageFilePath, buffer, (err: any) => {
      if (err) {
        console.error('Failed to save image file:', err)
        reject(err)
        return
      }
      resolve({ path: imageFilePath, name: imageName })
    })
  })
}

export async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fsExtra.readdir(dirPath)
    return files.length === 0
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error(`目录不存在：${dirPath}`)
    }
    if (err.code === 'ENOTDIR') {
      throw new Error(`路径不是目录：${dirPath}`)
    }
    throw err
  }
}

export function isDirectoryExists(dirPath: string): boolean {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
  } catch {
    return false
  }
}
