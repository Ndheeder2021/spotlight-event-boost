import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </CardContent>
  </Card>
);

export const SkeletonCaseStudyCard = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <CardHeader>
      <Skeleton className="h-8 w-3/4 mb-3" />
      <Skeleton className="h-5 w-full" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-3 py-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-10 w-20 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-10 w-20 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export const SkeletonBlogCard = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <CardHeader>
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-7 w-4/5 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export const SkeletonStats = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton className="h-12 w-24" />
    <Skeleton className="h-4 w-32" />
  </div>
);

export const SkeletonTestimonial = () => (
  <Card className="border-2">
    <CardContent className="p-8 space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const SkeletonHero = () => (
  <div className="space-y-8 animate-pulse">
    <div className="space-y-4">
      <Skeleton className="h-16 w-full max-w-4xl mx-auto" />
      <Skeleton className="h-16 w-5/6 max-w-3xl mx-auto" />
      <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto mt-6" />
    </div>
    <div className="flex gap-4 justify-center">
      <Skeleton className="h-12 w-40" />
      <Skeleton className="h-12 w-40" />
    </div>
  </div>
);
