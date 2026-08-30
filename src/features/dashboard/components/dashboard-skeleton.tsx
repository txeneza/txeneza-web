import React from "react";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} className="flex flex-col justify-between h-[130px] p-5">
            <div className="flex items-center justify-between">
              <SkeletonText className="w-24 h-3.5" />
              <Skeleton className="w-9 h-9 rounded-xl" />
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <Skeleton className="w-20 h-8 rounded-lg" />
              <Skeleton className="w-14 h-4 rounded-md" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gravity Donut Chart Skeleton */}
        <SkeletonCard className="h-[380px] flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SkeletonText className="w-36 h-4" />
              <Skeleton className="w-6 h-6 rounded-lg" />
            </div>
            <SkeletonText className="w-48 h-3" />
          </div>

          {/* Círculo simulado do gráfico Donut */}
          <div className="relative flex items-center justify-center my-auto">
            <Skeleton className="w-44 h-44 rounded-full border-8 border-grey100 dark:border-grey800" />
            <div className="absolute w-24 h-24 bg-white dark:bg-grey900 rounded-full flex flex-col items-center justify-center">
              <Skeleton className="w-10 h-5 rounded" />
            </div>
          </div>

          {/* Legendas */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-grey100 dark:border-grey800/60">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <SkeletonText className="w-16 h-3" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Category Bar Chart Skeleton */}
        <SkeletonCard className="lg:col-span-2 h-[380px] flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SkeletonText className="w-44 h-4" />
              <Skeleton className="w-20 h-6 rounded-lg" />
            </div>
            <SkeletonText className="w-56 h-3" />
          </div>

          {/* Barras simuladas */}
          <div className="flex items-end justify-between gap-3 h-[200px] pt-8 px-4 border-b border-grey100 dark:border-grey800/60">
            {[45, 80, 60, 95, 30, 70, 85, 40].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <Skeleton className="w-full rounded-t-lg transition-all" style={{ height: `${h}%` }} />
                <Skeleton className="w-8 h-2.5 rounded" />
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-3">
            <SkeletonText className="w-24 h-3" />
            <SkeletonText className="w-32 h-3" />
          </div>
        </SkeletonCard>
      </div>

      {/* Timeline Area Chart Skeleton */}
      <SkeletonCard className="h-[360px] flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SkeletonText className="w-48 h-4" />
            <div className="flex gap-2">
              <Skeleton className="w-16 h-7 rounded-lg" />
              <Skeleton className="w-16 h-7 rounded-lg" />
            </div>
          </div>
          <SkeletonText className="w-64 h-3" />
        </div>

        {/* Onda/área simulada */}
        <div className="h-[200px] relative flex items-end px-2 pt-6 border-b border-grey100 dark:border-grey800/60">
          <Skeleton className="w-full h-full rounded-xl opacity-60" />
        </div>

        <div className="flex justify-between items-center pt-3">
          <SkeletonText className="w-32 h-3" />
          <SkeletonText className="w-20 h-3" />
        </div>
      </SkeletonCard>
    </div>
  );
}
