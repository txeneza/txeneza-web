import React from "react";
import { Skeleton, SkeletonCard, SkeletonText, SkeletonBadge } from "@/components/ui/skeleton";

export function OccurrencesTableSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Status Counts Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonCard key={i} className="flex items-center gap-3 p-4">
            <Skeleton className="w-3 h-3 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <SkeletonText className="w-16 h-3 mb-1.5" />
              <Skeleton className="w-10 h-6 rounded" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="flex-1 h-11 rounded-xl" />
        <Skeleton className="w-full sm:w-80 h-11 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-grey200/80 dark:border-grey800/80 bg-white/70 dark:bg-grey900/70 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-grey200/60 dark:border-grey800/60 flex items-center justify-between">
          <SkeletonText className="w-36 h-4" />
          <div className="flex gap-2">
            <Skeleton className="w-24 h-8 rounded-lg" />
            <Skeleton className="w-24 h-8 rounded-lg" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-grey200/60 dark:border-grey800/60 bg-grey50/50 dark:bg-grey950/40">
                <th className="py-3.5 px-4"><Skeleton className="w-12 h-3" /></th>
                <th className="py-3.5 px-4"><Skeleton className="w-28 h-3" /></th>
                <th className="py-3.5 px-4"><Skeleton className="w-20 h-3" /></th>
                <th className="py-3.5 px-4"><Skeleton className="w-24 h-3" /></th>
                <th className="py-3.5 px-4"><Skeleton className="w-16 h-3" /></th>
                <th className="py-3.5 px-4"><Skeleton className="w-16 h-3" /></th>
                <th className="py-3.5 px-4 text-right"><Skeleton className="w-12 h-3 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey100 dark:divide-grey800/60">
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <tr key={row} className="hover:bg-grey50/30 dark:hover:bg-grey800/20">
                  {/* Foto miniatura */}
                  <td className="py-3.5 px-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                  </td>
                  {/* Título e Descrição */}
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <SkeletonText className="w-40 h-4 mb-1.5" />
                    <SkeletonText className="w-56 h-3" />
                  </td>
                  {/* Bairro da ocorrência */}
                  <td className="py-3.5 px-4">
                    <SkeletonText className="w-24 h-3.5 mb-1" />
                    <Skeleton className="w-28 h-4 rounded-md" />
                  </td>
                  {/* Categoria */}
                  <td className="py-3.5 px-4">
                    <SkeletonBadge className="w-24 h-6" />
                  </td>
                  {/* Gravidade */}
                  <td className="py-3.5 px-4">
                    <SkeletonBadge className="w-16 h-6" />
                  </td>
                  {/* Estado */}
                  <td className="py-3.5 px-4">
                    <SkeletonBadge className="w-20 h-6" />
                  </td>
                  {/* Botão de Ação */}
                  <td className="py-3.5 px-4 text-right">
                    <Skeleton className="w-8 h-8 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
