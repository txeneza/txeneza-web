import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-grey700 dark:text-grey300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2.5 text-base sm:text-sm min-h-[44px] rounded-xl border bg-white dark:bg-grey900/90 border-grey300/80 dark:border-grey700/80 text-grey900 dark:text-grey50 placeholder:text-grey400 dark:placeholder:text-grey500 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-forestGreen/40 dark:focus-visible:ring-limeGreen/40 focus-visible:border-forestGreen dark:focus-visible:border-limeGreen disabled:opacity-60 disabled:bg-grey100 dark:disabled:bg-grey800/50 ${
            error ? "border-red-500/80 focus-visible:ring-red-500/30 dark:border-red-500/80" : ""
          } ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs font-medium text-red-500">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-grey500 dark:text-grey400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

