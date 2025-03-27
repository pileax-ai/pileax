import { DataSource } from 'typeorm';

import {
  Book,
  BookAnnotation,
  Note
} from './entity'
import { appDbPath } from '../utils/path';

let AppDataSource: DataSource;

const initDb = async () => {
  const dbPath = appDbPath();

  AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [
      Book,
      BookAnnotation,
      Note
    ],
    synchronize: true, // todo: 禁用自动同步
    migrationsRun: true, // 启动时自动运行迁移
    migrations: [
      './migration/*.ts'
    ],
    logging: ['error'],
    enableWAL: true
  });

  await AppDataSource.initialize();
  console.log('initDb', dbPath);

  return AppDataSource;
}

export {
  initDb,
  AppDataSource
}
