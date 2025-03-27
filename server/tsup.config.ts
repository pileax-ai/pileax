import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    "src",
    "!src/**/__tests__/**",
    "!src/**/*.test.*",
    '!src/drizzle/**',
    '!src/storage/**',
  ],
  outDir: 'dist',
  "splitting": false,
  "sourcemap": true,
  "clean": true
});
