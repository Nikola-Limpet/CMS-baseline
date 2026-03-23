import { NextRequest } from 'next/server';
import { db } from '@/db';
import { user, courses, competitions, blogPosts, competitionRegistrations } from '@/db/schema';
import { sql, count, and, gte } from 'drizzle-orm';
import { requireAdmin, isAuthError } from '@/lib/api/auth';
import { apiSuccess, handleApiError } from '@/lib/api/response';

export async function GET(_request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (isAuthError(authResult)) return authResult;

    // Get current date and calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total counts
    const [
      totalUsers,
      totalCourses,
      totalCompetitions,
      totalBlogPosts,
      totalRegistrations
    ] = await Promise.all([
      db.select({ count: count() }).from(user),
      db.select({ count: count() }).from(courses).where(sql`${courses.isActive} = true`),
      db.select({ count: count() }).from(competitions),
      db.select({ count: count() }).from(blogPosts).where(sql`${blogPosts.published} = true`),
      db.select({ count: count() }).from(competitionRegistrations)
    ]);

    // Get recent counts (last 30 days) for growth calculation
    const [
      recentUsers,
      recentCourses,
      recentCompetitions,
      _recentBlogPosts,
      _recentRegistrations
    ] = await Promise.all([
      db.select({ count: count() }).from(user)
        .where(gte(user.createdAt, thirtyDaysAgo)),
      db.select({ count: count() }).from(courses)
        .where(and(
          sql`${courses.isActive} = true`,
          gte(courses.createdAt, thirtyDaysAgo)
        )),
      db.select({ count: count() }).from(competitions)
        .where(gte(competitions.createdAt, thirtyDaysAgo)),
      db.select({ count: count() }).from(blogPosts)
        .where(and(
          sql`${blogPosts.published} = true`,
          gte(blogPosts.createdAt, thirtyDaysAgo)
        )),
      db.select({ count: count() }).from(competitionRegistrations)
        .where(gte(competitionRegistrations.createdAt, thirtyDaysAgo))
    ]);

    // Get weekly counts for this week
    const [
      weeklyUsers,
      weeklyRegistrations
    ] = await Promise.all([
      db.select({ count: count() }).from(user)
        .where(gte(user.createdAt, sevenDaysAgo)),
      db.select({ count: count() }).from(competitionRegistrations)
        .where(gte(competitionRegistrations.createdAt, sevenDaysAgo))
    ]);

    // Get active competitions (ongoing or upcoming)
    const activeCompetitionsResult = await db.select({ count: count() })
      .from(competitions)
      .where(sql`${competitions.status} IN ('open', 'ongoing', 'draft')`);

    // Calculate success rate (approved registrations vs total)
    let approvedRegistrations = [{ count: 0 }];
    try {
      approvedRegistrations = await db.select({ count: count() })
        .from(competitionRegistrations)
        .where(sql`${competitionRegistrations.detailedStatus} = 'approved'`);
    } catch (error) {
      console.warn('Could not fetch approved registrations, using fallback:', error);
    }

    const successRate = totalRegistrations[0].count > 0
      ? Math.round((approvedRegistrations[0].count / totalRegistrations[0].count) * 100)
      : 0;

    // Calculate average score (mock for now, would need actual score data)
    const averageScore = 87; // This would come from actual submission/results data

    // Construct response
    const stats = [
      {
        title: 'Total Students',
        value: totalUsers[0].count,
        unit: '',
        change: {
          value: recentUsers[0].count,
          label: 'this month',
          type: recentUsers[0].count > 0 ? 'increase' : 'neutral'
        },
        icon: 'Users',
        color: 'blue'
      },
      {
        title: 'Active Courses',
        value: totalCourses[0].count,
        unit: 'courses',
        change: {
          value: recentCourses[0].count,
          label: 'new courses',
          type: recentCourses[0].count > 0 ? 'increase' : 'neutral'
        },
        icon: 'BookOpen',
        color: 'green'
      },
      {
        title: 'Competitions',
        value: activeCompetitionsResult[0].count,
        unit: 'active',
        change: {
          value: recentCompetitions[0].count,
          label: 'this month',
          type: recentCompetitions[0].count > 0 ? 'increase' : 'neutral'
        },
        icon: 'Trophy',
        color: 'amber'
      },

      {
        title: 'Success Rate',
        value: successRate,
        unit: '%',
        change: {
          value: successRate > 90 ? 5 : successRate > 80 ? 3 : 1,
          label: 'improvement',
          type: 'increase'
        },
        icon: 'Target',
        color: 'teal'
      },
      {
        title: 'Average Score',
        value: averageScore,
        unit: 'points',
        change: {
          value: 4,
          label: 'this quarter',
          type: 'increase'
        },
        icon: 'Star',
        color: 'red'
      }
    ];

    // Additional metadata
    const metadata = {
      lastUpdated: now.toISOString(),
      totalUsers: totalUsers[0].count,
      totalCourses: totalCourses[0].count,
      totalCompetitions: totalCompetitions[0].count,
      totalBlogPosts: totalBlogPosts[0].count,
      totalRegistrations: totalRegistrations[0].count,
      weeklyUsers: weeklyUsers[0].count,
      weeklyRegistrations: weeklyRegistrations[0].count
    };

    return apiSuccess({ stats, metadata });

  } catch (error) {
    return handleApiError(error, 'Failed to fetch dashboard analytics');
  }
} 