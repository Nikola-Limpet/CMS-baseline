import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ShimmerSkeleton, TableLoadingSkeleton } from '@/components/ui/enhanced-loading';

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <ShimmerSkeleton className="h-8 w-[200px] mb-2" />
          <ShimmerSkeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex gap-2">
          <ShimmerSkeleton className="h-9 w-[120px]" />
          <ShimmerSkeleton className="h-9 w-[100px]" />
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <ShimmerSkeleton className="h-6 w-[160px]" />
            <div className="flex gap-2">
              <ShimmerSkeleton className="h-9 w-[200px]" />
              <ShimmerSkeleton className="h-9 w-[140px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableLoadingSkeleton columns={6} rows={10} />
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <ShimmerSkeleton className="h-4 w-[150px]" />
            <div className="flex gap-2">
              <ShimmerSkeleton className="h-9 w-[80px]" />
              <ShimmerSkeleton className="h-9 w-[80px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
