import React from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";

interface GravityDonutChartProps {
  data: {
    baixa: number;
    media: number;
    alta: number;
    critica: number;
  };
}

export const GravityDonutChart: React.FC<GravityDonutChartProps> = ({ data }) => {
  const chartData = [
    { gravity: "Baixa", count: data.baixa },
    { gravity: "Média", count: data.media },
    { gravity: "Alta", count: data.alta },
    { gravity: "Crítica", count: data.critica },
  ];

  const options: any = {
    data: chartData,
    background: {
      fill: "transparent",
    },
    series: [
      {
        type: "donut",
        angleKey: "count",
        calloutLabelKey: "gravity",
        sectorLabelKey: "count",
        innerRadiusRatio: 0.65,
        fills: ["#10b981", "#fbbf24", "#f87171", "#991b1b"], // Emerald, Amber, Red-light, Red-dark
        strokes: ["transparent"],
        calloutLabel: {
          color: "#94a3b8", // slate-400
          fontWeight: "bold",
        },
        sectorLabel: {
          color: "#ffffff",
          fontWeight: "black",
        },
      },
    ],
    legend: {
      position: "bottom",
      item: {
        label: {
          color: "#94a3b8",
        },
      },
    },
  };

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background dark:bg-grey900/60 backdrop-blur-md border border-grey200 dark:border-grey800 dark:border-grey800/80 rounded-2xl shadow-sm h-[320px] flex flex-col">
      <h3 className="text-sm font-semibold text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 uppercase tracking-wider mb-2">
        Níveis de Gravidade
      </h3>
      <div className="flex-1 min-h-0">
        <AgCharts options={options} />
      </div>
    </div>
  );
};
