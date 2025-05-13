import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './src/drizzle/release/migrations',
  schema: './src/drizzle/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './src/drizzle/release/database/metadata.db',
  },
});
