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
  valueClass = "text-grey900 dark:text-grey50 dark:text-white",
}) => {
  return (
    <div
      className={`p-6 bg-light-background dark:bg-dark-background dark:bg-grey900/60 backdrop-blur-md border border-grey200 dark:border-grey800 dark:border-grey800/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group ${borderClass}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 font-semibold uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="text-grey300 dark:text-grey500 dark:text-grey600 dark:text-grey400 group-hover:text-limeGreen transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>
      
      <div className={`text-3xl font-black mt-2.5 tracking-tight ${valueClass}`}>
        {value}
      </div>

      {trend && (
        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold">
          <span className={trend.positive ? "text-emerald-500" : "text-rose-500"}>
            {trend.value}
          </span>
          <span className="text-grey300 dark:text-grey500 dark:text-grey600 dark:text-grey400 font-normal">
            em relação ao mês passado
          </span>
        </div>
      )}
    </div>
  );
};
