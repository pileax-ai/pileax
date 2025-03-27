import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { env } from '@/common/utils/envConfig';
import * as schema from './schema';

class DatabaseClient {
  private static instance: BetterSQLite3Database<typeof schema>;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = this.initialize();
    }
    return this.instance;
  }

  private static initialize() {
    const dbPath = env.DATABASE_URL;
    console.log('Database path: ', dbPath);
    const sqlite = new Database(dbPath, {
      // verbose: console.log, // Optional: print SQL log
    });

    const migrationsFolder = `${env.SERVER_ROOT}/src/drizzle/migrations`;
    try {
      migrate(drizzle(sqlite), {
        migrationsFolder: migrationsFolder,
        migrationsTable: 'migrations'
      })
      console.info('✅ Migrations : ', migrationsFolder)
    } catch (err) {
      console.error('Failed to migrate: ', err)
      console.error('MigrationsFolder: ', migrationsFolder)
    }

    return drizzle(sqlite, {
      schema,
      logger: process.env.NODE_ENV === 'development',
      // logger: false
    });
  }
}

export const db = DatabaseClient.getInstance();
