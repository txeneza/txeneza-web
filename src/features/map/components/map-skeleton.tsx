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

      {isHeatmap ? (
        <>
          {/* Métricas */}
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

          {/* Canvas do Mapa de Calor */}
          <div className="relative w-full h-[600px] rounded-2xl border border-grey200/80 dark:border-grey800/80 bg-grey100 dark:bg-grey950 overflow-hidden shadow-xs">
            <Skeleton className="w-full h-full rounded-none" />
            <div className="absolute top-4 left-4 z-10">
              <Skeleton className="w-40 h-9 rounded-xl" />
            </div>
            <div className="absolute top-4 right-14 z-10">
              <Skeleton className="w-36 h-12 rounded-xl" />
            </div>
            <div className="absolute bottom-8 left-4 z-10">
              <Skeleton className="w-44 h-16 rounded-xl" />
            </div>
            <div className="absolute bottom-8 right-4 z-10">
              <Skeleton className="w-36 h-10 rounded-xl" />
            </div>
          </div>

          {/* Cartões Informativos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} className="p-5">
                <SkeletonText className="w-24 h-3 mb-2" />
                <SkeletonText className="w-full h-4 mb-1" />
                <SkeletonText className="w-3/4 h-4" />
              </SkeletonCard>
            ))}
          </div>
        </>
      ) : (
        /* Layout de 2 colunas para /admin/map */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas do Mapa */}
          <div className="lg:col-span-2 relative w-full h-[550px] rounded-2xl border border-grey200/80 dark:border-grey800/80 bg-grey100 dark:bg-grey950 overflow-hidden shadow-xs">
            <Skeleton className="w-full h-full rounded-none" />
            <div className="absolute top-4 right-4 z-10">
              <Skeleton className="w-36 h-10 rounded-xl" />
            </div>
          </div>

          {/* Painel Lateral */}
          <div className="flex flex-col gap-4">
            {/* Legenda Skeleton */}
            <SkeletonCard className="p-4 flex flex-col gap-3">
              <SkeletonText className="w-20 h-3 mb-1" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-6 h-6 rounded-lg shrink-0" />
                <SkeletonText className="w-40 h-4" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                <SkeletonText className="w-44 h-4" />
              </div>
            </SkeletonCard>

            {/* Contagens Skeleton */}
            <div className="grid grid-cols-2 gap-3">
              <SkeletonCard className="p-3">
                <SkeletonText className="w-16 h-3 mb-1" />
                <Skeleton className="w-12 h-6 rounded" />
              </SkeletonCard>
              <SkeletonCard className="p-3">
                <SkeletonText className="w-16 h-3 mb-1" />
                <Skeleton className="w-12 h-6 rounded" />
              </SkeletonCard>
            </div>

            {/* Detalhe Selecionado / Placeholder Skeleton */}
            <SkeletonCard className="p-6 h-48 flex flex-col items-center justify-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <SkeletonText className="w-3/4 h-4" />
              <SkeletonText className="w-1/2 h-3" />
            </SkeletonCard>
          </div>
        </div>
      )}
    </div>
  );
}
