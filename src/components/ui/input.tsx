import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-grey800 dark:text-grey200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen/40 bg-light-background dark:bg-grey900 border-grey300 dark:border-grey800 text-grey900 dark:text-grey50 ${
            error ? "border-red-500 focus:ring-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
