"use client";

import React, { useEffect, useState } from "react";
// @ts-ignore
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import { Flame, Layers, TrendingUp } from "lucide-react";
import { env } from "@/core/env";
import { useTheme } from "@/hooks/use-theme";

import "mapbox-gl/dist/mapbox-gl.css";

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface HeatmapViewProps {
  data?: HeatmapPoint[];
  center?: [number, number];
  zoom?: number;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  data = [],
  center = [-19.8272, 34.8384],
  zoom = 12,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[600px] bg-grey100 dark:bg-grey950 animate-pulse rounded-2xl flex items-center justify-center border border-grey200 dark:border-grey800">
        <span className="text-grey600 dark:text-grey500 text-sm">A carregar mapa de calor...</span>
      </div>
    );
  }

  const geojsonSource: any = {
    type: "FeatureCollection",
    features: data.map((point) => ({
      type: "Feature" as const,
      properties: {
        intensity: point.intensity || 1,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [point.lng, point.lat],
      },
    })),
  };

  return (
    <div className="relative w-full h-[600px] bg-grey100 dark:bg-grey950 rounded-2xl overflow-hidden border border-grey200 dark:border-grey800 shadow-sm transition-all duration-300">
      
      {/* Badge flutuante Premium & Enterprise */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-forestGreen/90 dark:bg-grey900/80 backdrop-blur-md rounded-xl border border-limeGreen/30 shadow-lg">
        <Flame className="w-4 h-4 text-limeGreen" />
        <span className="text-xs font-black text-white uppercase tracking-wider">Mapa de Calor</span>
        <span className="text-[8px] tracking-wider uppercase px-1.5 py-0.5 bg-limeGreen/20 text-limeGreen rounded-md font-black border border-limeGreen/20">
          Premium & Enterprise
        </span>
      </div>

      {/* Legenda flutuante */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 px-3 py-2.5 bg-light-background/80 dark:bg-grey900/80 backdrop-blur-md rounded-xl border border-grey200 dark:border-grey800/80 shadow-lg">
        <span className="text-[10px] font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">Intensidade</span>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(to right, #01403A, #ADD9B8, #CEF2C4, #CBF277, #B5F230)" }} />
        </div>
        <div className="flex justify-between text-[9px] text-grey600 dark:text-grey500 font-mono">
          <span>Baixa</span>
          <span>Alta</span>
        </div>
      </div>

      {/* Estatísticas flutuantes */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 px-3 py-2 bg-light-background/80 dark:bg-grey900/80 backdrop-blur-md rounded-xl border border-grey200 dark:border-grey800/80 shadow-lg">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-limeGreen" />
          <span className="text-[10px] font-bold text-grey900 dark:text-grey50 uppercase tracking-wider">Pontos Ativos</span>
        </div>
        <span className="text-lg font-black text-forestGreen dark:text-limeGreen">{data.length}</span>
      </div>

      <Map
        initialViewState={{
          latitude: center[0],
          longitude: center[1],
          zoom: zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"}
        mapboxAccessToken={env.mapboxToken}
      >
        <Source id="heatmap-source" type="geojson" data={geojsonSource}>
          <Layer
            id="heatmap-layer"
            type="heatmap"
            maxzoom={15}
            paint={{
              "heatmap-weight": ["interpolate", ["linear"], ["get", "intensity"], 0, 0, 1, 1],
              "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(1, 64, 58, 0)",
                0.2,
                "rgba(173, 217, 184, 0.4)",
                0.4,
                "rgba(206, 242, 196, 0.7)",
                0.7,
                "rgba(203, 242, 119, 0.9)",
                1.0,
                "#B5F230"
              ],
              "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 4, 9, 24],
              "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0.95, 15, 0.6]
            }}
          />
        </Source>
      </Map>
    </div>
  );
};
