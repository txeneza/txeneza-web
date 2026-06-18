"use client";

import React, { useEffect, useState } from "react";
import { Occurrence } from "@/features/occurrences/occurrences.types";

interface MapViewProps {
  markers?: Occurrence[];
  heatmapData?: { lat: number; lng: number; intensity: number }[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (occ: Occurrence) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  markers = [],
  heatmapData = [],
  center = [-19.8272, 34.8384],
  zoom = 13,
  onMarkerClick,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">
        <span className="text-gray-400">A carregar mapa...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* 
        Nota: Em produção, importar Leaflet e React-Leaflet dinamicamente ou diretamente aqui:
        import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
      */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <p className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">
          Mapa Interativo da Beira (Txeneza)
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
          Visualização de {markers.length} marcadores ativos e {heatmapData.length} pontos de calor de ocorrências.
        </p>
        
        {/* Lista visual simples de simulação de marcadores */}
        <div className="flex flex-wrap gap-2 justify-center max-w-xl">
          {markers.map((occ) => (
            <button
              key={occ.id}
              onClick={() => onMarkerClick?.(occ)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
            >
              📍 {occ.title} ({occ.category})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
