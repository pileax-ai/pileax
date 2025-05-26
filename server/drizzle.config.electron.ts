import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/drizzle/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: '/Users/micle/Library/Application Support/Electron/storage/metadata.db',
  },
});
