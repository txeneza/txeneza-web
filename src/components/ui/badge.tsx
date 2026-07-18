import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "info" | "success" | "warning" | "error" | "default";
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  children,
  ...props
}) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold leading-4";
  
  const variants = {
    default: "bg-grey200 dark:bg-grey800/60 text-grey800 dark:text-grey100",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
