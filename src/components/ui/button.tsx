import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const sizes = {
      sm: "px-3 py-2 text-xs gap-1.5 min-h-[36px]",
      md: "px-4 py-2.5 text-sm gap-2 min-h-[44px]",
      lg: "px-5 py-3 text-base gap-2.5 min-h-[48px]",
    };

    const variants = {
      primary:
        "bg-forestGreen text-white hover:bg-forestGreen/90 shadow-sm hover:shadow-md focus-visible:ring-forestGreen/40 dark:bg-limeGreen dark:text-forestGreen dark:hover:bg-lightLime dark:focus-visible:ring-limeGreen/40 dark:focus-visible:ring-offset-grey900",
      secondary:
        "bg-grey100 dark:bg-grey800/80 text-grey800 dark:text-grey100 border border-grey200/80 dark:border-grey700/60 hover:bg-grey200/70 dark:hover:bg-grey700/80 focus-visible:ring-grey400 dark:focus-visible:ring-offset-grey900",
      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow focus-visible:ring-red-500 dark:focus-visible:ring-offset-grey900",
      ghost:
        "bg-transparent text-grey700 dark:text-grey300 hover:bg-grey100 dark:hover:bg-grey800/60 focus-visible:ring-grey400 dark:focus-visible:ring-offset-grey900",
      outline:
        "bg-transparent border border-grey300 dark:border-grey700 text-grey800 dark:text-grey200 hover:bg-grey100/50 dark:hover:bg-grey800/50 focus-visible:ring-grey400 dark:focus-visible:ring-offset-grey900",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

