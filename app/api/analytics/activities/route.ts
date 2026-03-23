import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import {
  user,
  competitionRegistrations,
  competitions,
  blogPosts,
  courses
} from '@/db/schema';
import { sql, desc, and, eq } from 'drizzle-orm';

interface Activity {
  id: string;
  type: 'user_registration' | 'competition_registration' | 'blog_post' | 'course_updated';
  title: string;
  description: string;
  user: {
    name: string;
    email: string;
  };
  timestamp: Date;
  icon: string;
  color: string;
  metadata?: Record<string, any>;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin using database role (consistent with other endpoints)
    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const days = parseInt(searchParams.get('days') || '7');

    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const daysAgoString = daysAgo.toISOString();

    // Get recent user registrations
    const recentUsers = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      type: sql`'user_registration'`.as('type')
    })
      .from(user)
      .where(sql`${user.createdAt} >= ${daysAgoString}`)
      .orderBy(desc(user.createdAt))
      .limit(Math.min(limit, 20));

    // Get recent competition registrations
    const recentCompetitionRegistrations = await db.execute(sql`
      SELECT
        cr.id,
        cr.created_at,
        cr.status,
        u.name as user_name,
        u.email,
        c.title as competition_title,
        c.id as competition_id,
        'competition_registration' as type
      FROM ${competitionRegistrations} cr
      LEFT JOIN ${user} u ON cr.user_id = u.id
      JOIN ${competitions} c ON cr.competition_id = c.id
      WHERE cr.created_at >= ${daysAgoString}
      ORDER BY cr.created_at DESC
      LIMIT ${Math.min(limit, 20)}
    `);

    // Get recent blog posts
    const recentPosts = await db.select()
      .from(blogPosts)
      .where(sql`${blogPosts.createdAt} >= ${daysAgoString}`)
      .orderBy(desc(blogPosts.createdAt))
      .limit(5);



    // Get recent course updates (if any)
    const recentCourses = await db.select({
      id: courses.id,
      title: courses.title,
      ageGroup: courses.ageGroup,
      createdAt: courses.createdAt,
      isActive: courses.isActive,
      type: sql`'course_updated'`.as('type')
    })
      .from(courses)
      .where(and(
        sql`${courses.createdAt} >= ${daysAgoString}`,
        sql`${courses.isActive} = true`
      ))
      .orderBy(desc(courses.createdAt))
      .limit(Math.min(limit, 10));

    // Format activities with consistent structure
    const activities: Activity[] = [];

    // Add user registrations
    recentUsers.forEach(u => {
      activities.push({
        id: `user-${u.id}`,
        type: 'user_registration',
        title: 'New User Registration',
        description: `${u.name || 'User'} joined the platform`,
        user: {
          name: u.name || 'User',
          email: u.email
        },
        timestamp: u.createdAt,
        icon: 'UserPlus',
        color: 'blue',
        metadata: {
          userId: u.id
        }
      });
    });

    // Add competition registrations
    recentCompetitionRegistrations.forEach((reg: any) => {
      activities.push({
        id: `comp-reg-${reg.id}`,
        type: 'competition_registration',
        title: 'Competition Registration',
        description: `${reg.user_name || 'Participant'} registered for ${reg.competition_title}`,
        user: {
          name: reg.user_name || 'Participant',
          email: reg.email || 'No email'
        },
        timestamp: new Date(reg.created_at),
        icon: 'Trophy',
        color: 'amber',
        metadata: {
          competitionId: reg.competition_id,
          competitionTitle: reg.competition_title,
          status: reg.status
        }
      });
    });

    // Add blog posts
    for (const post of recentPosts) {
      activities.push({
        id: `blog-${post.id}`,
        type: 'blog_post',
        title: 'New Blog Post',
        description: `"${post.title}" was published`,
        user: {
          name: 'Blog Team',
          email: 'blog@smartedu.com'
        },
        timestamp: post.createdAt,
        icon: 'FileText',
        color: 'green',
        metadata: {
          postId: post.id,
          userId: post.userId
        }
      });
    }



    // Add course updates
    recentCourses.forEach(course => {
      activities.push({
        id: `course-${course.id}`,
        type: 'course_updated',
        title: 'Course Updated',
        description: `"${course.title}" for ${course.ageGroup}`,
        user: {
          name: 'Admin',
          email: ''
        },
        timestamp: course.createdAt,
        icon: 'BookOpen',
        color: 'teal',
        metadata: {
          courseId: course.id,
          ageGroup: course.ageGroup,
          isActive: course.isActive
        }
      });
    });

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply final limit
    const limitedActivities = activities.slice(0, limit);

    // Calculate activity statistics
    const stats = {
      totalActivities: activities.length,
      userRegistrations: activities.filter(a => a.type === 'user_registration').length,
      competitionRegistrations: activities.filter(a => a.type === 'competition_registration').length,
      blogPosts: activities.filter(a => a.type === 'blog_post').length,
      coursesUpdated: activities.filter(a => a.type === 'course_updated').length,
      mostActiveDay: getMostActiveDay(activities),
      averageActivitiesPerDay: Math.round(activities.length / days)
    };

    return NextResponse.json({
      success: true,
      activities: limitedActivities,
      stats,
      pagination: {
        limit,
        days,
        totalActivities: activities.length,
        returned: limitedActivities.length
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Activities analytics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch activities data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to find the most active day
function getMostActiveDay(activities: Activity[]): string {
  if (activities.length === 0) return 'Monday';

  const dayCounts: Record<string, number> = {};
  activities.forEach(activity => {
    const day = activity.timestamp.toLocaleDateString('en-US', { weekday: 'long' });
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  let maxDay = 'Monday';
  let maxCount = 0;

  for (const [day, count] of Object.entries(dayCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxDay = day;
    }
  }

  return maxDay;
}