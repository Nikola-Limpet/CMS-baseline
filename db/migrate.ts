import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set for migration');
}

// Specify migrationFolder relative to the project root
const migrationFolder = './drizzle';

async function runMigrations() {
  const sql = postgres(connectionString!, { ssl: 'require', max: 1 });
  const db = drizzle(sql as any);

  try {
    await migrate(db, { migrationsFolder: migrationFolder });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

runMigrations().catch((err) => {
  console.error('Migration script failed:', err);
  process.exit(1);
});