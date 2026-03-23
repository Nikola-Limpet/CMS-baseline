'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Calendar, 
  Target, 
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';


// Dynamic icon mapping
const iconMap = {
  Users,
  BookOpen, 
  Trophy,
  Calendar,
  Target,
  Star
};

// Color mapping for stats
const colorMap = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  amber: 'text-amber-600',
  purple: 'text-purple-600',
  teal: 'text-teal-600',
  red: 'text-red-600'
};

const bgColorMap = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  amber: 'bg-amber-50',
  purple: 'bg-purple-50',
  teal: 'bg-teal-50',
  red: 'bg-red-50'
};

interface StatItem {
  title: string;
  value: number;
  unit: string;
  change: {
    value: number;
    label: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: keyof typeof iconMap;
  color: keyof typeof colorMap;
}

interface DashboardStatsData {
  success: boolean;
  stats: StatItem[];
  metadata: {
    lastUpdated: string;
    totalUsers: number;
    totalBlogPosts: number;
    weeklyUsers: number;
    [key: string]: unknown;
  };
}

const DashboardStats = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    const fetchStats = async () => {
      try {
        setError(null);
        const response = await fetch('/api/analytics/dashboard');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }
        
        const json = await response.json();
        const data: DashboardStatsData = json.data ?? json;

        if (data.stats) {
          if (mounted) {
            setStats(data.stats);
            setLastUpdated(data.metadata.lastUpdated);
          }
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load statistics');
          
          // Fallback to static data if API fails
          setStats([
            {
              title: 'Total Users',
              value: 0,
              unit: '',
              change: { value: 0, label: 'loading...', type: 'neutral' },
              icon: 'Users',
              color: 'blue'
            },
            {
              title: 'Blog Posts',
              value: 0,
              unit: 'posts',
              change: { value: 0, label: 'loading...', type: 'neutral' },
              icon: 'BookOpen',
              color: 'green'
            },
          ]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    const loadStats = async () => {
      if (mounted) {
        await fetchStats();
      }
    };

    loadStats();
    
    // Set up auto-refresh every 5 minutes only if component is still mounted
    interval = setInterval(() => {
      if (mounted) {
        fetchStats();
      }
    }, 5 * 60 * 1000);
    
    return () => {
      mounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []); // Empty dependency array

  const refreshStats = async () => {
    setIsRefreshing(true);
    try {
      setError(null);
      const response = await fetch('/api/analytics/dashboard');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      
      const json = await response.json();
      const data: DashboardStatsData = json.data ?? json;

      if (data.stats) {
        setStats(data.stats);
        setLastUpdated(data.metadata.lastUpdated);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard Statistics</h2>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refreshStats}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Failed to load statistics</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={refreshStats}
            className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = iconMap[stat.icon] || Users;
          const textColor = colorMap[stat.color] || colorMap.blue;
          const bgColor = bgColorMap[stat.color] || bgColorMap.blue;

          return (
            <div
              key={`${stat.title}-${index}`}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  
                  <div className="flex items-baseline space-x-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </p>
                    {stat.unit && (
                      <p className="text-sm text-gray-500">{stat.unit}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(stat.change.type)}
                    <p className={`text-sm font-medium ${getChangeColor(stat.change.type)}`}>
                      {stat.change.type !== 'neutral' && (
                        <span>
                          {stat.change.type === 'increase' ? '+' : '-'}
                          {Math.abs(stat.change.value)}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {stat.change.label}
                    </p>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStats;