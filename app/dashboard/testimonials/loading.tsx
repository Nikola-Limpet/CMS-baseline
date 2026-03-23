import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ShimmerSkeleton, StatsLoadingSkeleton, TableLoadingSkeleton } from '@/components/ui/enhanced-loading';

export default function TestimonialsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <ShimmerSkeleton className="h-8 w-[180px] mb-2" />
          <ShimmerSkeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex gap-2">
          <ShimmerSkeleton className="h-9 w-[100px]" />
          <ShimmerSkeleton className="h-9 w-[160px]" />
        </div>
      </div>
      <StatsLoadingSkeleton count={4} />
      <Card>
        <CardHeader>
          <ShimmerSkeleton className="h-6 w-[160px]" />
        </CardHeader>
        <CardContent>
          <TableLoadingSkeleton columns={5} rows={6} />
        </CardContent>
      </Card>
    </div>
  );
}
