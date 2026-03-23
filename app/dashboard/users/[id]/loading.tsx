import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ShimmerSkeleton } from '@/components/ui/enhanced-loading';

export default function UserDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + Header with Avatar */}
      <div className="flex items-center gap-4">
        <ShimmerSkeleton className="h-9 w-[80px]" />
        <ShimmerSkeleton className="h-16 w-16 rounded-full" />
        <div>
          <ShimmerSkeleton className="h-8 w-[180px] mb-2" />
          <ShimmerSkeleton className="h-4 w-[240px]" />
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <ShimmerSkeleton className="h-6 w-[160px]" />
          <ShimmerSkeleton className="h-4 w-[280px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <ShimmerSkeleton className="h-4 w-[100px]" />
              <ShimmerSkeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <ShimmerSkeleton className="h-4 w-[100px]" />
              <ShimmerSkeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <ShimmerSkeleton className="h-4 w-[60px]" />
            <ShimmerSkeleton className="h-9 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <ShimmerSkeleton className="h-4 w-[80px]" />
              <ShimmerSkeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <ShimmerSkeleton className="h-4 w-[120px]" />
              <ShimmerSkeleton className="h-9 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Card */}
      <Card>
        <CardHeader>
          <ShimmerSkeleton className="h-6 w-[140px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <ShimmerSkeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <ShimmerSkeleton className="h-4 w-[200px] mb-1" />
                  <ShimmerSkeleton className="h-3 w-[140px]" />
                </div>
                <ShimmerSkeleton className="h-3 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <ShimmerSkeleton className="h-9 w-[100px]" />
        <div className="flex gap-2">
          <ShimmerSkeleton className="h-9 w-[120px]" />
          <ShimmerSkeleton className="h-9 w-[100px]" />
        </div>
      </div>
    </div>
  );
}
