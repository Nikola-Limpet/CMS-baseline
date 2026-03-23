import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { and, lte, eq, isNotNull, gt } from 'drizzle-orm';

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, or external service)
// It will publish all scheduled posts that are due
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    
    // Find all posts that are scheduled to be published and are due
    const scheduledPosts = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, false),
          isNotNull(blogPosts.scheduledPublishAt),
          lte(blogPosts.scheduledPublishAt, now)
        )
      );

    console.log(`Found ${scheduledPosts.length} posts to publish`);

    // Publish each post
    const publishedPostIds = [];
    for (const post of scheduledPosts) {
      try {
        await db
          .update(blogPosts)
          .set({
            published: true,
            publishedAt: now,
            scheduledPublishAt: null, // Clear the scheduled date
            updatedAt: now,
          })
          .where(eq(blogPosts.id, post.id));
        
        publishedPostIds.push(post.id);
        console.log(`Published post: ${post.title} (${post.id})`);
      } catch (error) {
        console.error(`Failed to publish post ${post.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      publishedCount: publishedPostIds.length,
      publishedPostIds,
      message: `Successfully published ${publishedPostIds.length} scheduled posts`,
    });
  } catch (error) {
    console.error('Error publishing scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to publish scheduled posts' },
      { status: 500 }
    );
  }
}

// GET endpoint to check scheduled posts (useful for debugging)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    
    // Get posts that are scheduled
    const [duePosts, futurePosts] = await Promise.all([
      // Posts that should be published now
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          scheduledPublishAt: blogPosts.scheduledPublishAt,
        })
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.published, false),
            isNotNull(blogPosts.scheduledPublishAt),
            lte(blogPosts.scheduledPublishAt, now)
          )
        ),
      // Posts scheduled for the future
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          scheduledPublishAt: blogPosts.scheduledPublishAt,
        })
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.published, false),
            isNotNull(blogPosts.scheduledPublishAt),
            gt(blogPosts.scheduledPublishAt, now)
          )
        )
        .orderBy(blogPosts.scheduledPublishAt)
        .limit(10),
    ]);

    return NextResponse.json({
      currentTime: now.toISOString(),
      duePostsCount: duePosts.length,
      duePosts,
      upcomingPostsCount: futurePosts.length,
      upcomingPosts: futurePosts,
    });
  } catch (error) {
    console.error('Error checking scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to check scheduled posts' },
      { status: 500 }
    );
  }
}