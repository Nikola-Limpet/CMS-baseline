import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user, competitionRegistrations, competitions, blogPosts } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET(_request: NextRequest) {
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

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    const thirtyDaysAgoString = thirtyDaysAgo.toISOString();
    const sixMonthsAgoString = sixMonthsAgo.toISOString();

    // Get monthly registration data for the last 6 months
    const monthlyRegistrations = await db.execute(sql`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as registrations
      FROM ${competitionRegistrations}
      WHERE created_at >= ${sixMonthsAgoString}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `);

    // Get daily user registrations for the last 30 days
    const dailyUserRegistrations = await db.execute(sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as users
      FROM ${user}
      WHERE created_at >= ${thirtyDaysAgoString}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Get competition performance data
    const competitionPerformance = await db.execute(sql`
      SELECT 
        c.title,
        c.id,
        COUNT(cr.id) as participants,
        c.max_participants,
        c.status,
        c.start_date
      FROM ${competitions} c
      LEFT JOIN ${competitionRegistrations} cr ON c.id = cr.competition_id
      WHERE c.created_at >= ${sixMonthsAgoString}
      GROUP BY c.id, c.title, c.max_participants, c.status, c.start_date
      ORDER BY c.start_date DESC
      LIMIT 10
    `);

    // Get monthly user growth
    const monthlyUserGrowth = await db.execute(sql`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_users
      FROM ${user}
      WHERE created_at >= ${sixMonthsAgoString}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `);



    // Get blog post data (simplified since view_count column doesn't exist)
    const blogEngagement = await db.execute(sql`
      SELECT 
        bp.title,
        bp.id,
        bp.created_at,
        bp.published
      FROM ${blogPosts} bp
      WHERE bp.published = true 
        AND bp.created_at >= ${thirtyDaysAgoString}
      ORDER BY bp.created_at DESC
      LIMIT 6
    `);

    // Generate all 6 month buckets for consistent chart labels
    const allMonths: Date[] = [];
    for (let i = 5; i >= 0; i--) {
      allMonths.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
    }

    // Map registration query results by year-month key
    const registrationMap = new Map<string, number>();
    for (const row of monthlyRegistrations) {
      const d = new Date(row.month as string);
      registrationMap.set(`${d.getFullYear()}-${d.getMonth()}`, Number(row.registrations));
    }

    // Map user growth query results by year-month key
    const userGrowthMap = new Map<string, number>();
    for (const row of monthlyUserGrowth) {
      const d = new Date(row.month as string);
      userGrowthMap.set(`${d.getFullYear()}-${d.getMonth()}`, Number(row.new_users));
    }

    // Build filled label/data arrays (0 for months with no data)
    const filledLabels = allMonths.map(m =>
      m.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    );
    const filledRegistrations = allMonths.map(m =>
      registrationMap.get(`${m.getFullYear()}-${m.getMonth()}`) ?? 0
    );
    const filledUserGrowth = allMonths.map(m =>
      userGrowthMap.get(`${m.getFullYear()}-${m.getMonth()}`) ?? 0
    );

    // Format registration trends data
    const registrationTrends = {
      labels: filledLabels,
      datasets: [
        {
          label: 'Competition Registrations',
          data: filledRegistrations,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3
        }
      ]
    };

    // Format user growth data
    const userGrowthData = {
      labels: filledLabels,
      datasets: [
        {
          label: 'New Users',
          data: filledUserGrowth,
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2
        }
      ]
    };

    // Format competition performance data
    const competitionData = {
      labels: competitionPerformance.map(row =>
        (row.title as string).length > 15
          ? (row.title as string).substring(0, 15) + '...'
          : row.title as string
      ),
      datasets: [
        {
          label: 'Participants',
          data: competitionPerformance.map(row => Number(row.participants)),
          backgroundColor: 'rgba(249, 115, 22, 0.6)',
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 2
        },
        {
          label: 'Capacity',
          data: competitionPerformance.map(row => Number(row.max_participants || 0)),
          backgroundColor: 'rgba(156, 163, 175, 0.4)',
          borderColor: 'rgb(156, 163, 175)',
          borderWidth: 2
        }
      ]
    };

    // Format daily activity data
    const dailyActivity = {
      labels: dailyUserRegistrations.map(row => {
        const date = new Date(row.date as string);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Daily Signups',
          data: dailyUserRegistrations.map(row => Number(row.users)),
          fill: true,
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4
        }
      ]
    };



    // Performance metrics (derived from data)
    const performanceMetrics = {
      averageRegistrationsPerCompetition: competitionPerformance.length > 0
        ? Math.round(
          competitionPerformance.reduce((sum, comp) => sum + Number(comp.participants), 0) /
          competitionPerformance.length
        )
        : 0,
      totalActiveUsers: dailyUserRegistrations.reduce((sum, day) => sum + Number(day.users), 0),
      totalCompetitionsThisMonth: competitionPerformance.filter(comp => {
        const startDate = new Date(comp.start_date as string);
        const thisMonth = new Date();
        return startDate.getMonth() === thisMonth.getMonth() &&
          startDate.getFullYear() === thisMonth.getFullYear();
      }).length
    };

    return NextResponse.json({
      success: true,
      charts: {
        registrationTrends,
        userGrowth: userGrowthData,
        competitionPerformance: competitionData,
        dailyActivity
      },
      metrics: performanceMetrics,
      rawData: {
        competitionPerformance: competitionPerformance.slice(0, 5), // Limited for dashboard display
        blogEngagement: blogEngagement.slice(0, 5)
      },
      lastUpdated: now.toISOString()
    });

  } catch (error) {
    console.error('Charts analytics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch charts data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 