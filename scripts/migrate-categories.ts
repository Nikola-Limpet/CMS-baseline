import { db } from '@/db';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Starting migration...');

    // Create competition categories table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "competition_categories" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(50) NOT NULL,
        "slug" varchar(50) NOT NULL,
        "description" text,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log('✓ Created competition_categories table');

    // Add unique constraints
    await db.execute(sql`
      ALTER TABLE "competition_categories" 
      ADD CONSTRAINT IF NOT EXISTS "competition_categories_name_unique" UNIQUE("name");
    `);

    await db.execute(sql`
      ALTER TABLE "competition_categories" 
      ADD CONSTRAINT IF NOT EXISTS "competition_categories_slug_unique" UNIQUE("slug");
    `);
    console.log('✓ Added unique constraints');

    // Add category_id column to competitions table
    await db.execute(sql`
      ALTER TABLE "competitions" 
      ADD COLUMN IF NOT EXISTS "category_id" uuid 
      REFERENCES "competition_categories"("id") ON DELETE SET NULL;
    `);
    console.log('✓ Added category_id column to competitions');

    // Insert default categories
    await db.execute(sql`
      INSERT INTO "competition_categories" ("name", "slug", "description") 
      VALUES 
        ('Mathematics', 'mathematics', 'Mathematical competitions and olympiads'),
        ('English', 'english', 'English language and literature competitions'),
        ('Science', 'science', 'General science competitions covering multiple disciplines')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log('✓ Inserted default categories');

    // Create indexes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "competitions_category_id_idx" ON "competitions" ("category_id");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "competition_categories_name_idx" ON "competition_categories" ("name");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "competition_categories_slug_idx" ON "competition_categories" ("slug");
    `);
    console.log('✓ Created indexes');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('✅ Migration successful');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export default runMigration; 