// This script connects to your database and runs the migration script
// to set up the necessary tables and admin user

import { db } from '../db/index.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupAdmin() {
  try {
    console.log('Reading migration SQL file...');
    const sqlPath = path.join(__dirname, '..', 'db', 'migrations', 'init-schema.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    
    console.log('Executing migration...');
    // Execute the SQL directly using the db connection
    await db.execute(sql);
    
    console.log('✅ Database migration completed successfully');
    console.log('✅ Admin user and permissions have been set up');
    console.log('You can now access the admin dashboard');
    
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
