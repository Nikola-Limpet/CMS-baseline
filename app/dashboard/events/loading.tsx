import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ShimmerSkeleton, StatsLoadingSkeleton, TableLoadingSkeleton } from '@/components/ui/enhanced-loading';

export default function EventsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <ShimmerSkeleton className="h-8 w-[180px] mb-2" />
          <ShimmerSkeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex gap-2">
          <ShimmerSkeleton className="h-9 w-[100px]" />
          <ShimmerSkeleton className="h-9 w-[140px]" />
        </div>
      </div>

      {/* Stats */}
      <StatsLoadingSkeleton count={4} />

      {/* Table Card */}
      <Card>
        <CardHeader>
          <ShimmerSkeleton className="h-6 w-[160px]" />
          <ShimmerSkeleton className="h-4 w-[260px]" />
        </CardHeader>
        <CardContent>
          <TableLoadingSkeleton columns={5} rows={8} />
        </CardContent>
      </Card>
    </div>
  );
}
