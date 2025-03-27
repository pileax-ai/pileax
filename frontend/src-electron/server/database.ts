import { execSync } from 'child_process';
import log from 'electron-log';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { appDbPath } from '../utils/path';

const currentDir = fileURLToPath(new URL('.', import.meta.url));

export function initializeDatabase() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const dbPath = appDbPath();
    let serverPath: string;

    if (isProduction) {
      serverPath = path.join(process.resourcesPath, 'server');
    } else {
      serverPath = path.join(currentDir, '../../../server');
    }

    // Init when server starts
    const prismaEntry = path.join(serverPath, 'node_modules/.bin/prisma');
    log.info('🔄 Initializing database: ', prismaEntry, serverPath, dbPath);
    execSync(`${prismaEntry} migrate deploy`, {
      env: {
        ...process.env,
        DATABASE_URL: `file:${dbPath}`
      },
      cwd: serverPath,
      stdio: 'inherit'
    });

    log.info('✅ Database initialized');
    return true;
  } catch (error) {
    log.error('❌ Database initialization failed:', error);
    return false;
  }
}
