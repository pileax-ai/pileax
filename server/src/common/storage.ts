import multer, { FileFilterCallback, Multer, StorageEngine } from 'multer'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from '@/common/utils/envConfig';
import { randomUUID } from 'node:crypto';
import { MiscUtil } from '@/common/utils/miscUtil'

export interface UploadOptions {
  subDir?: string
  fileName?: string
  type?: string
}

const FileAllowedTypes: Indexable = {
  file: [
    'image',
    'application/pdf',
    'text/plain'
  ],
  book: [
    'ebook',
    'azw3',
    'epub',
    'mobi',
    'pdf',
  ]
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

        // 确保目录存在
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
      limits: { fileSize: 10 * 1024 * 1024 } // 10MB
    });
  }
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = env.PUBLIC_ROOT;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export {
  upload
}
