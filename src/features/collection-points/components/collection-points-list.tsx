"use client";

import React from "react";
import { PontoRecolhaData } from "../hooks/use-collection-points";
import { CheckCircle2, XCircle, Clock, MapPin, Inbox } from "lucide-react";

interface CollectionPointsListProps {
  points: PontoRecolhaData[];
  loading: boolean;
}

export const CollectionPointsList: React.FC<CollectionPointsListProps> = ({
  points,
  loading,
}) => {
  if (loading) {
    return (
      <div className="p-8 bg-light-background dark:bg-dark-background dark:bg-grey900/60 backdrop-blur-md border border-grey200 dark:border-grey800 dark:border-grey800/80 rounded-2xl flex flex-col items-center justify-center gap-3 h-[400px]">
        <div className="w-8 h-8 border-2 border-limeGreen border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500">
          A carregar pontos de recolha...
        </span>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="p-8 bg-light-background dark:bg-dark-background dark:bg-grey900/60 backdrop-blur-md border border-grey200 dark:border-grey800 dark:border-grey800/80 rounded-2xl flex flex-col items-center justify-center gap-3 h-[400px] text-center">
        <div className="p-4 bg-grey200 dark:bg-grey800/60 dark:bg-gray-850 rounded-full text-grey300 dark:text-grey500 dark:text-grey600 dark:text-grey300">
          <Inbox className="w-8 h-8" />
        </div>
        <h4 className="font-bold text-grey900 dark:text-grey50 dark:text-white mt-2">Nenhum Ponto Cadastrado</h4>
        <p className="text-xs text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 max-w-xs leading-relaxed">
          Ainda não foram definidos pontos de recolha oficiais. Utilize o formulário para registar o primeiro local.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-light-background dark:bg-dark-background dark:bg-grey900/60 backdrop-blur-md border border-grey200 dark:border-grey800 dark:border-grey800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-6 border-b border-grey200 dark:border-grey800/80 dark:border-grey800/60 flex justify-between items-center bg-grey100 dark:bg-grey900/40/50 dark:bg-grey900/40">
        <div>
          <h3 className="font-bold text-grey900 dark:text-grey50 dark:text-white">Lista de Pontos Oficiais</h3>
          <p className="text-xs text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 mt-0.5">
            Locais autorizados de despejo e recolha de resíduos sólidos.
          </p>
        </div>
        <span className="text-xs font-bold bg-limeGreen/10 text-limeGreen px-2.5 py-1 rounded-full border border-limeGreen/10">
          {points.length} {points.length === 1 ? "Ponto" : "Pontos"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-grey850 text-xs font-bold text-grey300 dark:text-grey500 dark:text-grey600 dark:text-grey400 uppercase tracking-wider bg-grey100 dark:bg-grey900/40/20 dark:bg-grey950/20">
              <th className="py-3.5 px-6">Nome / Local</th>
              <th className="py-3.5 px-6">Bairro</th>
              <th className="py-3.5 px-6">Horário</th>
              <th className="py-3.5 px-6">Coordenadas</th>
              <th className="py-3.5 px-6 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
            {points.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-grey100 dark:bg-grey900/40/40 dark:hover:bg-grey950/10 text-sm text-grey900 dark:text-grey50 dark:text-gray-100 transition-colors"
              >
                {/* Nome */}
                <td className="py-4 px-6 font-bold">{p.nome}</td>

                {/* Bairro */}
                <td className="py-4 px-6 text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500">{p.bairro}</td>

                {/* Horário */}
                <td className="py-4 px-6">
                  {p.horario ? (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-grey200 dark:bg-grey800/60 dark:bg-gray-800 text-grey600 dark:text-grey300 dark:text-grey200 dark:text-grey700 py-1 px-2.5 rounded-lg border border-grey200 dark:border-grey800/50 dark:border-grey700 dark:border-grey800/50">
                      <Clock className="w-3.5 h-3.5 text-limeGreen" />
                      {p.horario}
                    </span>
                  ) : (
                    <span className="text-xs text-grey300 dark:text-grey500 dark:text-grey600 dark:text-grey300">Não especificado</span>
                  )}
                </td>

                {/* Coordenadas */}
                <td className="py-4 px-6 font-mono text-xs text-grey600 dark:text-grey400 dark:text-grey400 dark:text-grey500">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                  </span>
                </td>

                {/* Estado */}
                <td className="py-4 px-6 text-right">
                  {p.estado === "activo" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 py-1 px-2.5 rounded-full border border-emerald-250 dark:border-emerald-900/50 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-450 py-1 px-2.5 rounded-full border border-red-250 dark:border-red-900/50 font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      Inativo
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
