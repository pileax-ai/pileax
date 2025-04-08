import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { env } from '@/common/utils/envConfig';
import * as schema from './schema';
import { user } from './schema';
import { DEFAULT_USER_ID } from '@/common/constants';

class DatabaseClient {
  private static instance: BetterSQLite3Database<typeof schema>;

  private constructor() {}

  static getInstance() {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = DatabaseClient.initialize();
    }
    return DatabaseClient.instance;
  }

  private static initialize() {
    const dbPath = env.DATABASE_URL;
    console.log('Database path: ', dbPath);
    const sqlite = new Database(dbPath, {
      // verbose: console.log, // Optional: print SQL log
    });

    // migration
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

    // instance
    const instance = drizzle(sqlite, {
      schema,
      logger: process.env.NODE_ENV === 'development',
      // logger: false
    });

    // default user
    instance.select().from(user).limit(1).then(async (res) => {
      if (res.length === 0) {
        await instance.insert(user).values({
          id: DEFAULT_USER_ID,
          name: 'Default',
          remarks: 'Default user',
          status: 1
        });
        console.log("✅ Default user inserted.");
      }
    })

    return instance;
  }
}

export const db = DatabaseClient.getInstance();
