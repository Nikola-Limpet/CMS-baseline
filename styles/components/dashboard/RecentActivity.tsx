'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  FileText, 
  Calendar, 
  BookOpen, 
  UserPlus,
  RefreshCcw,
  AlertCircle,
  Clock
} from 'lucide-react';

// Dynamic icon mapping
const iconMap = {
  Users,
  Trophy,
  FileText,
  Calendar,
  BookOpen,
  UserPlus
};

// Color mapping for activities
const colorMap = {
  blue: 'text-blue-600 bg-blue-50',
  amber: 'text-amber-600 bg-amber-50',
  green: 'text-green-600 bg-green-50',
  purple: 'text-purple-600 bg-purple-50',
  teal: 'text-teal-600 bg-teal-50',
  red: 'text-red-600 bg-red-50'
};

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  user: {
    name: string;
    email: string;
  };
  timestamp: string;
  icon: keyof typeof iconMap;
  color: keyof typeof colorMap;
  metadata?: Record<string, any>;
}

interface ActivityStats {
  totalActivities: number;
  userRegistrations: number;
  competitionRegistrations: number;
  blogPosts: number;
  eventsCreated: number;
  coursesUpdated: number;
  mostActiveDay: {
    date: string;
    count: number;
  };
  averageActivitiesPerDay: number;
}

interface ActivitiesResponse {
  success: boolean;
  activities: Activity[];
  stats: ActivityStats;
  pagination: {
    limit: number;
    days: number;
    totalActivities: number;
    returned: number;
  };
  lastUpdated: string;
}

interface RecentActivityProps {
  limit?: number;
  className?: string;
}

const RecentActivity = ({ limit = 10, className = '' }: RecentActivityProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchActivities = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/analytics/activities?limit=${limit}&days=7`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }
      
      const data: ActivitiesResponse = await response.json();
      
      if (data.success && data.activities) {
        setActivities(data.activities);
        setStats(data.stats);
        setLastUpdated(data.lastUpdated);
      } else {
        throw new Error('Invalid activities data format received');
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recent activities');
      
      // Fallback to empty data
      setActivities([]);
      setStats({
        totalActivities: 0,
        userRegistrations: 0,
        competitionRegistrations: 0,
        blogPosts: 0,
        eventsCreated: 0,
        coursesUpdated: 0,
        mostActiveDay: { date: '', count: 0 },
        averageActivitiesPerDay: 0
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshActivities = async () => {
    setIsRefreshing(true);
    await fetchActivities();
  };

  useEffect(() => {
    fetchActivities();
    
    // Set up auto-refresh every 2 minutes
    const interval = setInterval(fetchActivities, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [limit]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Updated {formatTimeAgo(lastUpdated)}
              </span>
            )}
            <button
              onClick={refreshActivities}
              disabled={isRefreshing}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              title="Refresh activities"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 mb-4">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">Failed to load activities</p>
              <p className="text-red-600 text-xs">{error}</p>
            </div>
            <button
              onClick={refreshActivities}
              className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Activity stats */}
        {stats && stats.totalActivities > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{stats.totalActivities}</p>
              <p className="text-xs text-gray-600">Total Activities</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{stats.userRegistrations}</p>
              <p className="text-xs text-gray-600">New Users</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{stats.averageActivitiesPerDay}</p>
              <p className="text-xs text-gray-600">Daily Avg</p>
            </div>
          </div>
        )}

        {/* Activities list */}
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const IconComponent = iconMap[activity.icon] || UserPlus;
              const colorClasses = colorMap[activity.color] || colorMap.blue;

              return (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${colorClasses} flex-shrink-0`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {activity.description}
                    </p>
                    {activity.user.name && (
                      <p className="text-xs text-gray-500 mt-1">
                        by {activity.user.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent activities</p>
              <p className="text-xs text-gray-400">Activity will appear here as users interact with the platform</p>
            </div>
          )}
        </div>

        {/* View all link */}
        {activities.length > 0 && stats && stats.totalActivities > activities.length && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all {stats.totalActivities} activities →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;