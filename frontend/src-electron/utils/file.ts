import { createHash } from 'crypto';
import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';

import { appBookRootPath } from './path';

/**
 * Read local file
 *
 * @param filePath absolute path
 */
export const readFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const sha1 = createHash('sha1').update(data).digest('hex');
      resolve({ buffer: data, sha1: sha1 });
    });
  });
}

/**
 * Read book's cover
 *
 * @param filePath relative path
 */
export const readBookFile = (filePath: string) => {
  const fileFullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(appBookRootPath(), filePath);
  return readFile(fileFullPath);
}

//
/**
 * Get image base64 string
 *
 * @param filePath absolute path
 */
export const readImage = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const base64String = data.toString('base64');
      const extension = path.extname(filePath).substring(1);
      const base64DataUrl = `data:image/${extension};base64,${base64String}`;
      resolve({ url: base64DataUrl });
    });
  });
}

/**
 * Read book's cover
 *
 * @param filePath relative path
 */
export const readBookCover = (filePath: string) => {
  const fileFullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(appBookRootPath(), filePath);
  return readImage(fileFullPath);
}

/**
 * Save book files
 *
 * Create book directory, and copy book/cover to new director.
 * @param metadata {sha1, filePath, cover}
 */
export const saveBookFiles = (metadata: any) => {
  return new Promise((resolve, reject) => {
    const bookPath = metadata.sha1; // relative path. todo: human-readable path
    const bookFullPath = path.join(appBookRootPath(), bookPath);
    fs.mkdir(bookFullPath, {recursive: true}, (err: any) => {
      if (err) {
        console.error('Failed to create book directory:', err);
        reject(err);
        return;
      }

      // book file
      const originalBookFilePath = metadata.filePath;
      const bookExt = path.extname(originalBookFilePath);
      const fileName = `book${bookExt}`;
      const bookFilePath = path.join(bookFullPath, fileName);
      fs.copyFile(originalBookFilePath, bookFilePath, (err: any) => {
        if (err) {
          console.error('Failed to copy book file:', err);
          reject(err);
          return;
        }

        // cover file
        const coverData = metadata.cover;
        const parts = coverData.split(',');

        const coverExt = parts[0].split('/')[1].split(';')[0];
        const coverName = `cover.${coverExt}`;
        const coverFilePath = path.join(bookFullPath, coverName);

        const base64Data = parts[1];
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFile(coverFilePath, buffer, (err: any) => {
          if (err) {
            console.error('Failed to save cover file:', err);
            reject(err);
            return;
          }
          console.log('saveBookFile', bookFilePath, coverFilePath);
          resolve({ path: bookPath, fileName: fileName, coverName: coverName });
        })
      })
    });
  });
}

/**
 * Remove book directory
 *
 * @param bookPath relative path
 */
export const removeBookFiles = (bookPath: string) => {
  const bookFullPath = path.isAbsolute(bookPath)
    ? bookPath
    : path.join(appBookRootPath(), bookPath);
  fsExtra.remove(bookFullPath);
}

/**
 * Save image file
 *
 * @param metadata { filePath, data }
 */
export const saveImageFile = (metadata: any) => {
  return new Promise((resolve, reject) => {
    const { filePath, data } = metadata
    const parts = data.split(',');

    const imageExt = parts[0].split('/')[1].split(';')[0];
    const timestamp = Math.floor(Date.now() / 1000);
    const imageName = `share.${timestamp}.${imageExt}`;
    const imageFilePath = path.join(filePath, imageName);

    const base64Data = parts[1];
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFile(imageFilePath, buffer, (err: any) => {
      if (err) {
        console.error('Failed to save image file:', err);
        reject(err);
        return;
      }
      resolve({ path: imageFilePath, name: imageName });
    })
  });
}
