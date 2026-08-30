import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "info" | "success" | "warning" | "error" | "default" | "brand";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  dot = false,
  children,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center gap-1.5 px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-semibold tracking-wide border max-w-full shrink-0";

  const variants = {
    default:
      "bg-grey100 text-grey800 dark:bg-grey800/80 dark:text-grey200 border-grey200 dark:border-grey700/60",
    brand:
      "bg-forestGreen/10 text-forestGreen dark:bg-limeGreen/15 dark:text-limeGreen border-forestGreen/20 dark:border-limeGreen/25",
    info:
      "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800/50",
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50",
    warning:
      "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
    error:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50",
  };

  const dotColors = {
    default: "bg-grey400",
    brand: "bg-forestGreen dark:bg-limeGreen",
    info: "bg-sky-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

