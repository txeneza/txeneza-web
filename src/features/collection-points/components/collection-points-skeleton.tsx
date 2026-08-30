import React from "react";
import { Skeleton, SkeletonCard, SkeletonText, SkeletonBadge } from "@/components/ui/skeleton";

export function CollectionPointsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} className="flex items-center gap-3 p-4">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <SkeletonText className="w-16 h-3 mb-1" />
              <Skeleton className="w-12 h-6 rounded" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Split Grid: Form (Left) & List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Skeleton */}
        <SkeletonCard className="p-6 h-fit">
          <SkeletonText className="w-44 h-5 mb-2" />
          <SkeletonText className="w-60 h-3 mb-6" />

          <div className="flex flex-col gap-4">
            <div>
              <SkeletonText className="w-20 h-3 mb-1.5" />
              <Skeleton className="w-full h-10 rounded-xl" />
            </div>
            <div>
              <SkeletonText className="w-16 h-3 mb-1.5" />
              <Skeleton className="w-full h-10 rounded-xl" />
            </div>
            <div>
              <SkeletonText className="w-24 h-3 mb-1.5" />
              <Skeleton className="w-full h-10 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <SkeletonText className="w-16 h-3 mb-1.5" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
              <div>
                <SkeletonText className="w-16 h-3 mb-1.5" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
            </div>
            <Skeleton className="w-full h-11 rounded-xl mt-2" />
          </div>
        </SkeletonCard>

        {/* List & Table Skeleton */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl border border-grey200/80 dark:border-grey800/80 bg-white/70 dark:bg-grey900/70 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-grey200/60 dark:border-grey800/60 flex flex-col sm:flex-row gap-3 justify-between">
            <Skeleton className="flex-1 h-10 rounded-xl" />
            <Skeleton className="w-full sm:w-56 h-10 rounded-xl" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-grey200/60 dark:border-grey800/60 bg-grey50/50 dark:bg-grey950/40">
                  <th className="py-3 px-5"><Skeleton className="w-24 h-3" /></th>
                  <th className="py-3 px-5"><Skeleton className="w-20 h-3" /></th>
                  <th className="py-3 px-5 hidden lg:table-cell"><Skeleton className="w-16 h-3" /></th>
                  <th className="py-3 px-5 hidden md:table-cell"><Skeleton className="w-20 h-3" /></th>
                  <th className="py-3 px-5"><Skeleton className="w-14 h-3" /></th>
                  <th className="py-3 px-5 text-right"><Skeleton className="w-12 h-3 ml-auto" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey100 dark:divide-grey800/60">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-5">
                      <SkeletonText className="w-32 h-4 mb-1" />
                      <SkeletonText className="w-48 h-3" />
                    </td>
                    <td className="py-3.5 px-5"><Skeleton className="w-20 h-4 rounded" /></td>
                    <td className="py-3.5 px-5 hidden lg:table-cell"><Skeleton className="w-24 h-4 rounded" /></td>
                    <td className="py-3.5 px-5 hidden md:table-cell"><Skeleton className="w-28 h-3 rounded" /></td>
                    <td className="py-3.5 px-5"><SkeletonBadge className="w-16 h-6" /></td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Skeleton className="w-7 h-7 rounded-lg" />
                        <Skeleton className="w-7 h-7 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
