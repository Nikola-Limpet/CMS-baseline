'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'pie';
  height?: number;
}

// Transform data for Recharts format
const transformData = (data: ChartDataPoint[]) => {
  return data.map((item, index) => ({
    ...item,
    name: item.label,
    color: item.color || `hsl(${index * 137.5 % 360}, 70%, 50%)`,
  }));
};

// Chart config for theming
const createChartConfig = (data: ChartDataPoint[]) => {
  const config: any = {};
  data.forEach((item, index) => {
    config[item.label] = {
      label: item.label,
      color: item.color || `hsl(${index * 137.5 % 360}, 70%, 50%)`,
    };
  });
  return config;
};

function SimpleBarChart({ data }: { data: ChartDataPoint[] }) {
  const chartData = transformData(data);
  const config = createChartConfig(data);

  return (
    <ChartContainer config={config}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={4}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function SimpleLineChart({ data }: { data: ChartDataPoint[] }) {
  const chartData = transformData(data);
  const config = createChartConfig(data);

  return (
    <ChartContainer config={config}>
      <LineChart data={chartData}>
        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

function SimplePieChart({ data }: { data: ChartDataPoint[] }) {
  const chartData = transformData(data);
  const config = createChartConfig(data);

  return (
    <div className="flex items-center justify-center">
      <ChartContainer config={config} className="max-h-[300px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}

export default function SimpleChart({ 
  title, 
  description, 
  data, 
  type, 
  height = 300 
}: SimpleChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <SimpleBarChart data={data} />;
      case 'line':
        return <SimpleLineChart data={data} />;
      case 'pie':
        return <SimplePieChart data={data} />;
      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Chart type not supported
          </div>
        );
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent style={{ height: height - 100 }}>
        {renderChart()}
      </CardContent>
    </Card>
  );
}

export type { ChartDataPoint, SimpleChartProps }; 