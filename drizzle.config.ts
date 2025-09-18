// drizzle.config.ts (root)
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Force-load .env.local so drizzle-kit sees DATABASE_URL
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Add it to .env.local');
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // now defined
  },
  verbose: true,
  strict: true,
});
