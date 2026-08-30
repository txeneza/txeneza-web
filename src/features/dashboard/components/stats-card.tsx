import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  borderClass?: string;
  valueClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  borderClass = "",
  valueClass = "text-grey900 dark:text-grey50",
}) => {
  return (
    <div
      className={`p-5 bg-white dark:bg-grey900/90 border border-grey200/80 dark:border-grey800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-grey300 dark:hover:border-grey700/80 transition-all duration-200 group ${borderClass}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] text-grey500 dark:text-grey400 font-bold uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-grey100/80 dark:bg-grey800/60 border border-grey200/60 dark:border-grey700/50 flex items-center justify-center text-grey500 dark:text-grey400 group-hover:text-forestGreen dark:group-hover:text-limeGreen transition-colors duration-200">
            {icon}
          </div>
        )}
      </div>

      <div className={`text-2xl sm:text-3xl font-black mt-3 tracking-tight ${valueClass}`}>
        {value}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
              trend.positive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-grey400 dark:text-grey500 text-[11px] font-normal">
            vs. mês anterior
          </span>
        </div>
      )}
    </div>
  );
};
