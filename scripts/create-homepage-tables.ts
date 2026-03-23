import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

async function createHomepageTables() {
  const sql = postgres(connectionString!, { ssl: 'require', max: 1 });
  
  try {
    console.log('Creating enums and tables for homepage components...');
    
    // Create enums with conflict handling
    await sql`
      DO $$ BEGIN
          CREATE TYPE achievement_type AS ENUM('competition', 'course_completion', 'improvement', 'recognition', 'scholarship');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
          CREATE TYPE announcement_type AS ENUM('news', 'deadline', 'event', 'registration', 'update', 'maintenance');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
          CREATE TYPE medal_type AS ENUM('gold', 'silver', 'bronze', 'participation', 'honorable_mention');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
          CREATE TYPE priority AS ENUM('high', 'medium', 'low');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
          CREATE TYPE social_platform AS ENUM('instagram', 'facebook', 'youtube', 'twitter', 'tiktok');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
          CREATE TYPE target_audience AS ENUM('all', 'students', 'parents', 'teachers', 'admins');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    
    console.log('✓ Created enums');
    
    // Create student_achievements table
    await sql`
      CREATE TABLE IF NOT EXISTS student_achievements (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        student_name varchar(255) NOT NULL,
        student_image varchar(500),
        achievement_type achievement_type NOT NULL,
        title varchar(255) NOT NULL,
        description text NOT NULL,
        before_score integer,
        after_score integer,
        competition_name varchar(255),
        medal_type medal_type,
        achievement_date timestamp NOT NULL,
        featured boolean DEFAULT false NOT NULL,
        display_order integer DEFAULT 0 NOT NULL,
        created_by varchar(255) NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `;
    
    // Create program_features table
    await sql`
      CREATE TABLE IF NOT EXISTS program_features (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        feature_name varchar(255) NOT NULL,
        description text,
        category varchar(100) NOT NULL,
        display_order integer DEFAULT 0 NOT NULL,
        is_active boolean DEFAULT true NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `;
    
    // Create course_program_features table
    await sql`
      CREATE TABLE IF NOT EXISTS course_program_features (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id uuid NOT NULL,
        feature_id uuid NOT NULL,
        included boolean DEFAULT true NOT NULL,
        feature_value text,
        notes text,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `;
    
    // Create announcements table
    await sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title varchar(255) NOT NULL,
        content text NOT NULL,
        short_description varchar(500),
        announcement_type announcement_type NOT NULL,
        priority priority DEFAULT 'medium' NOT NULL,
        start_date timestamp NOT NULL,
        end_date timestamp,
        target_audience target_audience DEFAULT 'all' NOT NULL,
        action_url varchar(500),
        action_text varchar(100),
        image_url varchar(500),
        background_color varchar(7) DEFAULT '#3b82f6',
        text_color varchar(7) DEFAULT '#ffffff',
        dismissible boolean DEFAULT true NOT NULL,
        active boolean DEFAULT true NOT NULL,
        display_order integer DEFAULT 0 NOT NULL,
        created_by varchar(255) NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `;
    
    // Create social_media_posts table
    await sql`
      CREATE TABLE IF NOT EXISTS social_media_posts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        platform social_platform NOT NULL,
        post_id varchar(255) NOT NULL,
        content text NOT NULL,
        short_content varchar(280),
        image_url varchar(500),
        video_url varchar(500),
        post_url varchar(500) NOT NULL,
        engagement_count integer DEFAULT 0 NOT NULL,
        view_count integer DEFAULT 0,
        post_date timestamp NOT NULL,
        featured boolean DEFAULT false NOT NULL,
        active boolean DEFAULT true NOT NULL,
        display_order integer DEFAULT 0 NOT NULL,
        hashtags json,
        mentions json,
        last_sync_at timestamp DEFAULT now() NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `;
    
    console.log('✓ Created tables');
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS student_achievements_featured_idx ON student_achievements (featured);`;
    await sql`CREATE INDEX IF NOT EXISTS student_achievements_type_idx ON student_achievements (achievement_type);`;
    await sql`CREATE INDEX IF NOT EXISTS student_achievements_date_idx ON student_achievements (achievement_date);`;
    await sql`CREATE INDEX IF NOT EXISTS student_achievements_display_order_idx ON student_achievements (display_order);`;
    
    await sql`CREATE INDEX IF NOT EXISTS program_features_category_idx ON program_features (category);`;
    await sql`CREATE INDEX IF NOT EXISTS program_features_display_order_idx ON program_features (display_order);`;
    await sql`CREATE INDEX IF NOT EXISTS program_features_active_idx ON program_features (is_active);`;
    
    await sql`CREATE INDEX IF NOT EXISTS course_program_features_course_idx ON course_program_features (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS course_program_features_feature_idx ON course_program_features (feature_id);`;
    await sql`CREATE INDEX IF NOT EXISTS course_program_features_unique_idx ON course_program_features (course_id, feature_id);`;
    
    await sql`CREATE INDEX IF NOT EXISTS announcements_active_idx ON announcements (active);`;
    await sql`CREATE INDEX IF NOT EXISTS announcements_priority_idx ON announcements (priority);`;
    await sql`CREATE INDEX IF NOT EXISTS announcements_type_idx ON announcements (announcement_type);`;
    await sql`CREATE INDEX IF NOT EXISTS announcements_date_range_idx ON announcements (start_date, end_date);`;
    await sql`CREATE INDEX IF NOT EXISTS announcements_audience_idx ON announcements (target_audience);`;
    await sql`CREATE INDEX IF NOT EXISTS announcements_display_order_idx ON announcements (display_order);`;
    
    await sql`CREATE INDEX IF NOT EXISTS social_media_posts_platform_idx ON social_media_posts (platform);`;
    await sql`CREATE INDEX IF NOT EXISTS social_media_posts_featured_idx ON social_media_posts (featured);`;
    await sql`CREATE INDEX IF NOT EXISTS social_media_posts_active_idx ON social_media_posts (active);`;
    await sql`CREATE INDEX IF NOT EXISTS social_media_posts_date_idx ON social_media_posts (post_date);`;
    await sql`CREATE INDEX IF NOT EXISTS social_media_posts_display_order_idx ON social_media_posts (display_order);`;
    await sql`CREATE INDEX IF NOT EXISTS social_media_posts_unique_idx ON social_media_posts (platform, post_id);`;
    
    console.log('✓ Created indexes');
    
    // Create foreign key constraints (check if users table exists first)
    try {
      await sql`ALTER TABLE student_achievements ADD CONSTRAINT IF NOT EXISTS student_achievements_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE cascade;`;
      await sql`ALTER TABLE announcements ADD CONSTRAINT IF NOT EXISTS announcements_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE cascade;`;
      await sql`ALTER TABLE course_program_features ADD CONSTRAINT IF NOT EXISTS course_program_features_course_id_courses_id_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE cascade;`;
      await sql`ALTER TABLE course_program_features ADD CONSTRAINT IF NOT EXISTS course_program_features_feature_id_program_features_id_fk FOREIGN KEY (feature_id) REFERENCES program_features(id) ON DELETE cascade;`;
      console.log('✓ Created foreign key constraints');
    } catch (error) {
      console.log('⚠ Some foreign key constraints may already exist or reference tables may not exist:', (error as Error).message);
    }
    
    console.log('✅ Homepage tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating homepage tables:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

createHomepageTables().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});