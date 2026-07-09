"use client";

import React, { useEffect, useState } from "react";
// @ts-ignore
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { Occurrence } from "@/features/occurrences/occurrences.types";
import { MapPin, Clock, Info, AlertTriangle } from "lucide-react";
import { env } from "@/core/env";
import { useTheme } from "@/hooks/use-theme";

import "mapbox-gl/dist/mapbox-gl.css";

export interface PontoRecolhaMapData {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  bairro: string;
  horario: string | null;
  estado: "activo" | "inactivo";
}

interface MapViewProps {
  markers?: Occurrence[];
  collectionPoints?: PontoRecolhaMapData[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (occ: Occurrence) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  markers = [],
  collectionPoints = [],
  center = [-19.8272, 34.8384],
  zoom = 12,
  onMarkerClick,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PontoRecolhaMapData | null>(null);
  const [connectionWarning, setConnectionWarning] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[550px] bg-grey100 dark:bg-grey950 animate-pulse rounded-2xl flex items-center justify-center border border-grey200 dark:border-grey800">
        <span className="text-grey600 dark:text-grey500 text-sm">A carregar mapa...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[550px] bg-grey100 dark:bg-grey950 rounded-2xl overflow-hidden border border-grey200 dark:border-grey800 shadow-sm transition-all duration-300">
      {/* Aviso de Baixa Conectividade (TCC Scope Context) */}
      {connectionWarning && (
        <div className="absolute top-4 left-4 right-4 z-20 flex items-start gap-2.5 p-3.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl backdrop-blur-md text-xs font-bold animate-fadeIn">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1 leading-normal">
            Contexto de Baixa Conectividade: Texturas do mapa indisponíveis devido a oscilações de rede. As localizações georreferenciadas (pontos de recolha e focos de lixo) continuam visíveis sobre a grelha de cache local.
          </div>
          <button 
            onClick={() => setConnectionWarning(null)}
            className="px-2 py-1 hover:bg-amber-500/20 rounded-lg transition-colors shrink-0 text-[10px] font-black uppercase"
          >
            Dispensar
          </button>
        </div>
      )}

      <Map
        initialViewState={{
          latitude: center[0],
          longitude: center[1],
          zoom: zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"}
        mapboxAccessToken={env.mapboxToken}
        onError={() => {
          if (!connectionWarning) {
            setConnectionWarning("Conexão instável");
          }
        }}
      >
        {/* Marcadores de Ocorrências */}
        {markers.map((occ) => (
          <Marker
            key={occ.id}
            latitude={occ.latitude}
            longitude={occ.longitude}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              onMarkerClick?.(occ);
            }}
          >
            <button className="cursor-pointer p-1.5 bg-grey900/90 border border-limeGreen/40 rounded-xl shadow-xl hover:scale-110 transition-all duration-200">
              <MapPin className="w-4 h-4 text-red-500" />
            </button>
          </Marker>
        ))}

        {/* Marcadores de Pontos de Recolha */}
        {collectionPoints.map((point) => (
          <Marker
            key={point.id}
            latitude={point.latitude}
            longitude={point.longitude}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              setSelectedPoint(point);
            }}
          >
            <button className="cursor-pointer p-1 bg-forestGreen border border-limeGreen rounded-full shadow-2xl hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center">
              <img
                src="/icons/TXENEZA.svg"
                alt="Logo Ponto"
                className="w-5 h-5 object-contain filter brightness-110"
              />
            </button>
          </Marker>
        ))}

        {/* Popup de detalhes do Ponto de Recolha */}
        {selectedPoint && (
          <Popup
            latitude={selectedPoint.latitude}
            longitude={selectedPoint.longitude}
            anchor="top"
            onClose={() => setSelectedPoint(null)}
            closeOnClick={false}
            maxWidth="260px"
          >
            {/* O container do popup do Mapbox é sempre branco — cores fixas para legibilidade. */}
            <div className="p-1 flex flex-col gap-2 min-w-[210px] text-xs text-grey800">
              <div className="flex items-center gap-2 font-bold text-sm text-forestGreen border-b border-grey200 pb-1.5">
                <span className="p-1 bg-forestGreen rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                  <img src="/icons/TXENEZA.svg" className="w-3.5 h-3.5" alt="logo" />
                </span>
                <span className="leading-tight">{selectedPoint.nome}</span>
              </div>
              <div className="flex items-center gap-1.5 text-grey600">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Bairro: <b className="text-grey800">{selectedPoint.bairro}</b></span>
              </div>
              {selectedPoint.horario && (
                <div className="flex items-center gap-1.5 text-grey600">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Recolha: <b className="text-grey800">{selectedPoint.horario}</b></span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-grey600">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono text-[10px] text-grey600">
                  {selectedPoint.latitude.toFixed(4)}, {selectedPoint.longitude.toFixed(4)}
                </span>
              </div>
              <div className="mt-0.5 pt-1.5 border-t border-grey200">
                {selectedPoint.estado === "activo" ? (
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ● Operacional
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full border border-red-500/20">
                    ● Inativo
                  </span>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};
