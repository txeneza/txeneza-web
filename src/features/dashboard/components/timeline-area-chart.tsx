import React from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";

interface TimelineAreaChartProps {
  data: {
    date: string;
    count: number;
  }[];
}

export const TimelineAreaChart: React.FC<TimelineAreaChartProps> = ({ data }) => {
  const options: any = {
    data: data,
    background: {
      fill: "transparent",
    },
    series: [
      {
        type: "area",
        xKey: "date",
        yKey: "count",
        fill: "#10b981", // Emerald
        fillOpacity: 0.15,
        stroke: "#10b981",
        strokeWidth: 3,
        marker: {
          fill: "#b5f230", // Lime Green
          stroke: "#10b981",
          strokeWidth: 2,
          size: 6,
        },
      },
    ],
    // AG Charts v14: `axes` é um dicionário { x, y }, não um array.
    axes: {
      x: {
        type: "category",
        position: "bottom",
        label: {
          color: "#94a3b8",
        },
        line: {
          stroke: "#334155",
        },
      },
      y: {
        type: "number",
        position: "left",
        label: {
          color: "#94a3b8",
        },
        gridLine: {
          style: [
            {
              stroke: "#1e293b",
              lineDash: [4, 4],
            },
          ],
        },
      },
    },
  };

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background dark:bg-grey900/60 backdrop-blur-md border border-grey200 dark:border-grey800 dark:border-grey800/80 rounded-2xl shadow-sm h-[320px] flex flex-col col-span-1 md:col-span-2">
      <h3 className="text-sm font-semibold text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 uppercase tracking-wider mb-2">
        Histórico de Ocorrências (Evolução Temporal)
      </h3>
      <div className="flex-1 min-h-0">
        <AgCharts options={options} />
      </div>
    </div>
  );
};
