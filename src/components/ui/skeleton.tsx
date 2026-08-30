import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rounded" | "circle" | "rectangle";
}

/**
 * Primitiva base de Skeleton com efeito shimmer elegante e suporte a modo claro/escuro.
 */
export function Skeleton({
  className = "",
  variant = "rounded",
  ...props
}: SkeletonProps) {
  const variantClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "rectangle"
      ? "rounded-none"
      : "rounded-xl";

  return (
    <div
      className={`relative overflow-hidden bg-grey200/80 dark:bg-grey800/60 animate-pulse ${variantClass} ${className}`}
      {...props}
    >
      {/* Gradiente de Shimmer sutil */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export function SkeletonText({
  className = "w-full h-4",
  ...props
}: SkeletonProps) {
  return <Skeleton className={`rounded-md ${className}`} {...props} />;
}

export function SkeletonBadge({
  className = "w-20 h-6",
  ...props
}: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`} {...props} />;
}

export function SkeletonButton({
  className = "w-28 h-10",
  ...props
}: SkeletonProps) {
  return <Skeleton className={`rounded-xl ${className}`} {...props} />;
}

export function SkeletonCard({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-5 rounded-2xl border border-grey200/80 dark:border-grey800/80 bg-white/70 dark:bg-grey900/70 backdrop-blur-sm shadow-xs ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
