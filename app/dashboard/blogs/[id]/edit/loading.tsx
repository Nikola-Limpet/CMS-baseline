import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ShimmerSkeleton } from '@/components/ui/enhanced-loading';

export default function EditBlogLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <ShimmerSkeleton className="h-9 w-[80px]" />
        <div>
          <ShimmerSkeleton className="h-8 w-[180px] mb-2" />
          <ShimmerSkeleton className="h-4 w-[260px]" />
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <ShimmerSkeleton className="h-6 w-[160px]" />
          <ShimmerSkeleton className="h-4 w-[280px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <ShimmerSkeleton className="h-4 w-[60px]" />
            <ShimmerSkeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <ShimmerSkeleton className="h-4 w-[80px]" />
            <ShimmerSkeleton className="h-9 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <ShimmerSkeleton className="h-4 w-[80px]" />
              <ShimmerSkeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <ShimmerSkeleton className="h-4 w-[60px]" />
              <ShimmerSkeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <ShimmerSkeleton className="h-4 w-[120px]" />
            <ShimmerSkeleton className="h-32 w-full" />
          </div>
          <div className="space-y-2">
            <ShimmerSkeleton className="h-4 w-[80px]" />
            <ShimmerSkeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <ShimmerSkeleton className="h-9 w-[100px]" />
        <div className="flex gap-2">
          <ShimmerSkeleton className="h-9 w-[100px]" />
          <ShimmerSkeleton className="h-9 w-[120px]" />
          <ShimmerSkeleton className="h-9 w-[100px]" />
        </div>
      </div>
    </div>
  );
}
