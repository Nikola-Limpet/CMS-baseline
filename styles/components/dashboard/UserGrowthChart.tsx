'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

interface ChartData {
  month: string;
  users: number;
}

export function UserGrowthChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics/charts');
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        const result = await response.json();

        // Transform API data to Recharts format
        const chartData = result.charts.userGrowth.labels.map(
          (label: string, index: number) => ({
            month: label,
            users: result.charts.userGrowth.datasets[0].data[index] || 0,
          })
        );

        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate total and growth
  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
  const lastMonth = data[data.length - 1]?.users || 0;
  const previousMonth = data[data.length - 2]?.users || 0;
  const growthPercent =
    previousMonth > 0
      ? Math.round(((lastMonth - previousMonth) / previousMonth) * 100)
      : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-48 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
        </div>
        <div className="h-48 flex items-center justify-center text-gray-500">
          {error || 'No data available yet'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last 6 months</p>
            <p className="text-lg font-bold text-gray-900">{totalUsers} users</p>
          </div>
          {growthPercent !== 0 && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                growthPercent > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${growthPercent < 0 ? 'rotate-180' : ''}`}
              />
              {Math.abs(growthPercent)}%
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ fontWeight: 600, color: '#1e293b' }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#userGradient)"
              name="New Users"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
