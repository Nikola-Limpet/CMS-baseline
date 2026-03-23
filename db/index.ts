import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Cache the connection on globalThis to prevent creating new pools on every
// hot-reload in development. In production this is a no-op since modules
// are only loaded once.
const globalForDb = globalThis as unknown as {
  db: PostgresJsDatabase<typeof schema> | undefined;
};

const client = postgres(connectionString, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// @ts-ignore postgres types mismatch between pnpm hoisted versions
export const db = globalForDb.db ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
