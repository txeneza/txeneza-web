import React from "react";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export function MapSkeleton({ isHeatmap = false }: { isHeatmap?: boolean }) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
          <div>
            <SkeletonText className="w-56 h-6 mb-1.5" />
            <SkeletonText className="w-80 h-3.5" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-28 h-9 rounded-xl" />
          <Skeleton className="w-28 h-9 rounded-xl" />
        </div>
      </div>

      {isHeatmap && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} className="p-4 flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <SkeletonText className="w-24 h-3 mb-1" />
                <Skeleton className="w-16 h-6 rounded" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      )}

      {/* Interactive Map Canvas Skeleton */}
      <div className="relative w-full h-[600px] rounded-2xl border border-grey200/80 dark:border-grey800/80 bg-grey100 dark:bg-grey950 overflow-hidden shadow-xs">
        <Skeleton className="w-full h-full rounded-none" />

        {/* Floating Top Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Skeleton className="w-40 h-9 rounded-xl" />
        </div>

        {/* Floating Stat Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Skeleton className="w-36 h-12 rounded-xl" />
        </div>

        {/* Floating Legend Badge */}
        <div className="absolute bottom-8 left-4 z-10">
          <Skeleton className="w-44 h-16 rounded-xl" />
        </div>

        {/* Floating Style Toggle */}
        <div className="absolute bottom-8 right-4 z-10">
          <Skeleton className="w-36 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
