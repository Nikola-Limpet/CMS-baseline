import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ShimmerSkeleton, StatsLoadingSkeleton } from '@/components/ui/enhanced-loading';

export default function MediaLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <ShimmerSkeleton className="h-8 w-[180px] mb-2" />
          <ShimmerSkeleton className="h-4 w-[280px]" />
        </div>
        <div className="flex gap-2">
          <ShimmerSkeleton className="h-9 w-[100px]" />
          <ShimmerSkeleton className="h-9 w-[100px]" />
        </div>
      </div>
      <StatsLoadingSkeleton count={3} />
      <ShimmerSkeleton className="h-9 w-[200px]" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <ShimmerSkeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}
