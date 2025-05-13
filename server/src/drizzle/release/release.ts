import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { env } from '@/common/utils/envConfig';

const releaseRoot = `${env.SERVER_ROOT}/src/drizzle/release`;

// db
const dbPath = `${releaseRoot}/database/metadata.db`;
const sqlite = new Database(dbPath);

// migration
const migrationsFolder = `${releaseRoot}/migrations`;
try {
  migrate(drizzle(sqlite), {
    migrationsFolder: migrationsFolder,
    migrationsTable: 'migrations'
  });
  console.info('✅ Migrations : ', migrationsFolder)
} catch (err) {
  console.error('Failed to migrate: ', err)
  console.error('MigrationsFolder: ', migrationsFolder)
}
