import React from "react";
import { Skeleton, SkeletonCard, SkeletonText, SkeletonBadge } from "@/components/ui/skeleton";

export function ReportsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 2-Columns Grid: Generator Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Form Skeleton */}
        <SkeletonCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div>
              <SkeletonText className="w-48 h-5 mb-1" />
              <SkeletonText className="w-64 h-3" />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-2">
            <div>
              <SkeletonText className="w-32 h-3.5 mb-2" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            </div>

            <div>
              <SkeletonText className="w-32 h-3.5 mb-2" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <SkeletonText className="w-20 h-3 mb-1.5" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
              <div>
                <SkeletonText className="w-20 h-3 mb-1.5" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
            </div>

            <Skeleton className="w-full h-12 rounded-xl mt-2" />
          </div>
        </SkeletonCard>

        {/* History Panel Skeleton */}
        <SkeletonCard className="p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-grey200/60 dark:border-grey800/60">
            <div className="flex items-center justify-between mb-3">
              <SkeletonText className="w-40 h-5" />
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-9 rounded-lg" />
              <Skeleton className="w-28 h-9 rounded-lg" />
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-grey100 dark:border-grey800/60 bg-grey50/50 dark:bg-grey950/30">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <div>
                    <SkeletonText className="w-36 h-3.5 mb-1" />
                    <SkeletonText className="w-24 h-2.5" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SkeletonBadge className="w-14 h-5" />
                  <Skeleton className="w-7 h-7 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}
