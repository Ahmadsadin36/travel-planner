// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// One pool for the whole app
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // reads from .env.local via Next.js
});

// Export a singleton DB client to use in routes/actions
export const db = drizzle(pool);
