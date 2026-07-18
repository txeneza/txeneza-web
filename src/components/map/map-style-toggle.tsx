"use client";

import React from "react";
import { Map as MapIcon, Satellite } from "lucide-react";

export type MapStyleMode = "normal" | "satellite";

interface MapStyleToggleProps {
  mode: MapStyleMode;
  onChange: (mode: MapStyleMode) => void;
  className?: string;
}

/**
 * Controlo flutuante para alternar entre os dois estilos do mapa
 * (Normal / Satélite), configurados via env.mapboxStyles.
 */
export const MapStyleToggle: React.FC<MapStyleToggleProps> = ({ mode, onChange, className = "" }) => {
  return (
    <div
      className={`flex items-center gap-0.5 p-1 bg-light-background/90 dark:bg-grey900/90 backdrop-blur-md rounded-xl border border-grey200 dark:border-grey800/80 shadow-lg ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("normal")}
        title="Mapa normal"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-colors ${
          mode === "normal"
            ? "bg-forestGreen text-white dark:bg-limeGreen dark:text-grey900"
            : "text-grey600 dark:text-grey400 hover:bg-grey100 dark:hover:bg-grey800"
        }`}
      >
        <MapIcon className="w-3.5 h-3.5" />
        Mapa
      </button>
      <button
        type="button"
        onClick={() => onChange("satellite")}
        title="Vista de satélite"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-colors ${
          mode === "satellite"
            ? "bg-forestGreen text-white dark:bg-limeGreen dark:text-grey900"
            : "text-grey600 dark:text-grey400 hover:bg-grey100 dark:hover:bg-grey800"
        }`}
      >
        <Satellite className="w-3.5 h-3.5" />
        Satélite
      </button>
    </div>
  );
};
