import multer, { FileFilterCallback, Multer, StorageEngine } from 'multer'
import path from 'path';
import fs from 'fs';
import { env } from '@/common/utils/envConfig';
import { MiscUtil } from '@/common/utils/miscUtil'

export interface UploadOptions {
  isArray: boolean
  maxCount?: number
  subDir?: string
  fileName?: string
  type?: string
}

const FileAllowedTypes: Indexable = {
  file: [
    'image',
    'application',
    'text',
  ],
  image: [
    'image',
    'application/octet-stream',
  ],
  book: [
    'ebook',
    'azw3',
    'epub',
    'mobi',
    'fb2',
    'cbz',
    'pdf',
  ]
}

const isBook = (file: Express.Multer.File) => {
  const extname = path.extname(file.originalname);
  return  FileAllowedTypes.book.find((e: string) => file.mimetype.indexOf(e) >= 0 || extname.includes(e));
}

export class MulterUtil {
  /**
   * Get Multer instance
   * @param options Upload options
   */
  static getUploader(options: UploadOptions): Multer {
    const storage: StorageEngine = multer.diskStorage({
      destination: (req: Express.Request, file: Express.Multer.File, cb) => {
        // Build upload dir
        const baseDir = env.PUBLIC_ROOT;
        const uploadDir = options.subDir
          ? path.join(baseDir, options.subDir)
          : path.join(baseDir, `file/${MiscUtil.currentDate()}`);

        // Create upload dir
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req: Express.Request, file: Express.Multer.File, cb) => {
        // File name
        const finalFilename = options.fileName
          ? options.fileName + path.extname(file.originalname)
          : `${MiscUtil.uuid()}-${file.originalname}`;
        cb(null, finalFilename);
      }
    });

    return multer({
      storage,
      fileFilter: (req, file, cb) => {
        const type = options.type || 'file';
        const allowedTypes = FileAllowedTypes[type] || FileAllowedTypes.file;
        const allowed = allowedTypes.find((e: string) => e === file.mimetype || file.mimetype.indexOf(e) >= 0);
        console.log('allowed', allowed)
        allowed
          ? cb(null, true)
          : cb(new Error(`Invalid file type: ${file.mimetype}`));
      },
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB
        files: options.maxCount || 10
      }
    });
  }

  /**
   * Get book uploader
   * @param options Upload options
   */
  static getBookUploader(options: UploadOptions): Multer {
    const storage: StorageEngine = multer.diskStorage({
      destination: (req: Express.Request, file: Express.Multer.File, cb) => {
        // Build upload dir
        const baseDir = env.PUBLIC_ROOT;
        const uploadDir = path.join(baseDir, `book/${options.fileName}`);

        // Create upload dir
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req: Express.Request, file: Express.Multer.File, cb) => {
        const filename = isBook(file) ? 'book' : 'cover';
        const finalFilename = filename + path.extname(file.originalname);
        cb(null, finalFilename);
      }
    });

    return multer({
      storage,
      fileFilter: (req, file, cb) => {
        const allowedTypes = [...FileAllowedTypes.book, ...FileAllowedTypes.image];
        const allowed = allowedTypes.find((e: string) => e === file.mimetype || file.mimetype.indexOf(e) >= 0);
        console.log('allowed', allowed)
        allowed
          ? cb(null, true)
          : cb(new Error(`Invalid file type: ${file.mimetype}`));
      },
      limits: {
        fieldSize: 10 * 1024 * 1024,
        fileSize: 500 * 1024 * 1024, // 500MB
        files: options.maxCount || 10
      }
    });
  }

  /**
   * Single file uploader
   * @param options
   */
  static singleUploader(
    options?: {
      subDir?: string;
      fileName?: string;
      type?: string;
    }
  ): Multer {
    return this.getUploader({
      ...options,
      isArray: false
    });
  }

  /**
   * Multiple files uploader
   * @param options
   */
  static multiUploader(
    options?: {
      subDir?: string;
      fileName?: string;
      maxCount?: number;
      type?: string;
    }
  ): Multer {
    return this.getUploader({
      ...options,
      isArray: true,
      maxCount: options?.maxCount || 10
    });
  }
}
