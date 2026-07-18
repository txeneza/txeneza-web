import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", children, ...props }, ref) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-forestGreen text-white hover:bg-forestGreen/90 focus:ring-forestGreen/40 dark:bg-limeGreen dark:text-forestGreen dark:hover:bg-lightLime dark:focus:ring-limeGreen/40",
      secondary: "bg-grey200 dark:bg-grey800 text-grey800 dark:text-grey100 hover:bg-grey300 dark:hover:bg-grey700 focus:ring-grey400",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      ghost: "bg-transparent text-grey600 dark:text-grey300 hover:bg-grey200 dark:hover:bg-grey800/60 focus:ring-grey400",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
