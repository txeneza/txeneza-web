import React from "react";
import { Skeleton, SkeletonCard, SkeletonText, SkeletonBadge } from "@/components/ui/skeleton";

export function OccurrenceDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div>
            <SkeletonText className="w-64 h-6 mb-1.5" />
            <SkeletonText className="w-40 h-3.5" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-32 h-10 rounded-xl" />
          <Skeleton className="w-10 h-10 rounded-xl" />
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Photos Carousel Skeleton */}
          <SkeletonCard className="p-0 overflow-hidden">
            <Skeleton className="w-full h-80 rounded-none" />
          </SkeletonCard>

          {/* Description & Details */}
          <SkeletonCard className="p-6">
            <SkeletonText className="w-32 h-4 mb-4" />
            <SkeletonText className="w-full h-4 mb-2" />
            <SkeletonText className="w-5/6 h-4 mb-2" />
            <SkeletonText className="w-2/3 h-4" />
          </SkeletonCard>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} className="p-4 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <SkeletonText className="w-20 h-3 mb-1" />
                  <SkeletonText className="w-32 h-4" />
                </div>
              </SkeletonCard>
            ))}
          </div>

          {/* Proof of Resolution Skeleton */}
          <SkeletonCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <SkeletonText className="w-48 h-4" />
              <Skeleton className="w-28 h-8 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          </SkeletonCard>
        </div>

        {/* Right Column (1 Col) */}
        <div className="flex flex-col gap-6">
          {/* Status Panel Skeleton */}
          <SkeletonCard className="p-6">
            <SkeletonText className="w-28 h-4 mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <SkeletonBadge className="w-24 h-7" />
              <SkeletonBadge className="w-20 h-7" />
            </div>
            <Skeleton className="w-full h-11 rounded-xl mb-3" />
            <Skeleton className="w-full h-11 rounded-xl" />
          </SkeletonCard>

          {/* Mini-map Location Skeleton */}
          <SkeletonCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-grey200/60 dark:border-grey800/60 flex items-center justify-between">
              <SkeletonText className="w-28 h-4" />
              <Skeleton className="w-16 h-4 rounded" />
            </div>
            <Skeleton className="w-full h-56 rounded-none" />
            <div className="p-4">
              <SkeletonText className="w-36 h-3.5 mb-1" />
              <SkeletonText className="w-48 h-3" />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
